// src/App.jsx
// Change a line, e.g., a heading in your app
<h1>PICU App Score - PRakash  Merge Test</h1>
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import Layout from './components/layout/Layout';
import PatientListPage from './pages/PatientListPage';
import PatientDetailPage from './pages/PatientDetailPage';
import ScoreSelectionPage from './pages/ScoreSelectionPage';
import ScoreInputPage from './pages/ScoreInputPage';
import ScoreResultPage from './pages/ScoreResultPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/patients" /> : <LoginPage />} />
        <Route element={<Layout />}>
          <Route
            path="/"
            element={user ? <Navigate to="/patients" /> : <Navigate to="/login" />}
          />
          <Route
            path="/patients"
            element={user ? <PatientListPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/patients/:patientId"
            element={user ? <PatientDetailPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/patients/:patientId/new-assessment"
            element={user ? <ScoreSelectionPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/patients/:patientId/score/:scoreType"
            element={user ? <ScoreInputPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/patients/:patientId/results/:assessmentId"
            element={user ? <ScoreResultPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/settings"
            element={user ? <SettingsPage /> : <Navigate to="/login" />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
