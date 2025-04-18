import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
const { db } = require('../firebase');

const PatientDetailsPage = () => {
  const { patientId } = useParams();
  const [patient, setPatient] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        // Fetch patient data
        const patientRef = doc(db, 'patients', patientId);
        const patientSnap = await getDoc(patientRef);

        if (patientSnap.exists()) {
          setPatient({ id: patientSnap.id, ...patientSnap.data() });
        } else {
          setError('Patient not found');
        }

        // Fetch assessments
        const assessmentsRef = collection(db, 'assessments');
        const assessmentsSnap = await getDocs(assessmentsRef);
        const patientAssessments = assessmentsSnap.docs
          .filter(doc => doc.data().patientId === patientId)
          .map(doc => ({ id: doc.id, ...doc.data() }));

        setAssessments(patientAssessments);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching patient data:', err);
        setError('Failed to load patient data');
        setLoading(false);
      }
    };

    fetchPatientData();
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
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/patients" className="text-blue-600 hover:underline">
          ← Back to Patients
        </Link>
      </div>
      <h1 className="text-2xl font-bold mb-4">
        {patient.name}, {Math.floor(patient.ageInMonths / 12)} years
      </h1>
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-2">Patient Details</h2>
        <p className="text-gray-600">Age: {patient.ageInMonths} months</p>
        <p className="text-gray-600">Age Category: {patient.ageCategory}</p>
        <p className="text-gray-600">MRN: {patient.mrn || 'N/A'}</p>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Assessments</h2>
          <Link
            to={`/patients/${patientId}/new-assessment`}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            New Assessment
          </Link>
        </div>
        {assessments.length === 0 ? (
          <p className="text-gray-600">No assessments available.</p>
        ) : (
          <div className="space-y-4">
            {assessments.map(assessment => (
              <div key={assessment.id} className="border-b pb-4">
                <h3 className="text-md font-medium">
                  {assessment.type || 'Assessment'}
                </h3>
                <p className="text-gray-600">
                  Score: {assessment.score || 'N/A'}
                </p>
                <p className="text-gray-500 text-sm">
                  Date: {assessment.createdAt || 'N/A'}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDetailsPage;