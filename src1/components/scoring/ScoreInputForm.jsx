import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import scoringSystems from '../../data/scoringSystems';

// PRISM-3 form fields
const PRISM3Fields = [
  { id: 'gcs', label: 'Glasgow Coma Scale', unit: '', type: 'number', min: 3, max: 15 },
  { id: 'pupillaryReflexes', label: 'Pupillary Reflexes', unit: '', type: 'select', 
    options: [
      { value: 'both_reactive', label: 'Both reactive' },
      { value: 'one_fixed', label: 'One fixed' },
      { value: 'both_fixed', label: 'Both fixed' }
    ]
  },
  { id: 'systolicBP', label: 'Systolic Blood Pressure', unit: 'mmHg', type: 'number' },
  { id: 'heartRate', label: 'Heart Rate', unit: 'bpm', type: 'number' },
  { id: 'temperature', label: 'Temperature', unit: '°C', type: 'number', step: 0.1 },
  { id: 'pH', label: 'pH', unit: '', type: 'number', step: 0.01, min: 6.5, max: 8.0 },
  { id: 'totalCO2', label: 'Total CO2', unit: 'mmol/L', type: 'number', step: 0.1 },
  { id: 'paO2', label: 'PaO2', unit: 'mmHg', type: 'number' },
  { id: 'pCO2', label: 'PCO2', unit: 'mmHg', type: 'number' },
  { id: 'glucose', label: 'Glucose', unit: 'mmol/L', type: 'number', step: 0.1 },
  { id: 'potassium', label: 'Potassium', unit: 'mmol/L', type: 'number', step: 0.1 },
  { id: 'creatinine', label: 'Creatinine', unit: 'μmol/L', type: 'number' },
  { id: 'urea', label: 'Urea (BUN)', unit: 'mmol/L', type: 'number', step: 0.1 },
  { id: 'wbc', label: 'White Blood Cells', unit: '×10³/μL', type: 'number', step: 0.1 },
  { id: 'pt', label: 'Prothrombin Time (PT)', unit: 'seconds', type: 'number', step: 0.1 },
  { id: 'ptt', label: 'Partial Thromboplastin Time (PTT)', unit: 'seconds', type: 'number', step: 0.1 },
  { id: 'platelets', label: 'Platelets', unit: '×10³/μL', type: 'number' }
];

// SOFA form fields
const SOFAFields = [
  { id: 'pao2fio2', label: 'PaO₂/FiO₂ Ratio', unit: 'mmHg', type: 'number' },
  { id: 'isVentilated', label: 'Mechanical Ventilation', unit: '', type: 'checkbox' },
  { id: 'platelets', label: 'Platelets', unit: '×10³/μL', type: 'number' },
  { id: 'bilirubin', label: 'Bilirubin', unit: 'μmol/L', type: 'number', step: 0.1 },
  { id: 'map', label: 'Mean Arterial Pressure', unit: 'mmHg', type: 'number' },
  { id: 'dopamine', label: 'Dopamine', unit: 'μg/kg/min', type: 'number', step: 0.1 },
  { id: 'dobutamine', label: 'Dobutamine', unit: 'μg/kg/min', type: 'number', step: 0.1 },
  { id: 'epinephrine', label: 'Epinephrine', unit: 'μg/kg/min', type: 'number', step: 0.01 },
  { id: 'norepinephrine', label: 'Norepinephrine', unit: 'μg/kg/min', type: 'number', step: 0.01 },
  { id: 'gcs', label: 'Glasgow Coma Scale', unit: '', type: 'number', min: 3, max: 15 },
  { id: 'creatinine', label: 'Creatinine', unit: 'μmol/L', type: 'number' },
  { id: 'urineOutput', label: 'Urine Output', unit: 'mL/day', type: 'number' }
];

