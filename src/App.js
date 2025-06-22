// src/App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

import Sidebar from './components/Sidebar';
import Background from './components/Background';
import Main from './components/Main';
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

function AppContent() {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const isMainPage = location.pathname === '/';

  useEffect(() => {
    const ensureInitialAppointment = async (userId) => {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', userId);

      if (!error && data.length === 0) {
        await supabase.from('appointments').insert([
          {
            user_id: userId,
            notes: null,
            dates: new Date().toISOString()
          }
        ]);
      }
    };

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
        (async () => {
          await ensureInitialAppointment(session.user.id);
        })();
      } else {
        setUser(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <div className={`App ${isMainPage ? 'no-sidebar' : ''}`}>
      {!isMainPage && <Sidebar />}
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
  );
}

function App() {
  return (
      <Router>
        <AppContent />
      </Router>
  );
}

export default App;
