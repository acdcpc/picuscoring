import React, { useEffect } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../firebase.js';
import { calculatePRISM3Score } from '../../utils/prism3Calculator.js';
import { calculatePELOD2Score } from '../../utils/pelod2Calculator.js';
import { calculatePSOFAScore } from '../../utils/pSofaCalculator.js';
import { calculatePIM3Score } from '../../utils/pim3Calculator.js';
import { calculateCOMFORTBScore } from '../../utils/comfortBCalculator.js';
import { calculateSOSPDScore } from '../../utils/sospdCalculator.js';
import { calculatePhoenixScore } from '../../utils/phoenixCalculator.js';

// Map app age categories to PRISM-3 age categories
const mapAgeCategory = (appAgeCategory) => {
  switch (appAgeCategory) {
    case '<1 month':
      return 'neonate';
    case '1 to 11 months':
    case '1 to <2 years':
      return 'infant';
    case '2 to <5 years':
    case '5 to <12 years':
      return 'child';
    case '12 to 17 years':
      return 'adolescent';
    default:
      return 'child'; // Default to child if unknown
  }
};

// Derive age in months from age category
const getAgeInMonths = (ageCategory) => {
  switch (ageCategory) {
    case '<1 month':
      return 0.5; // Approximate as 2 weeks
    case '1 to 11 months':
      return 6; // Approximate as 6 months
    case '1 to <2 years':
      return 18; // Approximate as 1.5 years
    case '2 to <5 years':
      return 42; // Approximate as 3.5 years
    case '5 to <12 years':
      return 102; // Approximate as 8.5 years
    case '12 to 17 years':
      return 174; // Approximate as 14.5 years
    default:
      return 102; // Default to 8.5 years
  }
};

// Define fields for validation
const scoreFields = {
  prism3: [
    'gcs', 'systolicBP', 'heartRate', 'temperature', 'pao2', 'paco2',
    'glucose', 'potassium', 'creatinine', 'wbc', 'platelets', 'ph'
  ],
  pelod2: [
    'gcs', 'pupillaryReaction', 'lactate', 'pao2_fio2', 'paco2',
    'invasiveVentilation', 'creatinine', 'wbc', 'platelets'
  ],
  psofa: [
    'pao2', 'spo2', 'fio2', 'oxygenMeasurement', 'mechanicalVentilation',
    'platelets', 'bilirubin', 'meanArterialPressure', 'dopamine', 'dobutamine',
    'epinephrine', 'norepinephrine', 'glasgowComaScore', 'creatinine'
  ],
  pim3: [
    'systolicBP', 'pao2', 'fio2', 'baseExcess', 'pupillaryReaction',
    'mechanicalVentilation'
  ],
  comfortb: [
    'alertness', 'calmness', 'respiratory', 'isVentilated', 'movement',
    'muscleTone', 'facialTension'
  ],
  sospd: [
    'respiratoryRate', 'spo2', 'fio2', 'oxygenTherapy'
  ],
  phoenix: [
    'temperature', 'heartRate', 'respiratoryRate', 'systolicBP', 'consciousness',
    'wbc', 'skinPerfusion', 'spo2', 'systemicInfection'
  ],
};

const ScoreCalculator = ({ scoreType, patientData, inputValues, setCalculatedScore }) => {
  useEffect(() => {
    // Only calculate if scoreType is valid and inputValues has data
    if (scoreType && Object.keys(inputValues).length > 0) {
      const calculateScore = async () => {
        let result = null;
        try {
          // Log patientData and inputValues for debugging
          console.log('ScoreCalculator patientData:', patientData);
          console.log('ScoreCalculator inputValues:', inputValues);

          // Check if patientData exists
          if (!patientData) {
            setCalculatedScore({ error: 'Patient data is missing' });
            return;
          }

          // Use default ageCategory if missing
          const effectiveAgeCategory = patientData.ageCategory || '5 to <12 years';
          const mappedAgeCategory = mapAgeCategory(effectiveAgeCategory);
          const ageInMonths = patientData.ageInMonths || getAgeInMonths(effectiveAgeCategory);

          // Validate required fields
          const requiredFields = scoreFields[scoreType] || [];
          const missingFields = requiredFields.filter(
            field => inputValues[field] === undefined || inputValues[field] === ''
          );
          if (missingFields.length > 0) {
            throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
          }

          switch (scoreType) {
            case 'prism3':
              result = calculatePRISM3Score(inputValues, mappedAgeCategory);
              break;
            case 'pelod2':
              result = calculatePELOD2Score(inputValues, ageInMonths);
              break;
            case 'psofa':
              result = calculatePSOFAScore({ ...inputValues, ageCategory: effectiveAgeCategory });
              break;
            case 'pim3':
              result = calculatePIM3Score(inputValues);
              break;
            case 'comfortb':
              result = calculateCOMFORTBScore(inputValues);
              break;
            case 'sospd':
              result = calculateSOSPDScore(inputValues);
              break;
            case 'phoenix':
              result = calculatePhoenixScore({ ...inputValues, ageCategory: effectiveAgeCategory });
              break;
            default:
              throw new Error('Unknown score type');
          }

          // Save to Firestore
          const assessmentData = {
            patientId: patientData.id || 'unknown',
            scoreType,
            calculatedScore: result,
            date: new Date().toISOString().split('T')[0],
            time: new Date().toISOString().split('T')[1].split('.')[0],
          };
          await addDoc(collection(db, 'assessments'), assessmentData);

          setCalculatedScore(result);
        } catch (error) {
          console.error('Error calculating score:', error);
          setCalculatedScore({ error: error.message });
        }
      };

      calculateScore();
    }
  }, [scoreType, patientData, inputValues, setCalculatedScore]);

  return null;
};

export default ScoreCalculator;