// COMFORT-B form fields
const COMFORTBFields = [
  { id: 'alertness', label: 'Alertness', unit: '', type: 'radio', 
    options: [
      { value: 1, label: '1 - Deeply asleep' },
      { value: 2, label: '2 - Lightly asleep' },
      { value: 3, label: '3 - Drowsy' },
      { value: 4, label: '4 - Awake and alert' },
      { value: 5, label: '5 - Hyper-alert' }
    ]
  },
  { id: 'calmness', label: 'Calmness/Agitation', unit: '', type: 'radio', 
    options: [
      { value: 1, label: '1 - Calm' },
      { value: 2, label: '2 - Slightly anxious' },
      { value: 3, label: '3 - Anxious' },
      { value: 4, label: '4 - Very anxious' },
      { value: 5, label: '5 - Panicky' }
    ]
  },
  { id: 'respiratory', label: 'Respiratory Response', unit: '', type: 'radio', 
    options: [
      { value: 1, label: '1 - No spontaneous respiration / Quiet breathing' },
      { value: 2, label: '2 - Spontaneous respiration with little response / Occasional slight increase' },
      { value: 3, label: '3 - Occasional cough or resistance / Frequent slight increase' },
      { value: 4, label: '4 - Actively breathes against ventilator / Sustained moderate increase' },
      { value: 5, label: '5 - Fights ventilator / Severe respiratory distress' }
    ]
  },
  { id: 'movement', label: 'Physical Movement', unit: '', type: 'radio', 
    options: [
      { value: 1, label: '1 - No movement' },
      { value: 2, label: '2 - Occasional slight movement' },
      { value: 3, label: '3 - Frequent slight movement' },
      { value: 4, label: '4 - Vigorous movement limited to extremities' },
      { value: 5, label: '5 - Vigorous movement including torso and head' }
    ]
  },
  { id: 'muscleTone', label: 'Muscle Tone', unit: '', type: 'radio', 
    options: [
      { value: 1, label: '1 - Muscles totally relaxed' },
      { value: 2, label: '2 - Reduced muscle tone' },
      { value: 3, label: '3 - Normal muscle tone' },
      { value: 4, label: '4 - Increased muscle tone' },
      { value: 5, label: '5 - Extreme muscle rigidity' }
    ]
  },
  { id: 'facialTension', label: 'Facial Tension', unit: '', type: 'radio', 
    options: [
      { value: 1, label: '1 - Facial muscles totally relaxed' },
      { value: 2, label: '2 - Normal facial tone' },
      { value: 3, label: '3 - Tension evident in some facial muscles' },
      { value: 4, label: '4 - Tension evident throughout facial muscles' },
      { value: 5, label: '5 - Facial muscles contorted and grimacing' }
    ]
  },
  { id: 'isVentilated', label: 'Patient is Ventilated', unit: '', type: 'checkbox' }
];

// PIM-3 form fields
const PIM3Fields = [
  { id: 'systolicBP', label: 'Systolic Blood Pressure', unit: 'mmHg', type: 'number',
    help: 'Enter 0 for cardiac arrest preceding ICU admission, or negative value for shock with immeasurable BP' },
  { id: 'pupillaryReaction', label: 'Pupillary Reactions', unit: '', type: 'select', 
    options: [
      { value: 'both_reactive', label: 'Both reactive' },
      { value: 'one_fixed', label: 'One fixed' },
      { value: 'both_fixed', label: 'Both fixed' }
    ]
  },
  { id: 'fio2', label: 'FiO₂', unit: '', type: 'number', step: 0.01, min: 0.21, max: 1.0 },
  { id: 'pao2', label: 'PaO₂', unit: 'mmHg', type: 'number' },
  { id: 'baseExcess', label: 'Base Excess', unit: 'mmol/L', type: 'number', step: 0.1 },
  { id: 'isVentilated', label: 'Mechanical Ventilation', unit: '', type: 'checkbox' },
  { id: 'isElectiveAdmission', label: 'Elective Admission', unit: '', type: 'checkbox' },
  { id: 'isRecoveryFromSurgery', label: 'Recovery from Surgery', unit: '', type: 'checkbox' },
  { id: 'isCardiacBypass', label: 'Cardiac Bypass', unit: '', type: 'checkbox' },
  { id: 'highRiskDiagnosis', label: 'High-Risk Diagnosis', unit: '', type: 'select', 
    options: [
      { value: 'none', label: 'None' },
      { value: 'cardiac_arrest', label: 'Cardiac arrest preceding ICU admission' },
      { value: 'severe_combined_immune_deficiency', label: 'Severe combined immune deficiency' },
      { value: 'leukemia_lymphoma_after_first_induction', label: 'Leukemia or lymphoma after first induction' },
      { value: 'liver_failure', label: 'Liver failure' },
      { value: 'neurodegenerative_disorder', label: 'Neurodegenerative disorder' },
      { value: 'necrotizing_enterocolitis', label: 'Necrotizing enterocolitis' },
      { value: 'spontaneous_cerebral_hemorrhage', label: 'Spontaneous cerebral hemorrhage' },
      { value: 'cardiomyopathy_myocarditis', label: 'Cardiomyopathy or myocarditis' },
      { value: 'hypoplastic_left_heart_syndrome', label: 'Hypoplastic left heart syndrome' },
      { value: 'hiv_infection', label: 'HIV infection' },
      { value: 'icd_or_pacemaker_during_admission', label: 'ICD or pacemaker during this admission' },
      { value: 'liver_transplant', label: 'Liver transplant' },
      { value: 'bone_marrow_transplant_recipient', label: 'Bone marrow transplant recipient' }
    ]
  },
  { id: 'lowRiskDiagnosis', label: 'Low-Risk Diagnosis', unit: '', type: 'select', 
    options: [
      { value: 'none', label: 'None' },
      { value: 'asthma', label: 'Asthma' },
      { value: 'bronchiolitis', label: 'Bronchiolitis' },
      { value: 'croup', label: 'Croup' },
      { value: 'obstructive_sleep_apnea', label: 'Obstructive sleep apnea' },
      { value: 'diabetic_ketoacidosis', label: 'Diabetic ketoacidosis' },
      { value: 'seizure_disorder', label: 'Seizure disorder' }
    ]
  }
];

