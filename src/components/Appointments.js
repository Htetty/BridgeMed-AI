import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

const Appointments = ({ user }) => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    if (user) {
      loadAppointments();
    }
  }, [user]);

  const loadAppointments = async () => {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error loading appointments:', error.message);
    } else {
      setAppointments(data);
    }
  };

  const handleCardClick = (appointment) => {
    setSelectedAppointment(appointment);
  };

  const handleBackClick = () => {
    setSelectedAppointment(null);
  };

  return (
    <>

      <div className="main">
        <div className="header">Past Appointments</div>

        {selectedAppointment ? (
          <div className="appointment-details">
            <button onClick={handleBackClick}>← Back to All Appointments</button>
            <h2>Appointment Details</h2>
            <p><strong>Notes:</strong> {selectedAppointment.notes}</p>
            <p><strong>Date:</strong> {selectedAppointment.dates ? new Date(selectedAppointment.dates).toLocaleString() : 'No date provided'}</p>
            <p><strong>Location:</strong> 123 Main St, Anytown, USA</p>
          </div>
        ) : (
          <div className="appointment-grid">
            {appointments.length > 0 ? (
              appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="appointment-card"
                  onClick={() => handleCardClick(appointment)}
                  style={{ cursor: 'pointer' }}
                >
                  <img src="https://i.pravatar.cc/100?img=34" alt="Doctor" />
                  <div className="name">
                    APPOINTMENT<br />
                    <span>{appointment.notes}</span>
                  </div>
                  <div className="time">
                    {appointment.dates
                      ? new Date(appointment.dates).toLocaleString()
                      : 'No date provided'}
                  </div>
                  <div className="location">
                    123 Main St, Anytown, USA
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: '1rem' }}>No appointments found.</div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Appointments;
