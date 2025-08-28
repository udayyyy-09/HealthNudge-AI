const User = require("../models/User");
const { askGemini } = require("../utils/gemini");
const upload = require("../middlewares/upload");
const pdfParse = require("pdf-parse");
const tesseract = require("tesseract.js");
const { fromPath } = require("pdf2pic");
const fs = require("fs-extra");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { geminiService } = require("../service/GeminiService"); // Import your OpenAI service

const getDietPlan = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ message: "User not found" });
    }

    const prompt = `
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
    if (!response) {
      console.log("No response from Gemini");
      return res.status(500).json({ message: "Failed to generate diet plan" });
    }
    res
      .status(200)
      .json({
        message: "Diet Plan generated successfully",
        DietPlan: response,
      });
  } catch (err) {
    console.error("Error generating diet plan:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

//function for anyalizing the report
function cleanOCRText(rawText, debug = false) {
  if (!rawText || typeof rawText !== "string") {
    return debug ? { cleaned: "", steps: ["No input text"] } : "";
  }

  const debugSteps = debug ? [] : null;
  let cleanedText = rawText;
  
  if (debug) {
    debugSteps.push(`Original length: ${rawText.length}`);
    debugSteps.push(`First 200 chars: "${rawText.substring(0, 200)}"`);
  }

  // Step 1: Basic whitespace normalization (less aggressive)
  cleanedText = cleanedText
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/\n{4,}/g, "\n\n\n") // Allow up to 3 line breaks
    .replace(/[ \t]{3,}/g, "  "); // Allow up to 2 spaces
  
  if (debug) debugSteps.push(`After whitespace normalization: ${cleanedText.length} chars`);

  // Step 2: Fix common OCR character errors (more targeted)
  cleanedText = cleanedText
    // Only fix obvious character swaps in numeric contexts
    .replace(/(\d+)[|]/g, "$11") // "5|" -> "51" only after numbers
    .replace(/[|](\d+)/g, "1$1") // "|5" -> "15" only before numbers
    .replace(/[¡]/g, "I")
    .replace(/[×]/g, "x")
    
    // Fix number/letter confusion only in clear contexts
    .replace(/(\d+)\s*[lI]\s*(\d)/g, "$11$2") // "5 l 2" -> "512" 
    .replace(/(\d+)\s*[oO]\s*(\d)/g, "$10$2") // "5 O 2" -> "502"
    .replace(/[oO](\d{2,})/g, "0$1") // "O25" -> "025" (only 2+ digits)
    .replace(/(\d{2,})[oO](?!\w)/g, "$10") // "25O" -> "250" (only 2+ digits)
    
    // Clean medical values and units (more precise)
    .replace(/(\d+)\s*\.\s*(\d+)/g, "$1.$2") // "5 . 2" -> "5.2"
    .replace(/(\d+)\s+(mg\/dL|g\/dL|mmol\/L|µL|µg)/gi, "$1 $2") // Fix spacing with units
    .replace(/mg\/dl/gi, "mg/dL") // Standardize units
    .replace(/g\/dl/gi, "g/dL")
    .replace(/mmol\/l/gi, "mmol/L")
    
    // Fix comparison operators
    .replace(/\s*([<>=])\s*/g, " $1 ")
    .replace(/>\s*=/g, ">=") // Fix ">=" 
    .replace(/<\s*=/g, "<="); // Fix "<="

  if (debug) debugSteps.push(`After character fixes: ${cleanedText.length} chars`);

  // Step 3: Remove only obvious noise patterns (be more conservative)
  cleanedText = cleanedText
    // Remove lines that are mostly separators
    .replace(/^[\-_=|]{5,}$/gm, "") // Lines with 5+ separator chars
    .replace(/^[A-Z\s&]{10,}\d+\s*$/gm, "") // Very long uppercase + number lines
    
    // Remove obvious OCR artifacts (be more specific)
    .replace(/\b[a-zA-Z]{1}\s+[a-zA-Z]{1}\s+[a-zA-Z]{1}\s+ee{2,}\b/gi, "") // "a b c eeee"
    .replace(/\bEe{3,}\b/gi, "") // "EeEeEe" patterns only
    .replace(/\b[a-z]{1,2}\s+abe\s+oe\b/gi, "") // Specific "X abe oe" patterns
    
    // Clean up excessive whitespace (final pass)
    .replace(/\n\s*\n\s*\n/g, "\n\n") // Max 2 line breaks
    .replace(/\s{3,}/g, "  "); // Max 2 spaces

  if (debug) debugSteps.push(`After noise removal: ${cleanedText.length} chars`);

  // Step 4: Apply medical term corrections
  cleanedText = cleanMedicalTerms(cleanedText);
  
  if (debug) debugSteps.push(`After medical corrections: ${cleanedText.length} chars`);

  // Step 5: Final cleanup (minimal)
  cleanedText = cleanedText
    .replace(/\s+/g, " ") // Single space normalization
    .replace(/\n /g, "\n") // Remove spaces after line breaks
    .trim();

  if (debug) {
    debugSteps.push(`Final length: ${cleanedText.length} chars`);
    debugSteps.push(`Final first 200 chars: "${cleanedText.substring(0, 200)}"`);
    return { cleaned: cleanedText, steps: debugSteps };
  }

  return cleanedText;
}


function cleanMedicalTerms(text) {
  // Expanded dictionary of common OCR errors in medical terms
  const medicalCorrections = {
    // Common medical test names
    hernoglobin: "hemoglobin",
    haemoglobin: "hemoglobin",
    hemaglobin: "hemoglobin",
    giucose: "glucose",
    gIucose: "glucose",
    creatinine: "creatinine",
    creatinlne: "creatinine",
    choiesterol: "cholesterol",
    cholesteroi: "cholesterol",
    triglycendes: "triglycerides",
    triglycerides: "triglycerides",
    piatelets: "platelets",
    plateiets: "platelets",
    leukocytes: "leukocytes",
    Ieukocytes: "leukocytes",
    erythrocytes: "erythrocytes",
    erythrocytes: "erythrocytes",
    
    // Units
    "mg/dl": "mg/dL",
    "mg/di": "mg/dL",
    "mg/cll": "mg/dL",
    "mg/dI": "mg/dL",
    "mmol/l": "mmol/L",
    "mmol/i": "mmol/L",
    "mmoi/L": "mmol/L",
    ul: "µL",
    "uL": "µL",
    ug: "µg",
    "ug/dl": "µg/dL",
    umol: "µmol",
    "umol/l": "µmol/L",
    
    // Common medical terms
    normai: "normal",
    abnormai: "abnormal",
    "test result": "test result",
    "blood test": "blood test",
    "lab result": "lab result",
    resuit: "result",
    resuits: "results",
    
    // Range indicators
    "reference range": "reference range",
    "normal range": "normal range",
    "ref range": "reference range"
  };

  let correctedText = text;

  // Apply corrections (case insensitive but preserve original case)
  Object.entries(medicalCorrections).forEach(([wrong, correct]) => {
    const regex = new RegExp(`\\b${wrong.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, "gi");
    correctedText = correctedText.replace(regex, (match) => {
      // Preserve case pattern of original
      if (match === match.toUpperCase()) return correct.toUpperCase();
      if (match[0] === match[0].toUpperCase()) return correct.charAt(0).toUpperCase() + correct.slice(1);
      return correct;
    });
  });

  return correctedText;
}