// PELOD-2 form fields
const PELOD2Fields = [
  { id: 'gcs', label: 'Glasgow Coma Scale', unit: '', type: 'number', min: 3, max: 15 },
  { id: 'pupillaryReaction', label: 'Pupillary Reaction', unit: '', type: 'select', 
    options: [
      { value: 'both_reactive', label: 'Both reactive' },
      { value: 'both_fixed', label: 'Both fixed' }
    ]
  },
  { id: 'lactatemia', label: 'Lactatemia', unit: 'mmol/L', type: 'number', step: 0.1 },
  { id: 'map', label: 'Mean Arterial Pressure', unit: 'mmHg', type: 'number' },
  { id: 'creatinine', label: 'Creatinine', unit: 'μmol/L', type: 'number' },
  { id: 'pao2fio2', label: 'PaO₂/FiO₂ Ratio', unit: 'mmHg', type: 'number' },
  { id: 'paco2', label: 'PaCO₂', unit: 'mmHg', type: 'number' },
  { id: 'isVentilated', label: 'Mechanical Ventilation', unit: '', type: 'checkbox' },
  { id: 'wbc', label: 'White Blood Cells', unit: '×10³/μL', type: 'number', step: 0.1 },
  { id: 'platelets', label: 'Platelets', unit: '×10³/μL', type: 'number' }
];

