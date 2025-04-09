import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import ScoreInputForm from '../components/scoring/ScoreInputForm';
import scoringSystems from '../data/scoringSystems';

const ScoreInputPage = () => {
  const { patientId, scoreType } = useParams();
  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState(null);
  const [error, setError] = useState(null);

  const selectedSystem = scoringSystems.find((system) => system.id === scoreType);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        console.log("Fetching patient with ID:", patientId);
        const patientRef = doc(db, "patients", patientId);
        const patientSnap = await getDoc(patientRef);
        console.log("Firestore response:", patientSnap.exists(), patientSnap.data());
        if (patientSnap.exists()) {
          setPatient(patientSnap.data());
        } else {
          console.warn("No patient found with ID:", patientId);
          setError(`No patient found with ID: ${patientId}`);
        }
      } catch (error) {
        console.error("Error fetching patient:", error);
        setError("Failed to load patient data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchPatient();
  }, [patientId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-6">
          <h2 className="text-lg font-medium text-red-800">Error</h2>
          <p className="text-red-700">{error}</p>
          <Link
            to="/patients"
            className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Back to Patient List
          </Link>
        </div>
      </div>
    );
  }

  if (!selectedSystem) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-6">
          <h2 className="text-lg font-medium text-red-800">Error</h2>
          <p className="text-red-700">Scoring system "{scoreType}" not found.</p>
          <Link
            to={`/patients/${patientId}/new-assessment`}
            className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Select a Different Score
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link to={`/patients/${patientId}/new-assessment`} className="mr-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-600"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold">{selectedSystem.fullName} ({selectedSystem.name})</h1>
        <button className="ml-auto bg-gray-200 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-300 transition-colors flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          Help
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="mb-6">
          <h2 className="text-lg font-medium">Patient: {patient.name}</h2>
          <p className="text-gray-600">Age: {Math.floor(patient.ageInMonths / 12)} years</p>
          {scoreType === 'prism3' && (
            <p className="text-gray-600">
              Age Category:{' '}
              {patient.ageInMonths <= 30
                ? 'Neonate (0-30 days)'
                : patient.ageInMonths < 24
                ? 'Infant (31 days - 2 years)'
                : patient.ageInMonths < 156
                ? 'Child (2 years - 12 years)'
                : 'Adolescent (13 years and up)'}
            </p>
          )}
          <p className="text-gray-600">
            Applicable Age Groups:{' '}
            {selectedSystem.ageGroups.map((group) => `${group.name} (${group.range})`).join(', ')}
          </p>
        </div>

        <ScoreInputForm patientId={patientId} scoreType={scoreType} />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-medium mb-4">About {selectedSystem.fullName}</h2>
        <p className="text-gray-700 mb-4">{selectedSystem.description}</p>
        <div className="mb-4">
          <h3 className="font-medium mb-2">Purpose:</h3>
          <p className="text-gray-700">{selectedSystem.purpose}</p>
        </div>
        <div className="mb-4">
          <h3 className="font-medium mb-2">Components:</h3>
          <ul className="list-disc pl-5 text-gray-700">
            {selectedSystem.components.map((component, index) => (
              <li key={index}>{component}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-medium mb-2">Timeframe:</h3>
          <p className="text-gray-700">{selectedSystem.timeframe}</p>
        </div>
      </div>
    </div>
  );
};

export default ScoreInputPage;