// Calculate text quality score for better OCR results
function calculateTextQuality(text, debug = false) {
  if (!text || text.length === 0) return debug ? { score: 0, breakdown: {} } : 0;

  const breakdown = {};
  let score = 0;
  const words = text.split(/\s+/).filter(w => w.length > 0);
  
  // 1. Word completeness (40 points max)
  const completeWords = words.filter(word => 
    word.length > 1 && 
    /^[a-zA-Z][a-zA-Z0-9]*[a-zA-Z0-9]?$/.test(word) // Starts with letter, ends with letter/number
  );
  const wordScore = Math.min(40, (completeWords.length / Math.max(words.length, 1)) * 40);
  breakdown.wordCompleteness = { score: wordScore, completeWords: completeWords.length, totalWords: words.length };
  score += wordScore;

  // 2. Sentence structure (15 points max)
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
  const sentenceScore = Math.min(15, sentences.length * 3);
  breakdown.sentences = { score: sentenceScore, count: sentences.length };
  score += sentenceScore;

  // 3. Numeric content (15 points)
  const hasNumbers = /\d/.test(text);
  const numberScore = hasNumbers ? 15 : 0;
  breakdown.numbers = { score: numberScore, hasNumbers };
  score += numberScore;

  // 4. Medical terminology (20 points)
  const medicalTerms = text.match(/\b(test|result|normal|abnormal|range|level|count|blood|urine|glucose|cholesterol|hemoglobin|creatinine|mg\/dL|mmol\/L)\b/gi) || [];
  const medicalScore = Math.min(20, medicalTerms.length * 3);
  breakdown.medical = { score: medicalScore, termsFound: medicalTerms.length };
  score += medicalScore;

  // 5. Length adequacy (10 points)
  const lengthScore = text.length > 100 ? 10 : (text.length > 50 ? 5 : 0);
  breakdown.length = { score: lengthScore, textLength: text.length };
  score += lengthScore;

  const finalScore = Math.min(100, Math.round(score));
  
  return debug ? { score: finalScore, breakdown } : finalScore;
}


