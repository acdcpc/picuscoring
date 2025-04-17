import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { db } from './firebase.js';
import PatientListPage from './pages/PatientListPage.jsx';
import PatientDetailsPage from './pages/PatientDetailsPage.jsx';
import NewAssessment from './components/NewAssessment.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';

const NewAssessmentWrapper = () => {
  const { patientId } = useParams();
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        // Auto-sign-in anonymously
        signInAnonymously(auth)
          .then(() => console.log('Signed in anonymously'))
          .catch((err) => {
            console.error('Anonymous sign-in failed:', err);
            setError('Authentication failed');
            setLoading(false);
          });
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchPatient = async () => {
      try {
        const patientRef = doc(db, 'patients', patientId);
        const patientSnap = await getDoc(patientRef);
        if (patientSnap.exists()) {
          const patientData = patientSnap.data();
          const ageInMonths = patientData.ageInMonths || 0;
          let ageCategory;
          if (ageInMonths < 1) ageCategory = '<1 month';
          else if (ageInMonths < 12) ageCategory = '1 to 11 months';
          else if (ageInMonths < 24) ageCategory = '1 to <2 years';
          else if (ageInMonths < 60) ageCategory = '2 to <5 years';
          else if (ageInMonths < 144) ageCategory = '5 to <12 years';
          else ageCategory = '12 to 17 years';
          setPatientData({ id: patientSnap.id, ...patientData, ageCategory });
        } else {
          console.warn('Patient not found, using fallback data');
          setPatientData({ id: patientId, ageCategory: '5 to <12 years', name: 'Unknown' });
        }
      } catch (err) {
        console.error('Error fetching patient:', err);
        setError('Failed to load patient data');
        setPatientData({ id: patientId, ageCategory: '5 to <12 years', name: 'Unknown' });
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [patientId, user]);

  if (!user && !error) return <div>Authenticating...</div>;
  if (loading) return <div>Loading patient data...</div>;
  if (error) return <div>Error: {error}</div>;

  console.log('NewAssessmentWrapper patientData:', patientData);

  return (
    <ErrorBoundary>
      <NewAssessment patientData={patientData} />
    </ErrorBoundary>
  );
};

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
                element={<NewAssessmentWrapper />}
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