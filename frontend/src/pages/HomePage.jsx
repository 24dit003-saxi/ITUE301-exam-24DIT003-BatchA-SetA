import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AppointmentCard from '../components/AppointmentCard';

// Default mock appointments for frontend-only mode or fallback (Task 1 & 2)
const defaultAppointments = [
  {
    _id: 'mock-1',
    patientId: { name: 'Amit Sharma' },
    doctorId: { name: 'Dr. Aarav Mehta' },
    date: '2026-08-22',
    timeSlot: '10:00 AM - 10:30 AM',
    status: 'confirmed'
  },
  {
    _id: 'mock-2',
    patientId: { name: 'Sunita Gupta' },
    doctorId: { name: 'Dr. Ananya Sharma' },
    date: '2026-08-23',
    timeSlot: '11:30 AM - 12:00 PM',
    status: 'pending'
  },
  {
    _id: 'mock-3',
    patientId: { name: 'Rajesh Kumar' },
    doctorId: { name: 'Dr. Sneha Patel' },
    date: '2026-08-24',
    timeSlot: '03:00 PM - 03:30 PM',
    status: 'cancelled'
  }
];

function HomePage() {
  // Initialize state with default appointments so cards render immediately (Task 1 & 2)
  const [appointments, setAppointments] = useState(defaultAppointments);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get('/api/v1/appointments');
      if (response.data && response.data.success) {
        // If backend is connected, use DB records
        setAppointments(response.data.data.length > 0 ? response.data.data : defaultAppointments);
      }
    } catch (err) {
      console.warn('Could not load appointments from backend, displaying default mock list:', err.message);
      // Fallback is already loaded in state, so we don't block display
      setError('');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div className="page-container fade-in">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Appointment Dashboard</h1>
          <p className="page-subtitle">Manage and track MedCare Plus appointments</p>
        </div>
        <button className="btn btn-secondary btn-refresh" onClick={fetchAppointments} disabled={loading}>
          {loading ? 'Refreshing...' : '🔄 Refresh List'}
        </button>
      </div>

      <div className="appointments-grid">
        {appointments.map((appointment) => {
          // Patient and Doctor names can be pulled from populated models
          const patientName = appointment.patientId?.name || 'Unknown Patient';
          const doctorName = appointment.doctorId?.name || 'Unknown Doctor';
          
          return (
            <AppointmentCard
              key={appointment._id}
              patientName={patientName}
              doctorName={doctorName}
              date={appointment.date}
              timeSlot={appointment.timeSlot}
              status={appointment.status}
            />
          );
        })}
      </div>
    </div>
  );
}

export default HomePage;
