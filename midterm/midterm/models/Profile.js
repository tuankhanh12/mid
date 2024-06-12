const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  dob: { type: Date, required: true },
  placeOfBirth: { type: String, required: true },
  nationality: { type: String, required: true },
  education: [
    {
      institution: { type: String },
      degree: { type: String },
      startDate: { type: Date },
      endDate: { type: Date }
    }
  ],
  skills: [String],
  projects: [
    {
      name: { type: String },
      description: { type: String },
      role: { type: String },
      startDate: { type: Date },
      endDate: { type: Date }
    }
  ],
  workExperience: [
    {
      companyName: { type: String },
      role: { type: String },
      startDate: { type: Date },
      endDate: { type: Date }
    }
  ],
  hobbies: [String],
  personalGoals: [String]
});

module.exports = mongoose.model('Profile', ProfileSchema);
