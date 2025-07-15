const mongoose = require('mongoose');

const healthEntrySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sleepHours: {
    type: Number,
    required: true
  },
  waterIntake: {
    type: Number,
    required: true
  },
  meals: {
    type: String,
    required: true
  },
  exercise: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });
module.exports =  mongoose.model('HealthEntry', healthEntrySchema);
