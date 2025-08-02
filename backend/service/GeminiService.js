const axios = require('axios');

class GeminiLLMService {
  constructor() {
    this.apiKey = process.env.GEMINILLM_API_KEY;
    this.baseURL = 'https://generativelanguage.googleapis.com/v1beta/models';
    this.model = 'gemini-1.5-flash'; // Free tier model
    this.maxTokens = 2048; // Reduced for testing
    this.timeout = 30000; 

    // Rate limiting configuration for free tier
    this.rateLimits = {
      // Daily limits (Gemini 1.5 Flash free tier)
      dailyTokenLimit: 1000000, // 1M tokens per day
      dailyRequestLimit: 1500,   // 1500 requests per day
      
      // Per-minute limits
      perMinuteRequestLimit: 15, // 15 RPM
      
      // Session limits for testing
      sessionTokenLimit: 50000,  // Max tokens per session
      sessionRequestLimit: 100,  // Max requests per session
      
      // Per-request limits
      maxTokensPerRequest: 8192  // Gemini 1.5 Flash max
    };

    // Usage tracking
    this.usage = {
      session: {
        tokens: 0,
        requests: 0,
        startTime: Date.now()
      },
      daily: this.loadDailyUsage(),
      lastMinute: {
        requests: 0,
        windowStart: Date.now()
      }
    };

    if (!this.apiKey) {
      console.warn('GEMINI_API_KEY not found in environment variables');
    }

    console.log('🚦 Rate-limited Gemini service initialized');
    this.printUsageLimits();
  }

  // ========================
  //  Rate Limiting Methods
  // ========================

  /**
   * Check if request is within rate limits
   */
  checkRateLimits(estimatedTokens = 1000) {
    const now = Date.now();
    
    // Check session limits
    if (this.usage.session.tokens + estimatedTokens > this.rateLimits.sessionTokenLimit) {
      throw new Error(`❌ Session token limit reached (${this.rateLimits.sessionTokenLimit}). Tokens used: ${this.usage.session.tokens}`);
    }
    
    if (this.usage.session.requests >= this.rateLimits.sessionRequestLimit) {
      throw new Error(`❌ Session request limit reached (${this.rateLimits.sessionRequestLimit})`);
    }

    // Check daily limits
    if (this.usage.daily.tokens + estimatedTokens > this.rateLimits.dailyTokenLimit) {
      throw new Error(`❌ Daily token limit reached (${this.rateLimits.dailyTokenLimit})`);
    }
    
    if (this.usage.daily.requests >= this.rateLimits.dailyRequestLimit) {
      throw new Error(`❌ Daily request limit reached (${this.rateLimits.dailyRequestLimit})`);
    }

    // Check per-minute limits
    if (now - this.usage.lastMinute.windowStart > 60000) {
      // Reset minute window
      this.usage.lastMinute = { requests: 0, windowStart: now };
    }
    
    if (this.usage.lastMinute.requests >= this.rateLimits.perMinuteRequestLimit) {
      const waitTime = 60000 - (now - this.usage.lastMinute.windowStart);
      throw new Error(`❌ Rate limit exceeded. Wait ${Math.ceil(waitTime/1000)} seconds`);
    }

    return true;
  }

  /**
   * Update usage counters after successful request
   */
  updateUsage(tokenUsage) {
    const totalTokens = tokenUsage.totalTokenCount || 0;
    
    // Update session usage
    this.usage.session.tokens += totalTokens;
    this.usage.session.requests += 1;
    
    // Update daily usage
    this.usage.daily.tokens += totalTokens;
    this.usage.daily.requests += 1;
    this.usage.daily.date = new Date().toDateString();
    
    // Update per-minute usage
    this.usage.lastMinute.requests += 1;
    
    // Save daily usage to prevent reset on restart
    this.saveDailyUsage();
    
    console.log(`📊 Usage updated: Session(${this.usage.session.tokens}/${this.rateLimits.sessionTokenLimit} tokens, ${this.usage.session.requests}/${this.rateLimits.sessionRequestLimit} requests)`);
  }

  /**
   * Load daily usage from storage (in production, use database/redis)
   */
  loadDailyUsage() {
    const today = new Date().toDateString();
    try {
      // In a real app, load from persistent storage
      const fs = require('fs');
      const path = './gemini_usage.json';
      
      if (fs.existsSync(path)) {
        const data = JSON.parse(fs.readFileSync(path, 'utf8'));
        if (data.date === today) {
          return data;
        }
      }
    } catch (error) {
      console.warn('Could not load daily usage:', error.message);
    }
    
    return { tokens: 0, requests: 0, date: today };
  }

  /**
   * Save daily usage to storage
   */
  saveDailyUsage() {
    try {
      const fs = require('fs');
      fs.writeFileSync('./gemini_usage.json', JSON.stringify(this.usage.daily));
    } catch (error) {
      console.warn('Could not save daily usage:', error.message);
    }
  }

