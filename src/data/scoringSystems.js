/**
 * Scoring Systems Data
 * This file contains the metadata for all pediatric ICU scoring systems
 * implemented in the application.
 */

export const scoringSystems = [
  {
    id: 'prism3',
    name: 'PRISM-III',
    fullName: 'Pediatric Risk of Mortality III',
    description: 'Evaluates mortality risk in pediatric intensive care units based on physiological variables.',
    purpose: 'Mortality risk prediction',
    ageGroups: [
      { id: 'neonate', name: 'Neonate', range: '0-30 days' },
      { id: 'infant', name: 'Infant', range: '31 days - 2 years' },
      { id: 'child', name: 'Child', range: '2 years - 12 years' },
      { id: 'adolescent', name: 'Adolescent', range: '13 years and up' }
    ],
    timeframe: 'First 4 hours of PICU care, with laboratory variables from 2 hours before admission through first 4 hours',
    components: [
      'Systolic blood pressure',
      'Heart Rate',
      'Temperature',
      'Mental Status (GCS)',
      'Pupillary reflexes',
      'pH',
      'PCO2',
      'Total CO2',
      'PaO2',
      'Glucose',
      'Potassium',
      'Creatinine',
      'Urea',
      'White blood cells',
      'PT/PTT',
      'Platelets'
    ]
  },
  {
    id: 'sofa',
    name: 'SOFA',
    fullName: 'Sequential Organ Failure Assessment',
    description: 'Assesses the extent of organ dysfunction or failure in critically ill patients.',
    purpose: 'Organ dysfunction assessment',
    ageGroups: [
      { id: 'pediatric', name: 'Pediatric', range: 'Age-adjusted parameters for pediatric patients' }
    ],
    timeframe: 'Can be calculated daily to track changes over time',
    components: [
      'Respiratory system (PaO2/FiO2)',
      'Coagulation (Platelets)',
      'Liver (Bilirubin)',
      'Cardiovascular (MAP, vasopressors)',
      'Central nervous system (GCS)',
      'Renal (Creatinine, urine output)'
    ]
  },
  {
    id: 'comfortb',
    name: 'COMFORT-B',
    fullName: 'COMFORT Behavioral Scale',
    description: 'Non-intrusive behavioral scoring system for assessing distress, pain, and sedation levels.',
    purpose: 'Sedation assessment',
    ageGroups: [
      { id: 'pediatric', name: 'Pediatric', range: '0-18 years' }
    ],
    timeframe: '2-minute observation period',
    components: [
      'Alertness',
      'Calmness/Agitation',
      'Respiratory response',
      'Physical movement',
      'Muscle tone',
      'Facial tension'
    ]
  },
  {
    id: 'pim3',
    name: 'PIM-3',
    fullName: 'Pediatric Index of Mortality 3',
    description: 'Predicts mortality risk at the time of PICU admission.',
    purpose: 'Admission mortality risk prediction',
    ageGroups: [
      { id: 'pediatric', name: 'Pediatric', range: 'All pediatric ages' }
    ],
    timeframe: 'At the time of PICU admission',
    components: [
      'Systolic blood pressure',
      'Pupillary reactions',
      'FiO2/PaO2 ratio',
      'Base excess',
      'Mechanical ventilation status',
      'Elective admission',
      'Recovery from surgery',
      'Cardiac bypass',
      'High-risk diagnosis',
      'Low-risk diagnosis'
    ]
  },
  {
    id: 'pelod2',
    name: 'PELOD-2',
    fullName: 'Pediatric Logistic Organ Dysfunction 2',
    description: 'Assesses the severity of multiple organ dysfunction syndrome in critically ill children.',
    purpose: 'Organ dysfunction severity assessment',
    ageGroups: [
      { id: 'pediatric', name: 'Pediatric', range: 'Age-adjusted parameters for pediatric patients' }
    ],
    timeframe: 'Can be calculated daily to monitor changes in patient condition',
    components: [
      'Neurological system (GCS, pupillary reaction)',
      'Cardiovascular system (Lactatemia, MAP)',
      'Renal system (Creatinine)',
      'Respiratory system (PaO2/FiO2, PaCO2, ventilation)',
      'Hematological system (WBC, platelets)'
    ]
  }
];

export default scoringSystems;
