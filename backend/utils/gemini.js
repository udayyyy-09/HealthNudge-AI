const axios = require("axios");

const askGemini = async (promptText) => {
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              { text: promptText }
            ]
          }
        ]
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    const reply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    return reply || "No suggestion received from Gemini.";
  } catch (err) {
    console.error("Gemini API Error:", err.response?.data || err.message);
    return "Something went wrong while generating the suggestion.";
  }
};

module.exports = { askGemini };
