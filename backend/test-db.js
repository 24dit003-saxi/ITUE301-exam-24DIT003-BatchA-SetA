const mongoose = require('mongoose');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const Patient = require('./models/Patient');
const Doctor = require('./models/Doctor');
const Appointment = require('./models/Appointment');

const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hospital_db';

async function runTests() {
  console.log('==================================================');
  console.log('STARTING MONGOOSE SCHEMA AND VALIDATION TESTS');
  console.log('==================================================');

  try {
    await mongoose.connect(mongoURI);
    console.log(`Successfully connected to MongoDB at ${mongoURI}`);

    // Clear test data to start fresh
    await Patient.deleteMany({ email: /test.*@email\.com/ });
    await Doctor.deleteMany({ email: /test.*@medcare\.com/ });
    await Appointment.deleteMany({});
    console.log('Cleared existing test records.\n');

    // -----------------------------------------------------------------
    // TEST 1: Working Operation (Successful Inserts)
    // -----------------------------------------------------------------
    console.log('--- TEST 1: Creating Valid Doctor, Patient, and Appointment ---');

    // 1. Create a Doctor
    const validDoctor = await Doctor.create({
      name: 'Dr. Devendra Sharma',
      email: 'test.sharma@medcare.com',
      specialisation: 'Cardiology',
      available: true
    });
    console.log('✓ Successfully created Doctor:', {
      id: validDoctor._id,
      name: validDoctor.name,
      specialisation: validDoctor.specialisation
    });

    // 2. Create a Patient
    const validPatient = await Patient.create({
      name: 'Rajesh Kumar',
      email: 'test.rajesh.kumar@email.com',
      phone: '9876543210',
      bloodGroup: 'O+',
      age: 45
    });
    console.log('✓ Successfully created Patient:', {
      id: validPatient._id,
      name: validPatient.name,
      bloodGroup: validPatient.bloodGroup
    });

    // 3. Create an Appointment
    const validAppointment = await Appointment.create({
      patientId: validPatient._id,
      doctorId: validDoctor._id,
      date: new Date('2026-09-01'),
      timeSlot: '10:00 AM - 10:30 AM',
      status: 'confirmed',
      reason: 'Routine health checkup and blood pressure monitoring.'
    });
    console.log('✓ Successfully created Appointment:', {
      id: validAppointment._id,
      patientId: validAppointment.patientId,
      doctorId: validAppointment.doctorId,
      status: validAppointment.status,
      date: validAppointment.date.toISOString().split('T')[0]
    });
    console.log('\n');

    // -----------------------------------------------------------------
    // TEST 2: Validation Failure - Missing Required Field
    // -----------------------------------------------------------------
    console.log('--- TEST 2: Triggering Validation Failure (Missing Required Field) ---');
    try {
      await Patient.create({
        email: 'test.missing.name@email.com',
        phone: '1111111111',
        bloodGroup: 'O+',
        age: 25
      });
      console.log('✗ Unexpected Success: Created patient with missing name!');
    } catch (err) {
      console.log('✓ Expected Validation Failure Caught!');
      printParsedError(err);
    }
    console.log('\n');

    // -----------------------------------------------------------------
    // TEST 3: Validation Failure - Invalid Blood Group
    // -----------------------------------------------------------------
    console.log('--- TEST 3: Triggering Validation Failure (Invalid Blood Group) ---');
    try {
      await Patient.create({
        name: 'Test Invalid Blood',
        email: 'test.invalid.blood@email.com',
        phone: '2222222222',
        bloodGroup: 'Z+', // Invalid blood group
        age: 30
      });
      console.log('✗ Unexpected Success: Created patient with invalid blood group!');
    } catch (err) {
      console.log('✓ Expected Validation Failure Caught!');
      printParsedError(err);
    }
    console.log('\n');

    // -----------------------------------------------------------------
    // TEST 4: Validation Failure - Invalid Appointment Status
    // -----------------------------------------------------------------
    console.log('--- TEST 4: Triggering Validation Failure (Invalid Appointment Status) ---');
    try {
      await Appointment.create({
        patientId: validPatient._id,
        doctorId: validDoctor._id,
        date: new Date(),
        timeSlot: '11:00 AM',
        status: 'completed', // Invalid status (must be pending, confirmed, cancelled)
        reason: 'Routine checkup.'
      });
      console.log('✗ Unexpected Success: Created appointment with invalid status!');
    } catch (err) {
      console.log('✓ Expected Validation Failure Caught!');
      printParsedError(err);
    }
    console.log('\n');

    // -----------------------------------------------------------------
    // TEST 5: Validation Failure - Reason Exceeding 300 Characters
    // -----------------------------------------------------------------
    console.log('--- TEST 5: Triggering Validation Failure (Reason Exceeding 300 Characters) ---');
    const longReason = 'a'.repeat(301); // 301 characters long
    try {
      await Appointment.create({
        patientId: validPatient._id,
        doctorId: validDoctor._id,
        date: new Date(),
        timeSlot: '11:00 AM',
        status: 'pending',
        reason: longReason
      });
      console.log('✗ Unexpected Success: Created appointment with extra-long reason!');
    } catch (err) {
      console.log('✓ Expected Validation Failure Caught!');
      printParsedError(err);
    }
    console.log('\n');

  } catch (error) {
    console.error('Critical script execution error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('Closed MongoDB connection.');
    console.log('==================================================');
  }
}

// Function to mimic backend's parsed error format
function printParsedError(err) {
  let errorMessage = 'An error occurred';
  if (err.name === 'ValidationError') {
    errorMessage = Object.values(err.errors).map(val => val.message).join(', ');
  } else if (err.code === 11000) {
    errorMessage = 'Duplicate key error: Patient email already exists.';
  } else {
    errorMessage = err.message;
  }
  console.log('Parsed Error JSON Response:\n', JSON.stringify({ success: false, error: errorMessage }, null, 2));
}

runTests();
