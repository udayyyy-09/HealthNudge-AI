const User = require("../models/User");
const {askGemini} = require("../utils/gemini");
const upload = require("../middlewares/upload");
const pdfParse = require('pdf-parse');
const tesseract = require('tesseract.js');
const pdf = require('pdf-poppler');
const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { geminiService } = require('../service/GeminiService'); // Import your OpenAI service

const getDietPlan = async (req,res)=>{
    try{
        const user = await User.findById(req.user.userId);
        if(!user){
            console.log("User not found");
            return res.status(404).json({message: "User not found"});
        }

        const prompt =`
            You are a certified AI nutritionist.

            The user is ${user.age} years old, has the goal: "${user.goal}", and prefers a "${user.dietType}" diet.

            VERY IMPORTANT: ONLY suggest "${user.dietType}" food. Do NOT include any items that are not ${user.dietType}. For vegetarian, do NOT suggest any meat, poultry, or fish.

            Create a 1-day personalized diet plan with:
            - Breakfast
            - Lunch
            - Dinner
            - Optional snacks

            Use bullet points. Avoid long explanations or disclaimers. Be practical and realistic.
            `;

        //Get a diet plan from Gemini
        const response = await askGemini(prompt);
        if(!response){
            console.log("No response from Gemini");
            return res.status(500).json({message: "Failed to generate diet plan"}); 
        }
        res.status(200).json({message: "Diet Plan generated successfully", DietPlan: response}); 

    }catch(err){
        console.error("Error generating diet plan:", err);
        res.status(500).json({message: "Internal server error"});

    }
}

//function for anyalizing the report
function cleanOCRText(rawText) {
  if (!rawText || typeof rawText !== 'string') {
    return '';
  }

  let cleanedText = rawText
    // Remove garbled header text and noise patterns
    .replace(/^[A-Z\s&]+\d+\s*/g, '') // Remove garbled headers like "LIAUUUL FIN V ILI VIL I&1&"
    .replace(/[A-Za-z]{2,}\s+[oO]F\s+[A-Z]+\s+[A-Za-z]+\s+ee\s+ee\s+a+e+/gi, '') // Remove noise patterns
    .replace(/[=\-_]{3,}/g, '') // Remove separator lines
    .replace(/[|]{2,}/g, '') // Remove multiple pipes
    
    // Clean up line breaks and whitespace
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    .replace(/\s+/g, ' ')
    
    // Fix common OCR character errors
    .replace(/[|]/g, 'I')
    .replace(/[¡]/g, 'I')
    .replace(/[°]/g, 'o')
    .replace(/[×]/g, 'x')
    .replace(/&/g, 'and')
    
    // Fix number/letter confusion
    .replace(/[lI](\d)/g, '1$1') // "l5" -> "15"
    .replace(/(\d)[lI](?!\w)/g, '$11') // "5l" -> "51" (but not in words)
    .replace(/[oO](\d)/g, '0$1') // "O5" -> "05"
    .replace(/(\d)[oO](?!\w)/g, '$10') // "5O" -> "50"
    
    // Clean medical values and units
    .replace(/(\d+)\s*\.\s*(\d+)/g, '$1.$2') // "5 . 2" -> "5.2"
    .replace(/(\d+)\s+(mg\/dL|g\/dL|mmol\/L)/gi, '$1 $2') // Fix spacing with units
    .replace(/mg\/dl/gi, 'mg/dL') // Standardize units
    .replace(/g\/dl/gi, 'g/dL')
    
    // Fix comparison operators
    .replace(/\s*([<>=])\s*/g, ' $1 ')
    .replace(/>\s*([<>=])/g, '> $1') // Fix ">=" patterns
    .replace(/<\s*([<>=])/g, '< $1') // Fix "<=" patterns
    
    // Remove noise patterns specific to this report
    .replace(/\b[A-Za-z]{1,2}\s+[A-Za-z]{1,2}\s+[A-Za-z]{1,2}\s+ee+\b/gi, '')
    .replace(/\b[a-z]{1,2}\s+[a-z]{1,2}\s+[A-Z]{2,}\b/g, '')
    .replace(/\bEe+\b/gi, '') // Remove "EeEE" patterns
    .replace(/\b[a-z]+\s+abe\s+oe\b/gi, '') // Remove "lobe abe oe" patterns
    
    // Clean up table separators and formatting
    .replace(/[\-_=]{2,}/g, '') // Remove separator lines
    .replace(/\s*\|\s*/g, ' | ') // Clean pipe separators
    .replace(/\s{2,}/g, ' ') // Multiple spaces to single
    
    // Fix broken words
    .replace(/\b([A-Z][a-z]+)\s*,\s*([A-Z][a-z]+)\b/g, '$1, $2') // "Cholesterol, Total"
    .replace(/\b([A-Z][a-z]+)-([A-Z][a-z]+)\b/g, '$1-$2') // "HDL-Cholesterol"
    
    .trim();

  // Additional cleaning for medical terms
  cleanedText = cleanMedicalTerms(cleanedText);
  
  // Final cleanup
  cleanedText = cleanedText
    .replace(/\s+/g, ' ')
    .replace(/\n\s+/g, '\n')
    .trim();
  
  return cleanedText;
}

