import React, { useEffect, useState } from 'react';
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

const ScoreCalculator = ({ scoreType, patientData, inputValues }) => {
  const [calculatedScore, setCalculatedScore] = useState(null); // Local state for calculatedScore

  useEffect(() => {
    const calculateScore = async () => {
      let result = null;
      try {
        // Map the age category for scores that need it
        const mappedAgeCategory = mapAgeCategory(patientData.ageCategory);
        const ageInMonths = patientData.ageInMonths || getAgeInMonths(patientData.ageCategory);

        switch (scoreType) {
          case 'prism3':
            result = calculatePRISM3Score(inputValues, mappedAgeCategory);
            break;
          case 'pelod2':
            result = calculatePELOD2Score(inputValues, ageInMonths);
            break;
          case 'psofa':
            result = calculatePSOFAScore({ ...inputValues, ageCategory: patientData.ageCategory });
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
            result = calculatePhoenixScore({ ...inputValues, ageCategory: patientData.ageCategory });
            break;
          default:
            throw new Error('Unknown score type');
        }

        // Save to Firestore
        const assessmentData = {
          patientId: patientData.id,
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

    if (scoreType) {
      calculateScore();
    }
  }, [scoreType, patientData, inputValues]);

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-medium mb-2">Score Result</h3>
      {calculatedScore ? (
        calculatedScore.error ? (
          <p className="text-red-600">Error: {calculatedScore.error}</p>
        ) : (
          <div>
            <p className="text-gray-700">
              Total Score: {calculatedScore.totalScore || 'N/A'}
            </p>
            {calculatedScore.mortalityRisk && (
              <p className="text-gray-700">
                Mortality Risk: {calculatedScore.mortalityRisk}%
              </p>
            )}
            {calculatedScore.deliriumPresent !== undefined && (
              <p className="text-gray-700">
                Delirium Present: {calculatedScore.deliriumPresent ? 'Yes' : 'No'}
              </p>
            )}
          </div>
        )
      ) : (
        <p className="text-gray-600">Calculating...</p>
      )}
    </div>
  );
};

export default ScoreCalculator;