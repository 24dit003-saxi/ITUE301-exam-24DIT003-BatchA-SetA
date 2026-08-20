const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Patient name is required']
  },
  email: {
    type: String,
    required: [true, 'Patient email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
  },
  phone: {
    type: String,
    required: false
  },
  bloodGroup: {
    type: String,
    enum: {
      values: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      message: 'Blood group must be one of: A+, A-, B+, B-, AB+, AB-, O+, O-'
    }
  },
  age: {
    type: Number,
    min: [0, 'Age cannot be negative']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Patient', patientSchema);