const ScoreInputForm = () => {
  const { scoreType } = useParams();
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [errors, setErrors] = useState({});
  
  // Find the selected scoring system
  const selectedSystem = scoringSystems.find(system => system.id === scoreType);
  
  // Get the appropriate form fields based on score type
  const getFormFields = () => {
    switch(scoreType) {
      case 'prism3':
        return PRISM3Fields;
      case 'sofa':
        return SOFAFields;
      case 'comfortb':
        return COMFORTBFields;
      case 'pim3':
        return PIM3Fields;
      case 'pelod2':
        return PELOD2Fields;
      default:
        return [];
    }
  };
  
  const formFields = getFormFields();
  
  // Calculate items per page based on form fields length
  const itemsPerPage = Math.ceil(formFields.length / 3);
  
  // Get current page fields
  const getCurrentPageFields = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, formFields.length);
    return formFields.slice(startIndex, endIndex);
  };
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    
    // Handle different input types
    const inputValue = type === 'checkbox' ? checked : value;
    
    setFormValues({
      ...formValues,
      [id]: type === 'number' ? (value === '' ? '' : parseFloat(value)) : inputValue
    });
    
    // Clear error for this field if it exists
    if (errors[id]) {
      setErrors({
        ...errors,
        [id]: null
      });
    }
  };
  
  // Handle radio button changes
  const handleRadioChange = (id, value) => {
    setFormValues({
      ...formValues,
      [id]: parseInt(value)
    });
    
    // Clear error for this field if it exists
    if (errors[id]) {
      setErrors({
        ...errors,
        [id]: null
      });
    }
  };
  
  // Validate form before submission
  const validateForm = () => {
    const newErrors = {};
    const requiredFields = getCurrentPageFields().filter(field => field.required);
    
    requiredFields.forEach(field => {
      if (!formValues[field.id]) {
        newErrors[field.id] = `${field.label} is required`;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle next page
  const handleNextPage = () => {
    if (validateForm()) {
      if (currentPage < Math.ceil(formFields.length / itemsPerPage)) {
        setCurrentPage(currentPage + 1);
      } else {
        handleSubmit();
      }
    }
  };
  
  // Handle previous page
  const handlePrevPage = () => {
    setCurrentPage(currentPage - 1);
  };
  
  // Handle form submission
  const handleSubmit = () => {
    if (validateForm()) {
      // In a real app, we would process the form data here
      // For the prototype, we'll just navigate to a mock result page
      navigate(`/patients/demo/results/new`, { state: { scoreType, formValues } });
    }
  };
  
  // Render form field based on type
  const renderFormField = (field) => {
    const { id, label, unit, type, options, min, max, step, help } = field;
    const value = formValues[id] !== undefined ? formValues[id] : '';
    const error = errors[id];
    
    switch(type) {
      case 'number':
        return (
          <div key={id} className="mb-4">
            <label htmlFor={id} className="block text-gray-700 mb-2">
              {label} {unit && <span className="text-gray-500">({unit})</span>}
            </label>
            <div className="flex items-center">
              <input 
                type="number" 
                id={id}
                value={value}
                onChange={handleInputChange}
                min={min}
                max={max}
                step={step || 1}
                className={`border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-500' : ''}`}
                placeholder={`Enter ${label.toLowerCase()}`}
              />
              {unit && <span className="ml-2 text-gray-600">{unit}</span>}
            </div>
            {help && <p className="text-xs text-gray-500 mt-1">{help}</p>}
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>
        );
        
      case 'select':
        return (
          <div key={id} className="mb-4">
            <label htmlFor={id} className="block text-gray-700 mb-2">
              {label}
            </label>
            <select 
              id={id}
              value={value}
              onChange={handleInputChange}
              className={`border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-500' : ''}`}
            >
              <option value="">Select an option</option>
              {options.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>
        );
        
      case 'checkbox':
        return (
          <div key={id} className="mb-4">
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id={id}
                checked={value || false}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor={id} className="ml-2 block text-gray-700">
                {label}
              </label>
            </div>
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>
        );
        
      case 'radio':
        return (
          <div key={id} className="mb-4">
            <label className="block text-gray-700 mb-2">
              {label}
            </label>
            <div className="space-y-2">
              {options.map((option) => (
                <div key={option.value} className="flex items-center">
                  <input 
                    type="radio" 
                    id={`${id}_${option.value}`}
                    name={id}
                    value={option.value}
                    checked={value === option.value}
                    onChange={() => handleRadioChange(id, option.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor={`${id}_${option.value}`} className="ml-2 block text-gray-700">
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">{selectedSystem?.name} Score Calculator</h2>
      
      <form>
        <div className="space-y-4">
          {getCurrentPageFields().map(renderFormField)}
        </div>
        
        <div className="mt-8 flex justify-between">
          {currentPage > 1 ? (
            <button 
              type="button"
              onClick={handlePrevPage}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
            >
              Previous
            </button>
          ) : (
            <div></div>
          )}
          
          <button 
            type="button"
            onClick={handleNextPage}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            {currentPage < Math.ceil(formFields.length / itemsPerPage) ? 'Next' : 'Calculate Score'}
          </button>
        </div>
      </form>
      
      <div className="mt-4 flex justify-center">
        <p className="text-sm text-gray-500">
          Page {currentPage} of {Math.ceil(formFields.length / itemsPerPage)}
        </p>
      </div>
    </div>
  );
};

export default ScoreInputForm;
