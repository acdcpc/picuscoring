import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PatientListPage from './pages/PatientListPage.jsx';
import PatientDetailsPage from './pages/PatientDetailsPage.jsx';
import NewAssessment from './components/NewAssessment.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-100">
        {/* Header */}
        <header className="bg-white shadow-md p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">PICU Score App</h1>
          <div className="text-sm text-gray-600">
            Powered by xAI
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow container mx-auto p-4">
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Navigate to="/patients" replace />} />
              <Route path="/patients" element={<PatientListPage />} />
              <Route path="/patients/:patientId" element={<PatientDetailsPage />} />
              <Route
                path="/patients/:patientId/new-assessment"
                element={
                  <ErrorBoundary>
                    {console.log('Rendering NewAssessment route')}
                    <NewAssessment />
                  </ErrorBoundary>
                }
              />
              <Route
                path="*"
                element={
                  <div className="p-6 text-red-600">
                    <h2 className="text-xl font-bold">Route Not Found</h2>
                    <p>The requested route does not exist.</p>
                  </div>
                }
              />
            </Routes>
          </ErrorBoundary>
        </main>

        {/* Footer */}
        <footer className="bg-white shadow-inner p-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-600">Photo</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">Dr Prakash Thapa, Pediatric Intensivist</p>
              <p className="text-sm text-gray-600">prakashthapa_paed@pahs.edu.np</p>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            © 2025 PICU Score App. All rights reserved to my love Alisha.
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;