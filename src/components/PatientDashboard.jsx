import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase.js';
import NewAssessment from './NewAssessment';

const PatientDashboard = ({ patientId = 'test123' }) => {
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const patientRef = doc(db, 'patients', patientId);
        const patientSnap = await getDoc(patientRef);
        if (patientSnap.exists()) {
          setPatientData({ id: patientSnap.id, ...patientSnap.data() });
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
  }, [patientId]);

  if (loading) return <div>Loading patient data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Patient: {patientData.name || 'Unknown'}</h1>
      <NewAssessment patientData={patientData} />
    </div>
  );
};

export default PatientDashboard;