// Enhanced OCR with better options
async function doOCREnhanced(buffer, isFromPDF = false) {
  try {
    // Different configurations for PDF-derived images vs direct images
    const ocrConfig = isFromPDF
      ? {
          tessedit_pageseg_mode: "1", // Automatic page segmentation with OSD
          tessedit_char_whitelist:
            "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.:-<>()/%µ/dL mg°C+= ",
          preserve_interword_spaces: "1",
          tessedit_ocr_engine_mode: "1", // LSTM OCR Engine only
        }
      : {
          tessedit_pageseg_mode: "6", // Treat image as single block
          tessedit_char_whitelist:
            "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.:-<>()/%µ/dL mg°C+= ",
          preserve_interword_spaces: "1",
        };

    const {
      data: { text, confidence },
    } = await tesseract.recognize(buffer, "eng", ocrConfig);

    return { text, confidence };
  } catch (error) {
    console.error("OCR Error:", error);
    return { text: "", confidence: 0 };
  }
}

//Extracted text from texted PDF
async function parsePDF(buffer) {
  const { text } = await pdfParse(buffer);
  return text;
}

async function convertPDFToImages(pdfFilePath, outputDir, options = {}) {
  try {
    const defaultOptions = {
      density: 300, // DPI - 300 is good for OCR
      saveFilename: "page",
      savePath: outputDir,
      format: "png", // PNG for better quality
      width: 2048, // Max width for good OCR
      height: 2048, // Max height for good OCR
      ...options,
    };

    const convert = fromPath(pdfFilePath, defaultOptions);
    
    // Get PDF info to determine number of pages
    const pdfInfo = await convert.bulk(-1, { responseType: "array" });
    const imageFiles = [];
    
    // Convert each page
    for (let i = 1; i <= pdfInfo.length; i++) {
      const result = await convert(i, { responseType: "array" });
      if (result && result.data) {
        const imagePath = path.join(outputDir, `page_${i}.png`);
        await fs.writeFile(imagePath, Buffer.from(result.data));
        imageFiles.push(imagePath);
      }
    }
    
    return imageFiles;
  } catch (error) {
    console.error("PDF conversion error:", error);
    throw error;
  }
}

