import React, { useEffect } from 'react';
import { db, auth } from '../../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { calculatePrism3Score } from '../../utils/prism3Calculator';
import { calculatePelod2Score } from '../../utils/pelod2Calculator';
import { calculatePsofaScore } from '../../utils/pSofaCalculator';
import { calculatePim3Score } from '../../utils/pim3Calculator';
import { calculateComfortBScore } from '../../utils/comfortBCalculator';
import { calculateSospdScore } from '../../utils/sospdCalculator';
import { calculatePhoenixScore } from '../../utils/phoenixCalculator';

const ScoreCalculator = ({ scoreType, patientData, inputValues, setCalculatedScore }) => {
  console.log('ScoreCalculator patientData:', patientData);
  console.log('ScoreCalculator inputValues:', inputValues);

  useEffect(() => {
    const calculateScore = async () => {
      if (!scoreType || !patientData || !inputValues) {
        setCalculatedScore({ error: 'Missing required inputs' });
        return;
      }

      try {
        let result;
        const calculatorMap = {
          prism3: calculatePrism3Score,
          pelod2: calculatePelod2Score,
          psofa: calculatePsofaScore,
          pim3: calculatePim3Score,
          comfortb: calculateComfortBScore,
          sospd: calculateSospdScore,
          phoenix: calculatePhoenixScore,
        };

        const calculator = calculatorMap[scoreType];
        if (!calculator) {
          setCalculatedScore({ error: 'Invalid score type' });
          return;
        }

        result = calculator({ ...inputValues, ageCategory: patientData.ageCategory });

        // Save to Firestore
        const user = auth.currentUser;
        if (user) {
          const assessmentId = `${patientData.id}_${scoreType}_${Date.now()}`;
          await setDoc(doc(db, 'assessments', assessmentId), {
            patientId: patientData.id,
            scoreType,
            score: result.totalScore || 0,
            details: result,
            timestamp: new Date(),
            userId: user.uid,
          });
        }

        setCalculatedScore(result);
      } catch (error) {
        console.error('Score calculation error:', error);
        setCalculatedScore({ error: error.message });
      }
    };

    calculateScore();
  }, [scoreType, patientData, inputValues, setCalculatedScore]);

  return null;
};

export default ScoreCalculator;