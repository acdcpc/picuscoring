import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { useState, useEffect } from 'react';
import HomePage from './pages/HomePage';
import PatientListPage from './pages/PatientListPage';
import PatientDetailsPage from './pages/PatientDetailsPage';
import ScoreSelectionPage from './pages/ScoreSelectionPage';
import ScoreInputPage from './pages/ScoreInputPage';
import ScoreResultsPage from './pages/ScoreResultsPage';
import TrendAnalysisPage from './pages/TrendAnalysisPage';
import SettingsPage from './pages/SettingsPage';
import HelpPage from './pages/HelpPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import Layout from './components/Layout';

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
    <Router>
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/" /> : <LoginPage />}
        />
        <Route
          path="/"
          element={user ? <Layout /> : <Navigate to="/login" />}
        >
          <Route index element={<HomePage />} />
          <Route path="patients" element={<PatientListPage />} />
          <Route path="patients/:patientId" element={<PatientDetailsPage />} />
          <Route path="patients/:patientId/new-assessment" element={<ScoreSelectionPage />} />
          <Route path="patients/:patientId/score/:scoreType" element={<ScoreInputPage />} />
          <Route path="patients/:patientId/results/:assessmentId" element={<ScoreResultsPage />} />
          <Route path="patients/:patientId/trends" element={<TrendAnalysisPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="help" element={<HelpPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;