function cleanMedicalTerms(text) {
  // Dictionary of common OCR errors in medical terms
  const medicalCorrections = {
    'hernoglobin': 'hemoglobin',
    'haemoglobin': 'hemoglobin',
    'giucose': 'glucose',
    'creatinine': 'creatinine',
    'choiesterol': 'cholesterol',
    'triglycendes': 'triglycerides',
    'piatelets': 'platelets',
    'leukocytes': 'leukocytes',
    'erythrocytes': 'erythrocytes',
    'mg/dl': 'mg/dL',
    'mg/di': 'mg/dL',
    'mg/cll': 'mg/dL',
    'mmol/l': 'mmol/L',
    'mmol/i': 'mmol/L',
    'ul': 'µL',
    'ug': 'µg',
    'umol': 'µmol'
  };

  let correctedText = text;
  
  // Apply corrections (case insensitive)
  Object.entries(medicalCorrections).forEach(([wrong, correct]) => {
    const regex = new RegExp(`\\b${wrong}\\b`, 'gi');
    correctedText = correctedText.replace(regex, correct);
  });

  return correctedText;
}

// Calculate text quality score for better OCR results
function calculateTextQuality(text) {
  if (!text || text.length === 0) return 0;

  let score = 0;
  const words = text.split(/\s+/);
  
  // Check word completeness (not fragments)
  const completeWords = words.filter(word => 
    word.length > 2 && /^[a-zA-Z]+[a-zA-Z0-9]*$/.test(word)
  );
  score += Math.min(40, (completeWords.length / words.length) * 40);
  
  // Check for proper sentences
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 5);
  if (sentences.length > 0) {
    score += Math.min(25, sentences.length * 5);
  }
  
  // Check for numbers (good for reports)
  if (/\d/.test(text)) score += 15;
  
  // Check for medical terms
  if (/\b(test|result|normal|abnormal|range|level|count|blood|urine)\b/i.test(text)) {
    score += 20;
  }
  
  return Math.min(100, Math.round(score));
}

// Enhanced OCR with better options
async function doOCREnhanced(buffer) {
  try {
    const { data: { text, confidence } } = await tesseract.recognize(buffer, 'eng', {
      tessedit_pageseg_mode: '6', // Treat image as single block
      tessedit_char_whitelist: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.:-<>()/%µ/dL ',
      preserve_interword_spaces: '1',
    });
    
    return { text, confidence };
  } catch (error) {
    console.error('OCR Error:', error);
    return { text: '', confidence: 0 };
  }
}

//Extracted text from texted PDF
async function parsePDF(buffer) {
  const { text } = await pdfParse(buffer);
  return text;
}

