import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DoctorsPage() {
  // Maintain three required states: data, loading, and error
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch doctor data using asynchronous pattern
  const fetchDoctors = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get('/api/v1/doctors');
      if (response.data && response.data.success) {
        setData(response.data.data);
      } else {
        setError('Unexpected API response structure');
      }
    } catch (err) {
      console.error('Error fetching doctors:', err);
      setError(err.response?.data?.error || 'Failed to fetch doctor information from backend');
    } finally {
      setLoading(false);
    }
  };

  // Mount effect to trigger load
  useEffect(() => {
    fetchDoctors();
  }, []);

  return (
    <div className="page-container fade-in">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Our Medical Specialists</h1>
          <p className="page-subtitle">Consult with our highly certified medical team</p>
        </div>
        <button className="btn btn-secondary" onClick={fetchDoctors} disabled={loading}>
          {loading ? 'Loading...' : '🔄 Refresh Doctors'}
        </button>
      </div>

      {/* 1. Display a loading message/indicator while in progress */}
      {loading ? (
        <div className="status-container">
          <div className="spinner"></div>
          <p>Connecting to directory, please wait...</p>
        </div>
      ) : null}

      {/* 2. Display an error message if the request fails */}
      {!loading && error ? (
        <div className="status-container error-card">
          <span className="error-icon">❌</span>
          <h3 className="error-title">Database Error</h3>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={fetchDoctors}>Try Again</button>
        </div>
      ) : null}

      {/* 3. Display the doctor data after successful request */}
      {!loading && !error && data.length === 0 ? (
        <div className="status-container empty-card">
          <span className="empty-icon">🩺</span>
          <h3>No Doctors Registered</h3>
          <p>Please seed the database or add doctors via API to see them here.</p>
        </div>
      ) : null}

      {!loading && !error && data.length > 0 ? (
        <div className="doctors-grid">
          {data.map((doctor) => (
            <div key={doctor._id} className="doctor-card">
              <div className="doctor-avatar">
                <span>🩺</span>
              </div>
              <div className="doctor-info-detail">
                {/* 4. Display Doctor name, Specialisation, and Availability */}
                <h3 className="doctor-name-card">{doctor.name}</h3>
                <p className="doctor-speciality">{doctor.specialisation}</p>
                <p className="doctor-email">{doctor.email || 'No email registered'}</p>
                
                <div className="doctor-status-row">
                  <span className={`status-pill ${doctor.available ? 'status-pill-available' : 'status-pill-unavailable'}`}>
                    {doctor.available ? '● Available Today' : '○ Unavailable'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default DoctorsPage;
