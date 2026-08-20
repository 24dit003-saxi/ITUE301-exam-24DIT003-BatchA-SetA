import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function BookingPage() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  
  // State 1: Form data state
  const [formData, setFormData] = useState({
    patientName: '',
    patientEmail: '',
    patientPhone: '',
    patientBloodGroup: 'O+',
    patientAge: '',
    doctorId: '',
    date: '',
    timeSlot: '',
    reason: ''
  });

  // State 2: Selected doctor name for live rendering and submission feedback
  const [selectedDoctorName, setSelectedDoctorName] = useState('');
  
  // General status states
  const [loading, setLoading] = useState(false);
  const [fetchingDoctors, setFetchingDoctors] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch doctors to populate select input
  useEffect(() => {
    const loadDoctors = async () => {
      try {
        setFetchingDoctors(true);
        const response = await axios.get('/api/v1/doctors');
        if (response.data && response.data.success) {
          // Filter only available doctors for appointments
          setDoctors(response.data.data);
          if (response.data.data.length > 0) {
            // Pre-select first doctor
            setFormData(prev => ({ ...prev, doctorId: response.data.data[0]._id }));
            setSelectedDoctorName(response.data.data[0].name);
          }
        }
      } catch (err) {
        console.error('Error loading doctors for form:', err);
        setErrorMessage('Failed to load doctor directory. Please run the backend first.');
      } finally {
        setFetchingDoctors(false);
      }
    };
    loadDoctors();
  }, []);

  // Handle inputs dynamically
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // If changing doctor select, update our second state value meaningfully
    if (name === 'doctorId') {
      const doc = doctors.find(d => d._id === value);
      setSelectedDoctorName(doc ? doc.name : '');
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const payload = {
        patientName: formData.patientName,
        patientEmail: formData.patientEmail,
        patientPhone: formData.patientPhone,
        patientBloodGroup: formData.patientBloodGroup,
        patientAge: formData.patientAge ? Number(formData.patientAge) : undefined,
        doctorId: formData.doctorId,
        date: formData.date,
        timeSlot: formData.timeSlot,
        reason: formData.reason
      };

      const response = await axios.post('/api/v1/appointments', payload);
      
      if (response.data && response.data.success) {
        setSuccessMessage(`Appointment successfully scheduled for ${formData.patientName}! Redirecting...`);
        // Reset form
        setFormData({
          patientName: '',
          patientEmail: '',
          patientPhone: '',
          patientBloodGroup: 'O+',
          patientAge: '',
          doctorId: doctors[0]?._id || '',
          date: '',
          timeSlot: '',
          reason: ''
        });
        
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    } catch (err) {
      console.error('Error saving appointment:', err);
      setErrorMessage(err.response?.data?.error || 'Validation error saving appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container booking-container fade-in">
      <div className="booking-layout">
        
        {/* Form Container */}
        <div className="form-card">
          <h1 className="page-title">Book an Appointment</h1>
          <p className="page-subtitle">Fill in the patient details and choose a preferred specialist</p>

          {errorMessage && (
            <div className="alert-message error-alert">
              <span>⚠️</span> {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="alert-message success-alert">
              <span>✓</span> {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="booking-form">
            <h3 className="section-title">1. Patient Information</h3>
            
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="patientName">Full Name *</label>
                <input
                  type="text"
                  id="patientName"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleChange}
                  placeholder="Enter patient full name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="patientEmail">Email Address *</label>
                <input
                  type="email"
                  id="patientEmail"
                  name="patientEmail"
                  value={formData.patientEmail}
                  onChange={handleChange}
                  placeholder="name@email.com"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="patientPhone">Phone Number</label>
                <input
                  type="tel"
                  id="patientPhone"
                  name="patientPhone"
                  value={formData.patientPhone}
                  onChange={handleChange}
                  placeholder="e.g. +91 9999999999"
                />
              </div>

              <div className="form-row">
                <div className="form-group half-width">
                  <label htmlFor="patientAge">Age</label>
                  <input
                    type="number"
                    id="patientAge"
                    name="patientAge"
                    value={formData.patientAge}
                    onChange={handleChange}
                    placeholder="e.g. 35"
                    min="0"
                  />
                </div>

                <div className="form-group half-width">
                  <label htmlFor="patientBloodGroup">Blood Group</label>
                  <select
                    id="patientBloodGroup"
                    name="patientBloodGroup"
                    value={formData.patientBloodGroup}
                    onChange={handleChange}
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </div>
            </div>

            <h3 className="section-title">2. Appointment & Doctor Details</h3>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="doctorId">Select Doctor *</label>
                {fetchingDoctors ? (
                  <select disabled><option>Loading doctors...</option></select>
                ) : (
                  <select
                    id="doctorId"
                    name="doctorId"
                    value={formData.doctorId}
                    onChange={handleChange}
                    required
                  >
                    {doctors.map(doc => (
                      <option key={doc._id} value={doc._id}>
                        {doc.name} ({doc.specialisation}) {doc.available ? '' : '- Unavailable'}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="form-row">
                <div className="form-group half-width">
                  <label htmlFor="date">Date *</label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group half-width">
                  <label htmlFor="timeSlot">Time Slot *</label>
                  <input
                    type="text"
                    id="timeSlot"
                    name="timeSlot"
                    value={formData.timeSlot}
                    onChange={handleChange}
                    placeholder="e.g. 10:00 AM - 10:30 AM"
                    required
                  />
                </div>
              </div>

              <div className="form-group full-width">
                <label htmlFor="reason">Reason for Appointment</label>
                <textarea
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  placeholder="Brief description of symptoms or consultation reason (max 300 characters)"
                  maxLength="350"
                  rows="3"
                ></textarea>
                <span className="char-count">
                  {formData.reason.length}/300 characters
                </span>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-submit" disabled={loading || fetchingDoctors}>
              {loading ? 'Scheduling Appointment...' : 'Schedule Appointment'}
            </button>
          </form>
        </div>

        {/* Live Preview Container */}
        <div className="live-preview-card">
          <div className="preview-sticky">
            <h3>Live Booking Preview</h3>
            <p className="preview-hint">Information will update in real-time as you fill the form.</p>
            
            <div className="preview-receipt">
              <div className="receipt-header">
                <h4>MedCare Plus Receipt</h4>
                <span className="badge-preview">DRAFT</span>
              </div>
              
              <div className="receipt-body">
                <div className="receipt-row">
                  <span className="receipt-label">Patient Name:</span>
                  {/* Task 2: Display entered patient name on the page as the state changes */}
                  <span className="receipt-value patient-live-name">
                    {formData.patientName ? formData.patientName : <span className="placeholder-text">Not entered yet</span>}
                  </span>
                </div>
                
                <div className="receipt-row">
                  <span className="receipt-label">Selected Doctor:</span>
                  {/* Task 2: Display selected doctor on the page as state changes */}
                  <span className="receipt-value doctor-live-name">
                    {selectedDoctorName ? selectedDoctorName : <span className="placeholder-text">None selected</span>}
                  </span>
                </div>

                <div className="receipt-row">
                  <span className="receipt-label">Preferred Date:</span>
                  <span className="receipt-value">
                    {formData.date ? formData.date : <span className="placeholder-text">Choose date</span>}
                  </span>
                </div>

                <div className="receipt-row">
                  <span className="receipt-label">Preferred Time:</span>
                  <span className="receipt-value">
                    {formData.timeSlot ? formData.timeSlot : <span className="placeholder-text">Specify slot</span>}
                  </span>
                </div>

                <div className="receipt-row text-center">
                  <p className="status-label">Initial Status: <span className="status-badge status-pending">pending</span></p>
                </div>
              </div>
              
              <div className="receipt-decoration">
                <div className="cut-marks"></div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default BookingPage;