const analyzeReport = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({
        success: false,
        error: "No file uploaded.",
      });
    }

    const mime = file.mimetype;
    let rawText = "";
    let ocrConfidence = 0;
    let processingMethod = "";

    console.log(`Processing file: ${file.originalname}, Type: ${mime}`);

    if (mime === "application/pdf") {
      // Try direct PDF text extraction first
      processingMethod = "PDF Text Extraction";
      const text = await parsePDF(file.buffer);

      // More strict criteria for using direct extraction
      if (
        text.trim() &&
        text.length > 100 &&
        !/[^\x00-\x7F]/.test(text.slice(0, 200))
      ) {
        rawText = text;
        ocrConfidence = 95;
        console.log("Used direct PDF text extraction");
      } else {
        processingMethod = "PDF to Image + OCR";
        console.log(
          "PDF has no extractable text or contains encoding issues, converting to images for OCR..."
        );
        const tempDir = path.join(__dirname, "../tmp", uuidv4());
        await fs.ensureDir(tempDir);

        const tempPDFPath = path.join(tempDir, "upload.pdf");
        await fs.writeFile(tempPDFPath, file.buffer); // Save buffer to file

        try {
          // Enhanced conversion with higher quality settings
          const imageFiles = await convertPDFToImages(tempPDFPath, tempDir, {
            scale: 2.5, // Even higher scale for better OCR
            density: 300, // High DPI
            quality: 100, // Maximum quality
            format: "png", // PNG for lossless compression
          });

          console.log(
            `Converted PDF to ${imageFiles.length} image(s) with enhanced quality`
          );

          const pageTexts = [];
          const confidences = [];

          // Process images with enhanced OCR
          for (let i = 0; i < imageFiles.length; i++) {
            const imagePath = imageFiles[i];
            console.log(`Processing page ${i + 1} with enhanced OCR...`);

            const buffer = await fs.readFile(imagePath);

            // Use enhanced OCR with PDF-specific settings
            const { text: pageText, confidence } = await doOCREnhanced(
              buffer,
              true
            );

            if (pageText.trim()) {
              pageTexts.push(`--- Page ${i + 1} ---\n${pageText}`);
              confidences.push(confidence);
              console.log(
                `Page ${i + 1}: ${
                  pageText.length
                } chars, confidence: ${confidence}%`
              );
            }
          }

          rawText = pageTexts.join("\n\n").trim();
          ocrConfidence =
            confidences.length > 0
              ? confidences.reduce((a, b) => a + b, 0) / confidences.length
              : 0;
        } finally {
          await fs.remove(tempDir);
        }
      }
    } else if (mime.startsWith("image/")) {
      processingMethod = "Image OCR";
      console.log("Processing image with OCR...");

      const { text, confidence } = await doOCREnhanced(file.buffer, false);
      rawText = text;
      ocrConfidence = confidence;
    } else {
      return res.status(400).json({
        success: false,
        error: "Unsupported file type. Please upload PDF or image files.",
      });
    }

    // Enhanced text cleaning
    const cleanedText = cleanOCRText(rawText);
    const textQuality = calculateTextQuality(cleanedText);

    console.log(
      `Text extracted: ${rawText.length} chars, Cleaned: ${cleanedText.length} chars`
    );
    console.log(
      `OCR Confidence: ${ocrConfidence}%, Text Quality: ${textQuality}%`
    );

    // Add quality checks before sending to LLM
    const hasMinimumQuality = cleanedText.length > 50 && textQuality > 40;

    const response = {
      success: true,
      extractedText: cleanedText || "[No text after cleaning]",
      rawText: rawText || "[No text extracted]",
      ocrConfidence: Math.round(ocrConfidence),
      textQuality: textQuality,
      processingMethod: processingMethod,
      qualityCheckPassed: hasMinimumQuality,
      stats: {
        rawTextLength: rawText.length,
        cleanedTextLength: cleanedText.length,
        wordCount: cleanedText.split(/\s+/).filter((w) => w.length > 0).length,
        hasNumbers: /\d/.test(cleanedText),
        hasMedicalTerms:
          /\b(test|result|normal|abnormal|range|blood|urine|glucose|cholesterol|mg|dl|mmol)\b/i.test(
            cleanedText
          ),
      },
    };

    // LLM Analysis with quality gate
    if (hasMinimumQuality) {
      try {
        console.log("🤖 Starting LLM analysis...");

        const medicalPrompt = `Analyze this medical test report. The text was extracted using OCR, so there might be minor formatting issues, but please focus on the medical content:

1. Summary of key findings
2. Highlight any abnormal values (ignore obvious OCR errors in numbers)
3. Risk assessment based on identifiable values
4. General recommendations (mention this is not medical advice)
5. remove any non-medical content or noise and asterisk sign in every points if any

Note: If the text appears too garbled or unclear for medical analysis, please state that clearly.

Report: ${cleanedText}`;

        const analysis = await geminiService.analyzeText(
          cleanedText,
          medicalPrompt
        );

        if (analysis.success) {
          response.llmAnalysis = {
            summary: analysis.analysis || "No analysis text returned",
            modelUsed: geminiService.model,
            tokensUsed: analysis.usage?.totalTokenCount || 0,
            promptTokens: analysis.usage?.promptTokenCount || 0,
            completionTokens: analysis.usage?.completionTokenCount || 0,
            success: true,
            quotaRemaining: analysis.quotaRemaining || null,
          };

          console.log(
            `LLM Analysis completed. Tokens used: ${
              analysis.usage?.totalTokenCount || 0
            }`
          );
        } else {
          console.log("LLM Analysis failed:", analysis.error);
          response.llmAnalysis = {
            summary: "Analysis failed - " + (analysis.error || "Unknown error"),
            modelUsed: geminiService.model,
            tokensUsed: 0,
            success: false,
            error: analysis.error,
            quotaRemaining: analysis.quotaRemaining || null,
          };
        }
      } catch (llmError) {
        console.error("LLM analysis exception:", llmError.message);
        response.llmAnalysis = {
          summary: "Analysis failed due to error",
          modelUsed: geminiService.model,
          tokensUsed: 0,
          success: false,
          error: llmError.message,
          errorType: llmError.name || "Unknown",
        };
      }
    } else {
      response.llmAnalysis = {
        summary:
          "Text quality too poor for reliable analysis. Please try uploading a clearer image or a higher quality PDF.",
        modelUsed: geminiService.model,
        tokensUsed: 0,
        success: false,
        error: "Text quality below minimum threshold",
        qualityScore: textQuality,
        minimumRequired: 40,
      };
    }

    res.json(response);
  } catch (err) {
    console.error("Error analyzing report:", err);
    res.status(500).json({
      success: false,
      error: "Internal server error while analyzing report.",
      details: err.message,
    });
  }
};