  /**
   * Print current usage limits
   */
  printUsageLimits() {
    console.log('\n📋 GEMINI FREE TIER LIMITS:');
    console.log(`Daily: ${this.usage.daily.tokens.toLocaleString()}/${this.rateLimits.dailyTokenLimit.toLocaleString()} tokens, ${this.usage.daily.requests}/${this.rateLimits.dailyRequestLimit} requests`);
    console.log(`Session: ${this.usage.session.tokens.toLocaleString()}/${this.rateLimits.sessionTokenLimit.toLocaleString()} tokens, ${this.usage.session.requests}/${this.rateLimits.sessionRequestLimit} requests`);
    console.log(`Per-minute: ${this.usage.lastMinute.requests}/${this.rateLimits.perMinuteRequestLimit} requests\n`);
  }

  /**
   * Get remaining quota
   */
  getRemainingQuota() {
    return {
      daily: {
        tokens: this.rateLimits.dailyTokenLimit - this.usage.daily.tokens,
        requests: this.rateLimits.dailyRequestLimit - this.usage.daily.requests
      },
      session: {
        tokens: this.rateLimits.sessionTokenLimit - this.usage.session.tokens,
        requests: this.rateLimits.sessionRequestLimit - this.usage.session.requests
      },
      perMinute: {
        requests: this.rateLimits.perMinuteRequestLimit - this.usage.lastMinute.requests
      }
    };
  }

  // ========================
  //  Core Methods (Modified)
  // ========================

  /**
   * Analyze medical report text with rate limiting
   */
  async analyzeMedicalReport(extractedText, options = {}) {
    try {
      const {
        analysisType = 'summary', // Changed default to use fewer tokens
        includeRecommendations = false, // Disabled by default to save tokens
        focusAreas = [],
        patientContext = ''
      } = options;

      // Estimate token usage (rough approximation: 1 token ≈ 4 characters)
      const estimatedTokens = Math.ceil(extractedText.length / 3) + 500; // Input + output estimate
      
      // Check rate limits before making request
      this.checkRateLimits(estimatedTokens);

      const prompt = this.buildMedicalAnalysisPrompt(
        extractedText,
        analysisType,
        includeRecommendations,
        focusAreas,
        patientContext
      );

      const response = await this.callGemini(prompt);
      
      // Update usage after successful request
      this.updateUsage(response.usage);
      
      return {
        success: true,
        analysis: response.text,
        usage: response.usage,
        quotaRemaining: this.getRemainingQuota(),
        model: response.model,
        processingTime: Date.now()
      };

    } catch (error) {
      console.error('❌ Medical analysis error:', error.message);
      return {
        success: false,
        error: this.simplifyError(error),
        analysis: null,
        quotaRemaining: this.getRemainingQuota()
      };
    }
  }

  /**
   * Generic text analysis with rate limiting
   */
  async analyzeText(text, customPrompt = '') {
    try {
      const estimatedTokens = Math.ceil(text.length / 3) + 300;
      this.checkRateLimits(estimatedTokens);

      const prompt = customPrompt || `Provide a brief analysis of this text:\n\n${text.substring(0, 2000)}`; // Truncate for testing
      const response = await this.callGemini(prompt);

      this.updateUsage(response.usage);

      return {
        success: true,
        analysis: response.text,
        usage: response.usage,
        quotaRemaining: this.getRemainingQuota()
      };
    } catch (error) {
      return {
        success: false,
        error: this.simplifyError(error),
        analysis: null,
        quotaRemaining: this.getRemainingQuota()
      };
    }
  }

  // ========================
  //  Helper Methods (Modified)
  // ========================

  /**
   * Build medical analysis prompt (optimized for token efficiency)
   */
  buildMedicalAnalysisPrompt(extractedText, analysisType, includeRecommendations, focusAreas, patientContext) {
    let prompt = `Medical report analysis (${analysisType}):\n\n`;
    
    if (patientContext) prompt += `Context: ${patientContext.substring(0, 200)}\n`;
    if (focusAreas.length) prompt += `Focus: ${focusAreas.slice(0, 3).join(', ')}\n`;

    // Limit text length for testing
    const textLimit = analysisType === 'summary' ? 5000 : 15000;
    prompt += `Report:\n"${extractedText.substring(0, textLimit)}"\n\n`;

    const analysisTasks = {
      summary: 'Provide a brief 3-4 sentence summary of key findings.',
      abnormalities: 'List abnormal values with brief explanations.',
      comprehensive: [
        '1. Summary (2-3 sentences)',
        '2. Key abnormal findings',
        '3. Critical values if any'
      ].join('\n')
    };

    prompt += `Task:\n${analysisTasks[analysisType] || analysisTasks.summary}`;

    if (includeRecommendations) {
      prompt += '\n\nBrief recommendations (2-3 points max).';
    }

    return prompt;
  }

