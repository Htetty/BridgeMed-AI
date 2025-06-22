import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

import Sidebar from './components/Sidebar';
import Main from './components/Main';
//import Dashboard from './components/Dashboard';
import Appointments from './components/Appointments';
import Notifications from './components/Notifications';
import Settings from './components/Settings';
import Documents from './components/Documents';
import Recordings from './components/Recordings';

import './App.css';

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

// Wrapper to pass user to Appointments
const AppointmentsWrapper = ({ user }) => {
  return <Appointments user={user} />;
};

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const restoreSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Session fetch error:", error.message);
        return;
      }

      const user = data.session?.user;
      if (user) {
        setUser(user);
      }
    };

    restoreSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <Router>
      <div className="App">
        <Sidebar /> {/* Add this line */}
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/appointments" element={<AppointmentsWrapper user={user} />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/recordings" element={<Recordings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
      <span style={{ display: 'none' }}></span>
    </Router>
  );
}

export default App;
