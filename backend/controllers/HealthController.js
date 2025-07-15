const HealthEntry = require('../models/HealthEntry');
const User = require('../models/User');
// POST /api/health/add
const addHealthEntry = async (req, res) => {
  try {
    const { sleepHours, waterIntake, meals, exercise } = req.body;

    if (!sleepHours || !waterIntake || !meals || !exercise) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const userId = req.user.userId;
    if(!userId){ 
        console.log("User ID not found in request");
        return res.status(400).json({ message: "User ID not found" });
    }

    const newEntry = new HealthEntry({
      user: userId, // set by authMiddleware
      sleepHours,
      waterIntake,
      meals,
      exercise
    });

    await newEntry.save();

    res.status(201).json({ message: "Health entry saved successfully" ,newEntry });

  } catch (error) {
    console.error("Error saving health entry:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/health/my-entries
const getUserHealthEntries = async (req, res) => {
  try {
    const userId = req.user.userId;
    if(!userId){
        console.log("User ID not found in request");
        return res.status(400).json({ message: "User ID not found" });
    }

    const entries = await HealthEntry.find({ user: userId}).sort({ date: -1 });
    res.status(200).json({message: "Health entries fetched successfully", entries });
  } catch (error) {
    console.error("Error fetching health entries:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/health/summary
const getHealthSummary = async (req, res) => {
  try {
    const userId = req.user.userId;

    if (!userId) {
      return res.status(400).json({ message: "User ID not found" });
    }

    const user = await User.findById(userId).select("name age goal email dietType createdAt");

    const entries = await HealthEntry.find({ user: userId });

    if(!entries){
      console.log("No health entry found");
      return res.status(404).json({ message: "No health entries found" });
    }
    let summary = {
      averageSleepHours: 0,
      averageWaterIntake: 0,
      mostFrequentMeal: "-",
      mostCommonExercise: "-",
      totalLogs: 0,
    };

    if (entries.length > 0) {
      const total = entries.length;
      let sleepTotal = 0;
      let waterTotal = 0;
      let mealFreq = {};
      let exerciseFreq = {};

      entries.forEach(entry => {
        sleepTotal += entry.sleepHours;
        waterTotal += entry.waterIntake;
        mealFreq[entry.meals] = (mealFreq[entry.meals] || 0) + 1;
        exerciseFreq[entry.exercise] = (exerciseFreq[entry.exercise] || 0) + 1;
      });

      const mostFrequent = (obj) => {
        return Object.entries(obj).reduce((a, b) => (b[1] > a[1] ? b : a))[0];
      };

      summary = {
        averageSleepHours: (sleepTotal / total).toFixed(1),
        averageWaterIntake: (waterTotal / total).toFixed(1),
        mostFrequentMeal: mostFrequent(mealFreq),
        mostCommonExercise: mostFrequent(exerciseFreq),
        totalLogs: total
      };
    }

    res.status(200).json({
      user,
      summary,
      logs: entries || [],
      tip: entries.length > 0 ? "" : "Start logging your health to receive personalized AI tips!"
    });
  } catch (error) {
    console.error("Error in getHealthSummary:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = {
  addHealthEntry,
  getUserHealthEntries,
  getHealthSummary
};