async function convertPDFToImages(buffer, tempDir) {
  //Using pdf-poppler to convert PDF to images
  const tempPdfPath = path.join(tempDir, `temp-${uuidv4()}.pdf`);
  await fs.writeFile(tempPdfPath, buffer);

  const options = {
    format: 'jpeg',
    out_dir: tempDir,
    out_prefix: 'page',
    page: null,
  };
  
  await pdf.convert(tempPdfPath, options);

  const files = await fs.readdir(tempDir);
  const imageFiles = files
    .filter(f => f.startsWith('page') && f.endsWith('.jpg'))
    .map(f => path.join(tempDir, f));

  return imageFiles;
}

const analyzeReport = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ 
        success: false,
        error: 'No file uploaded.' 
      });
    }

    const mime = file.mimetype;
    let rawText = '';
    let ocrConfidence = 0;          // to check the correctness level of OCR
    let processingMethod = '';

    console.log(`Processing file: ${file.originalname}, Type: ${mime}`);

    if (mime === 'application/pdf') {
      // apply direct PDF text extraction first
      processingMethod = 'PDF Text Extraction';
      const text = await parsePDF(file.buffer);

      if (text.trim() && text.length > 50) {
        rawText = text;
        ocrConfidence = 95; // High confidence for direct PDF text
        console.log('Used direct PDF text extraction');
      } else {
        processingMethod = 'PDF to Image + OCR';
        console.log('PDF has no text, converting to images for OCR...');
        
        const tempDir = path.join(__dirname, '../tmp', uuidv4());
        await fs.ensureDir(tempDir);

        try {
          const imageFiles = await convertPDFToImages(file.buffer, tempDir);
          console.log(`Converted PDF to ${imageFiles.length} image(s)`);

          const pageTexts = [];
          const confidences = [];
          
          for (let i = 0; i < imageFiles.length; i++) {
            const imagePath = imageFiles[i];
            console.log(`Processing page ${i + 1}...`);
            
            const buffer = await fs.readFile(imagePath);
            const { text: pageText, confidence } = await doOCREnhanced(buffer);
            
            if (pageText.trim()) {
              pageTexts.push(`--- Page ${i + 1} ---\n${pageText}`);
              confidences.push(confidence);
            }
          }

          rawText = pageTexts.join('\n\n').trim();
          ocrConfidence = confidences.length > 0 
            ? confidences.reduce((a, b) => a + b, 0) / confidences.length 
            : 0;
            
        } finally {
          await fs.remove(tempDir);
        }
      }

    } else if (mime.startsWith('image/')) {
      processingMethod = 'Image OCR';
      console.log('Processing image with OCR...');
      
      const { text, confidence } = await doOCREnhanced(file.buffer);
      rawText = text;
      ocrConfidence = confidence;
    } else {
      return res.status(400).json({ 
        success: false,
        error: 'Unsupported file type. Please upload PDF or image files.' 
      });
    }

    // Clean the extracted text
    const cleanedText = cleanOCRText(rawText);
    const textQuality = calculateTextQuality(cleanedText);

    console.log(`Text extracted: ${rawText.length} chars, Cleaned: ${cleanedText.length} chars`);
    console.log(`OCR Confidence: ${ocrConfidence}%, Text Quality: ${textQuality}%`);

    // Return clean response for Postman testing
    const response = {
      success: true,
      extractedText: cleanedText || '[No text after cleaning]',
      rawText: rawText || '[No text extracted]',
      ocrConfidence: Math.round(ocrConfidence),
      textQuality: textQuality,
      processingMethod: processingMethod,
      stats: {
        rawTextLength: rawText.length,
        cleanedTextLength: cleanedText.length,
        wordCount: cleanedText.split(/\s+/).filter(w => w.length > 0).length,
        hasNumbers: /\d/.test(cleanedText),
        hasMedicalTerms: /\b(test|result|normal|abnormal|range|blood|urine|glucose|cholesterol)\b/i.test(cleanedText)
      }
    };

    // CORRECTED LLM ANALYSIS SECTION
    if (cleanedText.length > 0) {
      try {
        console.log('🤖 Starting LLM analysis...');
        
        const medicalPrompt = `Analyze this medical test report and provide:
        1. Summary of key findings
        2. Highlight any abnormal values
        3. Risk assessment based on the values
        4. General recommendations (mention this is not medical advice)
        
        Report: ${cleanedText}`;

        // Use analyzeText method with custom prompt
        const analysis = await geminiService.analyzeText(cleanedText, medicalPrompt);
        
        if (analysis.success) {
          response.llmAnalysis = {
            summary: analysis.analysis || 'No analysis text returned',
            modelUsed: geminiService.model,
            tokensUsed: analysis.usage?.totalTokenCount || 0,
            promptTokens: analysis.usage?.promptTokenCount || 0,
            completionTokens: analysis.usage?.completionTokenCount || 0,
            success: true,
            quotaRemaining: analysis.quotaRemaining || null
          };
          
          console.log(`LLM Analysis completed. Tokens used: ${analysis.usage?.totalTokenCount || 0}`);
          
          // Print remaining quota for monitoring
          if (analysis.quotaRemaining) {
            console.log(`Remaining quota - Session: ${analysis.quotaRemaining.session.tokens} tokens, Daily: ${analysis.quotaRemaining.daily.tokens} tokens`);
          }
          
        } else {
          console.log('LLM Analysis failed:', analysis.error);
          response.llmAnalysis = {
            summary: 'Analysis failed - ' + (analysis.error || 'Unknown error'),
            modelUsed: geminiService.model,
            tokensUsed: 0,
            success: false,
            error: analysis.error,
            quotaRemaining: analysis.quotaRemaining || null
          };
        }
        
      } catch (llmError) {
        console.error('LLM analysis exception:', llmError.message);
        response.llmAnalysis = {
          summary: 'Analysis failed due to error',
          modelUsed: geminiService.model,
          tokensUsed: 0,
          success: false,
          error: llmError.message,
          errorType: llmError.name || 'Unknown'
        };
      }
    } else {
      response.llmAnalysis = {
        summary: 'No text available for analysis',
        modelUsed: geminiService.model,
        tokensUsed: 0,
        success: false,
        error: 'No cleaned text to analyze'
      };
    }

    // Return the complete response
    res.json(response);

  } catch (err) {
    console.error('Error analyzing report:', err);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error while analyzing report.',
      details: err.message 
    });
  }
};

