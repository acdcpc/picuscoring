import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase';
import { collection, addDoc } from 'firebase/firestore';
import scoringSystems from '../../data/scoringSystems';

const ScoreInputForm = ({ patientId, scoreType }) => {
  const navigate = useNavigate();
  const selectedSystem = scoringSystems.find((system) => system.id === scoreType);

  // Define form fields for each scoring system based on their components
  const formFields = {
    prism3: [
      { name: 'systolic_bp', label: 'Systolic Blood Pressure (mmHg)', type: 'number', unit: 'mmHg' },
      { name: 'heart_rate', label: 'Heart Rate (beats/min)', type: 'number', unit: 'beats/min' },
      { name: 'temperature', label: 'Temperature (°C)', type: 'number', unit: '°C' },
      { name: 'gcs', label: 'Mental Status (GCS)', type: 'number', min: 3, max: 15 },
      { name: 'pupillary_reflexes', label: 'Pupillary Reflexes (Normal/Abnormal)', type: 'select', options: ['Normal', 'Abnormal'] },
      { name: 'ph', label: 'pH', type: 'number' },
      { name: 'pco2', label: 'PCO2 (mmHg)', type: 'number', unit: 'mmHg' },
      { name: 'total_co2', label: 'Total CO2 (mmol/L)', type: 'number', unit: 'mmol/L' },
      { name: 'pao2', label: 'PaO2 (mmHg)', type: 'number', unit: 'mmHg' },
      { name: 'glucose', label: 'Glucose (mg/dL)', type: 'number', unit: 'mg/dL' },
      { name: 'potassium', label: 'Potassium (mmol/L)', type: 'number', unit: 'mmol/L' },
      { name: 'creatinine', label: 'Creatinine (μmol/L)', type: 'number', unit: 'μmol/L' },
      { name: 'urea', label: 'Urea (mmol/L)', type: 'number', unit: 'mmol/L' },
      { name: 'wbc', label: 'White Blood Cells (×10⁹/L)', type: 'number', unit: '×10⁹/L' },
      { name: 'pt_ptt', label: 'PT/PTT (seconds)', type: 'number', unit: 'seconds' },
      { name: 'platelets', label: 'Platelets (×10³/μL)', type: 'number', unit: '×10³/μL' },
    ],
    sofa: [
      { name: 'pao2_fio2', label: 'PaO2/FiO2 Ratio (mmHg)', type: 'number', unit: 'mmHg' },
      { name: 'platelets', label: 'Platelets (×10³/μL)', type: 'number', unit: '×10³/μL' },
      { name: 'bilirubin', label: 'Bilirubin (μmol/L)', type: 'number', unit: 'μmol/L' },
      { name: 'map', label: 'Mean Arterial Pressure (mmHg)', type: 'number', unit: 'mmHg' },
      { name: 'vasopressors', label: 'Vasopressors Used', type: 'checkbox' },
      { name: 'gcs', label: 'Glasgow Coma Scale (GCS)', type: 'number', min: 3, max: 15 },
      { name: 'creatinine', label: 'Creatinine (μmol/L)', type: 'number', unit: 'μmol/L' },
      { name: 'urine_output', label: 'Urine Output (mL/day)', type: 'number', unit: 'mL/day' },
    ],
    comfortb: [
      { name: 'alertness', label: 'Alertness (1-5)', type: 'number', min: 1, max: 5 },
      { name: 'calmness', label: 'Calmness/Agitation (1-5)', type: 'number', min: 1, max: 5 },
      { name: 'respiratory_response', label: 'Respiratory Response (1-5)', type: 'number', min: 1, max: 5 },
      { name: 'physical_movement', label: 'Physical Movement (1-5)', type: 'number', min: 1, max: 5 },
      { name: 'muscle_tone', label: 'Muscle Tone (1-5)', type: 'number', min: 1, max: 5 },
      { name: 'facial_tension', label: 'Facial Tension (1-5)', type: 'number', min: 1, max: 5 },
    ],
    pim3: [
      { name: 'systolic_bp', label: 'Systolic Blood Pressure (mmHg)', type: 'number', unit: 'mmHg' },
      { name: 'pupillary_reactions', label: 'Pupillary Reactions (Normal/Abnormal)', type: 'select', options: ['Normal', 'Abnormal'] },
      { name: 'fio2_pao2', label: 'FiO2/PaO2 Ratio', type: 'number' },
      { name: 'base_excess', label: 'Base Excess (mmol/L)', type: 'number', unit: 'mmol/L' },
      { name: 'mechanical_ventilation', label: 'Mechanical Ventilation', type: 'checkbox' },
      { name: 'elective_admission', label: 'Elective Admission', type: 'checkbox' },
      { name: 'recovery_from_surgery', label: 'Recovery from Surgery', type: 'checkbox' },
      { name: 'cardiac_bypass', label: 'Cardiac Bypass', type: 'checkbox' },
      { name: 'high_risk_diagnosis', label: 'High-Risk Diagnosis', type: 'checkbox' },
      { name: 'low_risk_diagnosis', label: 'Low-Risk Diagnosis', type: 'checkbox' },
    ],
    pelod2: [
      { name: 'gcs', label: 'Glasgow Coma Scale (GCS)', type: 'number', min: 3, max: 15 },
      { name: 'pupillary_reaction', label: 'Pupillary Reaction (Normal/Abnormal)', type: 'select', options: ['Normal', 'Abnormal'] },
      { name: 'lactatemia', label: 'Lactatemia (mmol/L)', type: 'number', unit: 'mmol/L' },
      { name: 'map', label: 'Mean Arterial Pressure (mmHg)', type: 'number', unit: 'mmHg' },
      { name: 'creatinine', label: 'Creatinine (μmol/L)', type: 'number', unit: 'μmol/L' },
      { name: 'pao2_fio2', label: 'PaO2/FiO2 Ratio (mmHg)', type: 'number', unit: 'mmHg' },
      { name: 'paco2', label: 'PaCO2 (mmHg)', type: 'number', unit: 'mmHg' },
      { name: 'ventilation', label: 'Mechanical Ventilation', type: 'checkbox' },
      { name: 'wbc', label: 'White Blood Cells (×10⁹/L)', type: 'number', unit: '×10⁹/L' },
      { name: 'platelets', label: 'Platelets (×10³/μL)', type: 'number', unit: '×10³/μL' },
    ],
  };

  const initialFormData = formFields[scoreType]?.reduce((acc, field) => {
    acc[field.name] = field.type === 'checkbox' ? false : field.type === 'select' ? field.options[0] : '';
    return acc;
  }, {}) || {};

  const [formData, setFormData] = useState(initialFormData);
  const [currentPage, setCurrentPage] = useState(1);
  const fieldsPerPage = 4;
  const totalPages = Math.ceil((formFields[scoreType]?.length || 0) / fieldsPerPage);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const assessmentData = {
        patientId,
        scoreType,
        data: formData,
        timestamp: new Date().toISOString(),
      };
      const docRef = await addDoc(collection(db, 'assessments'), assessmentData);
      navigate(`/patients/${patientId}/results/${docRef.id}`);
    } catch (error) {
      console.error("Error saving assessment:", error);
    }
  };

  if (!formFields[scoreType]) {
    return <div>Form not available for this scoring system.</div>;
  }

  const startIndex = (currentPage - 1) * fieldsPerPage;
  const currentFields = formFields[scoreType].slice(startIndex, startIndex + fieldsPerPage);

  return (
    <form onSubmit={handleSubmit}>
      {currentFields.map((field) => (
        <div key={field.name} className="mb-4">
          <label className="block text-gray-700 mb-1">{field.label}</label>
          {field.type === 'checkbox' ? (
            <input
              type="checkbox"
              name={field.name}
              checked={formData[field.name] || false}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          ) : field.type === 'select' ? (
            <select
              name={field.name}
              value={formData[field.name] || field.options[0]}
              onChange={handleInputChange}
              className="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {field.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : (
            <div className="flex items-center">
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name] || ''}
                onChange={handleInputChange}
                min={field.min}
                max={field.max}
                className="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={`Enter ${field.label.toLowerCase()}`}
              />
              {field.unit && <span className="ml-2 text-gray-600">{field.unit}</span>}
            </div>
          )}
        </div>
      ))}
      <div className="flex justify-between items-center">
        {currentPage > 1 && (
          <button
            type="button"
            onClick={handlePrevious}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
          >
            Previous
          </button>
        )}
        <span className="text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        {currentPage < totalPages ? (
          <button
            type="button"
            onClick={handleNext}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Next
          </button>
        ) : (
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Submit
          </button>
        )}
      </div>
    </form>
  );
};

export default ScoreInputForm;