import React, { useState } from 'react';
import Sidebar from './Sidebar';

const Appointments = () => {
  const [appointments] = useState([
    {
      id: 1,
      name: 'INITIAL CHECKUP',
      doctor: 'Dr. Emily Smith',
      time: '10:00 AM, Tuesday, June 10, 2025',
      location: '123 Main St, Anytown, USA',
      image: 'https://i.pravatar.cc/100?img=34'
    },
    {
      id: 2,
      name: 'PHYSICAL',
      doctor: 'Dr. Emily Smith',
      time: '1:00 PM, Monday, June 23, 2025',
      location: '123 Main St, Anytown, USA',
      image: 'https://i.pravatar.cc/100?img=34'
    },
    {
      id: 3,
      name: 'Appointment Name',
      doctor: 'Doctor Name',
      time: 'Time, Day, Month, Year',
      location: 'Location',
      image: 'https://i.pravatar.cc/150?img=34'
    },
    {
      id: 4,
      name: 'Appointment Name',
      doctor: 'Doctor Name',
      time: 'Time, Day, Month, Year',
      location: 'Location',
      image: 'https://i.pravatar.cc/100?img=34'
    },
    {
      id: 5,
      name: 'Appointment Name',
      doctor: 'Doctor Name',
      time: 'Time, Day, Month, Year',
      location: 'Location',
      image: 'https://i.pravatar.cc/100?img=34'
    }
  ]);

  return (
    <>
      <Sidebar />
      
      <div className="main">
        <div className="header">Hello, Username</div>

        <div className="appointment-grid">
          {appointments.map(appointment => (
            <div key={appointment.id} className="appointment-card">
              <img src={appointment.image} alt="Appointment" />
              <div className="name">{appointment.name}<br />{appointment.doctor}</div>
              <div className="time">{appointment.time}</div>
              <div className="location">{appointment.location}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Appointments; 