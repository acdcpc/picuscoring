import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Layout />}>
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
}

export default App;