// Alternative: Use the dedicated medical analysis method
const analyzeReportWithMedicalMethod = async (req, res) => {
  // ... [same OCR processing code as above] ...

  // ALTERNATIVE LLM ANALYSIS using analyzeMedicalReport method
  if (cleanedText.length > 0) {
    try {
      console.log('🤖 Starting medical report analysis...');
      
      const analysisOptions = {
        analysisType: 'summary', // Use summary for token efficiency
        includeRecommendations: true,
        focusAreas: ['abnormal values', 'risk factors'],
        patientContext: 'Lipid profile test report analysis'
      };

      const analysis = await geminiService.analyzeMedicalReport(cleanedText, analysisOptions);
      
      if (analysis.success) {
        response.llmAnalysis = {
          summary: analysis.analysis || 'No analysis returned',
          modelUsed: analysis.model || geminiService.model,
          tokensUsed: analysis.usage?.totalTokens || analysis.usage?.totalTokenCount || 0,
          promptTokens: analysis.usage?.promptTokens || 0,
          completionTokens: analysis.usage?.completionTokens || 0,
          success: true,
          quotaRemaining: analysis.quotaRemaining,
          processingTime: analysis.processingTime
        };
        
        console.log(`Medical analysis completed. Tokens: ${response.llmAnalysis.tokensUsed}`);
        
      } else {
        response.llmAnalysis = {
          summary: 'Medical analysis failed',
          modelUsed: geminiService.model,
          tokensUsed: 0,
          success: false,
          error: analysis.error,
          quotaRemaining: analysis.quotaRemaining
        };
      }
      
    } catch (llmError) {
      console.error('❌ Medical analysis error:', llmError.message);
      response.llmAnalysis = {
        summary: 'Analysis failed due to error',
        modelUsed: geminiService.model,
        tokensUsed: 0,
        success: false,
        error: llmError.message
      };
    }
  }

  res.json(response);
};

module.exports = { 
  analyzeReport,
  cleanOCRText,
  calculateTextQuality,
  getDietPlan
};