// Alternative: Use the dedicated medical analysis method
const analyzeReportWithMedicalMethod = async (req, res) => {
  // ... [same OCR processing code as above] ...

  // ALTERNATIVE LLM ANALYSIS using analyzeMedicalReport method
  if (cleanedText.length > 0) {
    try {
      console.log("🤖 Starting medical report analysis...");

      const analysisOptions = {
        analysisType: "summary", // Use summary for token efficiency
        includeRecommendations: true,
        focusAreas: ["abnormal values", "risk factors"],
        patientContext: "Lipid profile test report analysis",
      };

      const analysis = await geminiService.analyzeMedicalReport(
        cleanedText,
        analysisOptions
      );

      if (analysis.success) {
        response.llmAnalysis = {
          summary: analysis.analysis || "No analysis returned",
          modelUsed: analysis.model || geminiService.model,
          tokensUsed:
            analysis.usage?.totalTokens || analysis.usage?.totalTokenCount || 0,
          promptTokens: analysis.usage?.promptTokens || 0,
          completionTokens: analysis.usage?.completionTokens || 0,
          success: true,
          quotaRemaining: analysis.quotaRemaining,
          processingTime: analysis.processingTime,
        };

        console.log(
          `Medical analysis completed. Tokens: ${response.llmAnalysis.tokensUsed}`
        );
      } else {
        response.llmAnalysis = {
          summary: "Medical analysis failed",
          modelUsed: geminiService.model,
          tokensUsed: 0,
          success: false,
          error: analysis.error,
          quotaRemaining: analysis.quotaRemaining,
        };
      }
    } catch (llmError) {
      console.error("❌ Medical analysis error:", llmError.message);
      response.llmAnalysis = {
        summary: "Analysis failed due to error",
        modelUsed: geminiService.model,
        tokensUsed: 0,
        success: false,
        error: llmError.message,
      };
    }
  }

  res.json(response);
};

module.exports = {
  analyzeReport,
  cleanOCRText,
  calculateTextQuality,
  getDietPlan,
};
