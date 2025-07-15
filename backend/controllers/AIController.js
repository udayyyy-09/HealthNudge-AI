const User = require("../models/User");
const {askGemini} = require("../utils/gemini");
const upload = require("../middlewares/upload");
const pdf = require("pdf-parse"); // used for parsing PDF files

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
const analyzeReport = async (req, res) => {
    try{
        const file = req.file;
        if(!file){
            console.log("No file uploaded");
            return res.status(400).json({message: "No file uploaded"});
        }

        const pdfBuffer = req.file.buffer;          // Get the PDF file buffer from the request
        const pdfData = await pdf(pdfBuffer);       // Parse the PDF file
        const pdfText = pdfData.text;               // Extract text from the PDF

        const prompt = `
            You're a medical assistant AI. Analyze the following medical report and explain it in simple terms for a non-medical person.
            Your response should include:
            - ✅ A summary of the report with major findings or concerns
            - ❗ The likely causes of the condition(s)
            - 🛡️ How the user can prevent or manage the condition(s)
            - 🔍 Avoid all medical jargon. Use everyday language.

            Report:
            """
            ${reportText}
            """
            `;

            const response = await askGemini(prompt);
            res.status(200).json({message: "Report analyzed successfully", ReportAnalysis: response});

    }catch(err){
        console.error("Error analyzing report:", err);
        res.status(500).json({message: "Internal server error"});
    }

}

module.exports = {getDietPlan, analyzeReport};