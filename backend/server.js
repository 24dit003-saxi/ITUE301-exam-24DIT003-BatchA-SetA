const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Load environment variables from root directory
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const Patient = require('./models/Patient');
const Doctor = require('./models/Doctor');
const Appointment = require('./models/Appointment');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON body parsing
app.use(cors());
app.use(express.json());

// Task 3: Custom requestLogger middleware
const requestLogger = (req, res, next) => {
  const method = req.method;
  const path = req.path;
  const timestamp = new Date().toISOString();
  console.log(`[${method}] ${path} [${timestamp}]`);
  next();
};

// Apply request logger globally
app.use(requestLogger);

// Database Connection
const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hospital_db';
mongoose.connect(mongoURI)
  .then(() => {
    console.log(`Connected to MongoDB at ${mongoURI}`);
    seedDatabase(); // Seed initial doctors/patients for easy testing
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message);
  });

// Seeding Initial Data
async function seedDatabase() {
  try {
    // Clear existing collections for a clean practical exam reset with Indian names
    await Doctor.deleteMany({});
    await Patient.deleteMany({});
    await Appointment.deleteMany({});
    console.log('Cleared database for fresh seed with Indian names.');

    const defaultDoctors = [
      { name: 'Dr. Aarav Mehta', email: 'aarav.mehta@medcare.com', specialisation: 'Cardiology', available: true },
      { name: 'Dr. Ananya Sharma', email: 'ananya.sharma@medcare.com', specialisation: 'Neurology', available: true },
      { name: 'Dr. Rohan Joshi', email: 'rohan.joshi@medcare.com', specialisation: 'Pediatrics', available: false },
      { name: 'Dr. Sneha Patel', email: 'sneha.patel@medcare.com', specialisation: 'Orthopedics', available: true },
      { name: 'Dr. Vikram Malhotra', email: 'vikram.malhotra@medcare.com', specialisation: 'Dermatology', available: true },
      { name: 'Dr. Priya Nair', email: 'priya.nair@medcare.com', specialisation: 'Gynecology', available: true },
      { name: 'Dr. Amit Verma', email: 'amit.verma@medcare.com', specialisation: 'General Medicine', available: true }
    ];
    await Doctor.insertMany(defaultDoctors);
    console.log('Seeded initial Indian doctors into MongoDB.');

    const defaultPatients = [
      { name: 'Amit Sharma', email: 'amit.sharma@email.com', phone: '9876543210', bloodGroup: 'O+', age: 34 },
      { name: 'Sunita Gupta', email: 'sunita.gupta@email.com', phone: '8765432109', bloodGroup: 'A-', age: 28 }
    ];
    await Patient.insertMany(defaultPatients);
    console.log('Seeded initial Indian patients into MongoDB.');
  } catch (error) {
    console.error('Error seeding database:', error.message);
  }
}

// REST API Endpoints

// Helper endpoint: Get all patients
app.get('/api/v1/patients', async (req, res, next) => {
  try {
    const patients = await Patient.find();
    res.status(200).json({ success: true, count: patients.length, data: patients });
  } catch (error) {
    next(error);
  }
});

// Helper endpoint: Create a patient
app.post('/api/v1/patients', async (req, res, next) => {
  try {
    const patient = await Patient.create(req.body);
    res.status(201).json({ success: true, data: patient });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/doctors - Return all doctors
app.get('/api/v1/doctors', async (req, res, next) => {
  try {
    const doctors = await Doctor.find();
    res.status(200).json({ success: true, count: doctors.length, data: doctors });
  } catch (error) {
    next(error);
  }
});

// Helper endpoint: Create a doctor
app.post('/api/v1/doctors', async (req, res, next) => {
  try {
    const doctor = await Doctor.create(req.body);
    res.status(201).json({ success: true, data: doctor });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/appointments - Return all appointments
app.get('/api/v1/appointments', async (req, res, next) => {
  try {
    const appointments = await Appointment.find()
      .populate('patientId')
      .populate('doctorId');
    res.status(200).json({ success: true, count: appointments.length, data: appointments });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/appointments - Create a new appointment
app.post('/api/v1/appointments', async (req, res, next) => {
  try {
    const { patientName, patientEmail, patientPhone, patientBloodGroup, patientAge, doctorId, date, timeSlot, reason } = req.body;

    // Check if patient details are provided. If patientId is provided directly, we can use it.
    let patientId = req.body.patientId;

    if (!patientId && patientName && patientEmail) {
      // Find or create patient to enable easy booking from the frontend form
      let patient = await Patient.findOne({ email: patientEmail });
      if (!patient) {
        patient = await Patient.create({
          name: patientName,
          email: patientEmail,
          phone: patientPhone || '',
          bloodGroup: patientBloodGroup || 'O+',
          age: patientAge || 30
        });
      }
      patientId = patient._id;
    } else if (!patientId && patientName) {
      // Fallback: If no email is provided, find patient by name, or create with dummy email
      let patient = await Patient.findOne({ name: patientName });
      if (!patient) {
        const dummyEmail = `${patientName.toLowerCase().replace(/\s+/g, '')}@example.com`;
        patient = await Patient.create({
          name: patientName,
          email: dummyEmail,
          phone: patientPhone || '',
          bloodGroup: patientBloodGroup || 'O+',
          age: patientAge || 30
        });
      }
      patientId = patient._id;
    }

    if (!patientId) {
      return res.status(400).json({
        success: false,
        error: 'Patient identifier (ID or Name + Email) is required'
      });
    }

    // Create the appointment using the resolved patientId and doctorId
    const appointment = await Appointment.create({
      patientId,
      doctorId,
      date,
      timeSlot,
      reason,
      status: req.body.status || 'pending'
    });

    // Populate patient and doctor details to return a rich response
    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('patientId')
      .populate('doctorId');

    res.status(201).json({ success: true, data: populatedAppointment });
  } catch (error) {
    next(error);
  }
});

// Task 3 & 5: Global error-handling middleware
app.use((err, req, res, next) => {
  console.error('Error occurred:', err.message);

  let statusCode = 500;
  let errorMessage = 'An unhandled server error occurred';

  // Handle Mongoose Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    errorMessage = Object.values(err.errors).map(val => val.message).join(', ');
  } 
  // Handle Mongoose Duplicate Key Error
  else if (err.code === 11000) {
    statusCode = 400;
    errorMessage = 'Duplicate field value entered. Patient email already exists.';
  } 
  // Handle Mongoose Cast Error (e.g. invalid ObjectId)
  else if (err.name === 'CastError') {
    statusCode = 400;
    errorMessage = `Invalid format for field ${err.path}`;
  } 
  // Handle standard errors with specific status codes if set
  else if (err.status) {
    statusCode = err.status;
    errorMessage = err.message;
  }

  res.status(statusCode).json({
    success: false,
    error: errorMessage
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