  /**
   * Call Gemini API with reduced token limits
   */
  async callGemini(prompt, systemPrompt = '') {
    if (!this.apiKey) throw new Error('Gemini API key not configured');

    const url = `${this.baseURL}/${this.model}:generateContent?key=${this.apiKey}`;
    const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt;

    const requestBody = {
      contents: [{
        parts: [{ text: fullPrompt }]
      }],
      generationConfig: {
        maxOutputTokens: Math.min(this.maxTokens, this.rateLimits.maxTokensPerRequest),
        temperature: 0.3,
        topP: 0.95
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_ONLY_HIGH"
        },
        {
          category: "HARM_CATEGORY_HARASSMENT", 
          threshold: "BLOCK_ONLY_HIGH"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_ONLY_HIGH"
        }
      ]
    };

    try {
      console.log(`🚀 Calling Gemini API (estimated tokens: ${Math.ceil(fullPrompt.length/4)})`);
      
      const response = await axios.post(url, requestBody, {
        timeout: this.timeout,
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.data?.candidates?.[0]?.content?.parts) {
        throw new Error('Invalid response structure from Gemini');
      }

      const result = {
        text: response.data.candidates[0].content.parts[0].text,
        usage: response.data.usageMetadata || { totalTokenCount: 0 },
        model: this.model
      };

      console.log(`✅ API call successful (${result.usage.totalTokenCount || 'unknown'} tokens)`);
      return result;

    } catch (error) {
      if (error.response) {
        const errorDetails = error.response.data?.error || {};
        throw new Error(`Gemini API error: ${errorDetails.message || 'Unknown API error'}`);
      }
      throw new Error(`Network error: ${error.message}`);
    }
  }

  /**
   * Reset session usage (useful for testing)
   */
  resetSessionUsage() {
    this.usage.session = {
      tokens: 0,
      requests: 0,
      startTime: Date.now()
    };
    console.log('🔄 Session usage reset');
  }

  /**
   * Get detailed status including usage
   */
  getStatus() {
    return {
      configured: !!this.apiKey,
      model: this.model,
      maxTokens: this.maxTokens,
      apiProvider: 'Google Gemini',
      rateLimits: this.rateLimits,
      currentUsage: this.usage,
      quotaRemaining: this.getRemainingQuota()
    };
  }

  /**
   * Configure limits for different testing scenarios
   */
  setTestingLimits(limits = {}) {
    this.rateLimits = {
      ...this.rateLimits,
      ...limits
    };
    console.log('🔧 Testing limits updated:', limits);
  }

  // Keep existing methods unchanged
  simplifyError(error) {
    if (error.response) {
      return error.response.data?.error?.message || 'API request failed';
    }
    return error.message || 'Unknown error occurred';
  }

  setModel(modelName) {
    const validModels = [
      'gemini-1.5-flash',    // Free tier - recommended for testing
      'gemini-1.5-pro-latest',
      'gemini-pro',
      'gemini-1.0-pro'
    ];
    
    if (validModels.includes(modelName)) {
      this.model = modelName;
      // Adjust token limits based on model
      if (modelName === 'gemini-1.5-flash') {
        this.maxTokens = 2048; // Conservative for testing
      } else {
        this.maxTokens = modelName.includes('1.5') ? 8192 : 2048;
      }
      console.log(`🔄 Model changed to ${modelName} (max tokens: ${this.maxTokens})`);
      return true;
    }
    return false;
  }
}

// Usage example and testing helpers
class GeminiTester {
  constructor(service) {
    this.service = service;
  }

  async runBasicTest() {
    console.log('\n🧪 Running basic Gemini test...');
    
    try {
      const result = await this.service.analyzeText(
        'This is a test of the Gemini API with rate limiting.',
        'Analyze this test message briefly.'
      );
      
      if (result.success) {
        console.log('✅ Test passed!');
        console.log('Response:', result.analysis.substring(0, 100) + '...');
        console.log('Tokens used:', result.usage.totalTokenCount);
      } else {
        console.log('❌ Test failed:', result.error);
      }
      
      this.service.printUsageLimits();
      return result;
      
    } catch (error) {
      console.log('❌ Test error:', error.message);
      return { success: false, error: error.message };
    }
  }

  // Set very conservative limits for testing
  setTestingMode() {
    this.service.setTestingLimits({
      sessionTokenLimit: 10000,  // Very low for testing
      sessionRequestLimit: 20,   // Limited requests
      maxTokensPerRequest: 1000  // Small responses
    });
  }
}

// Singleton instance
const geminiService = new GeminiLLMService();
const tester = new GeminiTester(geminiService);

module.exports = {
  GeminiLLMService,
  GeminiTester,
  geminiService,
  tester
};