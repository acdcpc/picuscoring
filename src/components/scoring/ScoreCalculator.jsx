import React, { useEffect } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../firebase';
import { calculatePrism3 } from '../../utils/prism3Calculator';
import { calculatePelod2 } from '../../utils/pelod2Calculator';
import { calculatePsofa } from '../../utils/pSofaCalculator'; // Already matches file name
import { calculatePim3 } from '../../utils/pim3Calculator';
import { calculateComfortB } from '../../utils/comfortBCalculator';
import { calculateSospd } from '../../utils/sospdCalculator';
import { calculatePhoenix } from '../../utils/phoenixCalculator';

const ScoreCalculator = ({ scoreType, patientData, inputValues, setCalculatedScore }) => {
  useEffect(() => {
    const calculateScore = async () => {
      let result = null;
      try {
        switch (scoreType) {
          case 'prism3':
            result = calculatePrism3(inputValues);
            break;
          case 'pelod2':
            result = calculatePelod2(inputValues);
            break;
          case 'psofa':
            result = calculatePsofa(inputValues, patientData.ageCategory);
            break;
          case 'pim3':
            result = calculatePim3(inputValues);
            break;
          case 'comfortb':
            result = calculateComfortB(inputValues);
            break;
          case 'sospd':
            result = calculateSospd(inputValues);
            break;
          case 'phoenix':
            result = calculatePhoenix(inputValues, patientData.ageCategory);
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
  }, [scoreType, patientData, inputValues, setCalculatedScore]);

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