import React from 'react';

function AppointmentCard({ patientName, doctorName, date, timeSlot, status }) {
  // Format date if it's a valid date string
  const formatDate = (dateStr) => {
    try {
      const option = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateStr).toLocaleDateString(undefined, option);
    } catch (e) {
      return dateStr;
    }
  };

  // Assign CSS status class
  const getStatusClass = (statusVal) => {
    const statusLower = String(statusVal).toLowerCase();
    if (statusLower === 'confirmed') return 'status-badge status-confirmed';
    if (statusLower === 'cancelled') return 'status-badge status-cancelled';
    return 'status-badge status-pending'; // default
  };

  return (
    <div className="appointment-card">
      <div className="card-header">
        <div className="patient-info">
          <span className="card-label">Patient</span>
          <h3 className="patient-name">{patientName}</h3>
        </div>
        <span className={getStatusClass(status)}>
          {status}
        </span>
      </div>

      <div className="card-body">
        <div className="detail-item">
          <span className="icon">🩺</span>
          <div className="detail-content">
            <span className="card-label">Doctor</span>
            <p className="doctor-name">{doctorName}</p>
          </div>
        </div>

        <div className="detail-row">
          <div className="detail-item">
            <span className="icon">📅</span>
            <div className="detail-content">
              <span className="card-label">Date</span>
              <p className="appointment-date">{formatDate(date)}</p>
            </div>
          </div>

          <div className="detail-item">
            <span className="icon">🕒</span>
            <div className="detail-content">
              <span className="card-label">Time Slot</span>
              <p className="appointment-time">{timeSlot}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppointmentCard;
