/**
 * PRISM-3 Score Calculator
 * 
 * This module implements the Pediatric Risk of Mortality III (PRISM-III) scoring system
 * for predicting mortality risk in pediatric intensive care units.
 * 
 * Based on research from:
 * - Pollack MM, Dean JM, Butler J, et al: The ideal time interval for critical care 
 *   severity-of-illness assessment. Pediatric Critical Care Med 2013; 14:448-453
 */

// Age categories
const AGE_CATEGORIES = {
  NEONATE: 'neonate', // 0-30 days
  INFANT: 'infant',   // 31 days - 2 years
  CHILD: 'child',     // 2 years - 12 years
  ADOLESCENT: 'adolescent' // 13 years and up
};

/**
 * Calculate PRISM-3 score based on physiological variables
 * 
 * @param {Object} inputValues - Physiological parameters including ageCategory
 * @returns {Object} - Calculated scores and risk assessment
 */
export const calculatePrism3Score = (inputValues) => {
  if (!inputValues || typeof inputValues !== 'object') {
    throw new Error('Invalid input: inputValues must be an object');
  }

  const ageCategory = inputValues.ageCategory || 'child'; // Default to 'child' if not provided
  let neurologicScore = 0;
  let nonNeurologicScore = 0;
  
  // Calculate Neurologic Score
  neurologicScore += calculateGCSScore(inputValues.gcs);
  neurologicScore += calculatePupillaryReflexScore(inputValues.pupillaryReflexes);
  
  // Calculate Non-Neurologic Score
  nonNeurologicScore += calculateSystolicBPScore(inputValues.systolicBP, ageCategory);
  nonNeurologicScore += calculateHeartRateScore(inputValues.heartRate, ageCategory);
  nonNeurologicScore += calculateTemperatureScore(inputValues.temperature);
  nonNeurologicScore += calculateAcidosisScore(inputValues.pH, inputValues.totalCO2);
  nonNeurologicScore += calculatePaO2Score(inputValues.paO2);
  nonNeurologicScore += calculatePCO2Score(inputValues.pCO2);
  nonNeurologicScore += calculateGlucoseScore(inputValues.glucose);
  nonNeurologicScore += calculatePotassiumScore(inputValues.potassium);
  nonNeurologicScore += calculateCreatinineScore(inputValues.creatinine, ageCategory);
  nonNeurologicScore += calculateUreaScore(inputValues.urea);
  nonNeurologicScore += calculateWBCScore(inputValues.wbc);
  nonNeurologicScore += calculatePTScore(inputValues.pt);
  nonNeurologicScore += calculatePTTScore(inputValues.ptt);
  nonNeurologicScore += calculatePlateletsScore(inputValues.platelets);
  
  const totalScore = neurologicScore + nonNeurologicScore;
  const mortalityRisk = calculateMortalityRisk(totalScore);
  
  return {
    neurologicScore,
    nonNeurologicScore,
    totalScore,
    mortalityRisk,
    riskCategory: getRiskCategory(mortalityRisk)
  };
};

/**
 * Calculate score for Glasgow Coma Scale
 */
const calculateGCSScore = (gcs) => {
  if (!gcs) return 0;
  
  if (gcs < 6) return 4;
  if (gcs >= 6 && gcs <= 9) return 3;
  if (gcs >= 10 && gcs <= 12) return 2;
  if (gcs >= 13 && gcs <= 14) return 1;
  return 0; // GCS = 15
};

/**
 * Calculate score for pupillary reflexes
 */
const calculatePupillaryReflexScore = (pupillaryReflexes) => {
  if (!pupillaryReflexes) return 0;
  
  if (pupillaryReflexes === 'both_fixed') return 4;
  if (pupillaryReflexes === 'one_fixed') return 2;
  return 0; // Both reactive
};

/**
 * Calculate score for systolic blood pressure based on age category
 */
const calculateSystolicBPScore = (systolicBP, ageCategory) => {
  if (!systolicBP) return 0;
  
  switch (ageCategory) {
    case AGE_CATEGORIES.NEONATE:
      if (systolicBP < 40) return 7;
      if (systolicBP >= 40 && systolicBP < 55) return 3;
      if (systolicBP > 130) return 3;
      return 0;
      
    case AGE_CATEGORIES.INFANT:
      if (systolicBP < 45) return 7;
      if (systolicBP >= 45 && systolicBP < 65) return 3;
      if (systolicBP > 150) return 3;
      return 0;
      
    case AGE_CATEGORIES.CHILD:
      if (systolicBP < 55) return 7;
      if (systolicBP >= 55 && systolicBP < 75) return 3;
      if (systolicBP > 170) return 3;
      return 0;
      
    case AGE_CATEGORIES.ADOLESCENT:
      if (systolicBP < 65) return 7;
      if (systolicBP >= 65 && systolicBP < 85) return 3;
      if (systolicBP > 190) return 3;
      return 0;
      
    default:
      return 0;
  }
};

/**
 * Calculate score for heart rate based on age category
 */
const calculateHeartRateScore = (heartRate, ageCategory) => {
  if (!heartRate) return 0;
  
  switch (ageCategory) {
    case AGE_CATEGORIES.NEONATE:
      if (heartRate < 90) return 4;
      if (heartRate > 205) return 4;
      return 0;
      
    case AGE_CATEGORIES.INFANT:
      if (heartRate < 80) return 4;
      if (heartRate > 205) return 4;
      return 0;
      
    case AGE_CATEGORIES.CHILD:
      if (heartRate < 70) return 4;
      if (heartRate > 205) return 4;
      return 0;
      
    case AGE_CATEGORIES.ADOLESCENT:
      if (heartRate < 55) return 4;
      if (heartRate > 205) return 4;
      return 0;
      
    default:
      return 0;
  }
};

/**
 * Calculate score for temperature
 */
const calculateTemperatureScore = (temperature) => {
  if (!temperature) return 0;
  
  if (temperature < 33) return 3;
  if (temperature > 40) return 3;
  return 0;
};

/**
 * Calculate score for acidosis based on pH and total CO2
 */
const calculateAcidosisScore = (pH, totalCO2) => {
  if (!pH && !totalCO2) return 0;
  
  // Check pH
  if (pH) {
    if (pH < 7.0) return 6;
    if (pH >= 7.0 && pH < 7.28) return 2;
    if (pH > 7.55) return 2;
  }
  
  // Check total CO2
  if (totalCO2) {
    if (totalCO2 < 5) return 6;
    if (totalCO2 >= 5 && totalCO2 < 16) return 2;
    if (totalCO2 > 34) return 2;
  }
  
  return 0;
};

/**
 * Calculate score for PaO2
 */
const calculatePaO2Score = (paO2) => {
  if (!paO2) return 0;
  
  if (paO2 < 42) return 6;
  if (paO2 >= 42 && paO2 < 50) return 3;
  return 0;
};

/**
 * Calculate score for PCO2
 */
const calculatePCO2Score = (pCO2) => {
  if (!pCO2) return 0;
  
  if (pCO2 > 75) return 3;
  return 0;
};

/**
 * Calculate score for glucose
 */
const calculateGlucoseScore = (glucose) => {
  if (!glucose) return 0;
  
  if (glucose > 22.2) return 4; // >400 mg/dL
  if (glucose < 2.2) return 4;  // <40 mg/dL
  return 0;
};

/**
 * Calculate score for potassium
 */
const calculatePotassiumScore = (potassium) => {
  if (!potassium) return 0;
  
  if (potassium > 7.8) return 3;
  if (potassium < 2.5) return 3;
  return 0;
};

/**
 * Calculate score for creatinine based on age category
 */
const calculateCreatinineScore = (creatinine, ageCategory) => {
  if (!creatinine) return 0;
  
  switch (ageCategory) {
    case AGE_CATEGORIES.NEONATE:
      if (creatinine > 1.59) return 2; // >1.8 mg/dL
      return 0;
      
    case AGE_CATEGORIES.INFANT:
      if (creatinine > 0.9) return 2; // >1.0 mg/dL
      return 0;
      
    case AGE_CATEGORIES.CHILD:
      if (creatinine > 1.59) return 2; // >1.8 mg/dL
      return 0;
      
    case AGE_CATEGORIES.ADOLESCENT:
      if (creatinine > 1.59) return 2; // >1.8 mg/dL
      return 0;
      
    default:
      return 0;
  }
};

/**
 * Calculate score for urea (BUN)
 */
const calculateUreaScore = (urea) => {
  if (!urea) return 0;
  
  if (urea > 14.3) return 3; // >40 mg/dL
  return 0;
};

/**
 * Calculate score for white blood cell count
 */
const calculateWBCScore = (wbc) => {
  if (!wbc) return 0;
  
  if (wbc < 3.0) return 4;
  return 0;
};

/**
 * Calculate score for prothrombin time (PT)
 */
const calculatePTScore = (pt) => {
  if (!pt) return 0;
  
  if (pt > 22.0) return 3;
  return 0;
};

/**
 * Calculate score for partial thromboplastin time (PTT)
 */
const calculatePTTScore = (ptt) => {
  if (!ptt) return 0;
  
  if (ptt > 57.0) return 3;
  return 0;
};

/**
 * Calculate score for platelets
 */
const calculatePlateletsScore = (platelets) => {
  if (!platelets) return 0;
  
  if (platelets < 50) return 4;
  if (platelets >= 50 && platelets < 100) return 2;
  return 0;
};

/**
 * Calculate mortality risk based on total PRISM-3 score
 * 
 * This is a simplified logistic regression model based on published data
 * For a real application, this would use the actual coefficients from the validated model
 */
const calculateMortalityRisk = (totalScore) => {
  // Simplified logistic regression model
  // ln(odds) = -6.5 + 0.36 * PRISM-3 score
  const logOdds = -6.5 + (0.36 * totalScore);
  const odds = Math.exp(logOdds);
  const probability = odds / (1 + odds);
  
  // Return as percentage with 1 decimal place
  return (probability * 100).toFixed(1);
};

/**
 * Get risk category based on mortality risk percentage
 */
const getRiskCategory = (mortalityRisk) => {
  const risk = parseFloat(mortalityRisk);
  
  if (risk < 1) return 'Low Risk';
  if (risk >= 1 && risk < 5) return 'Moderate Risk';
  if (risk >= 5 && risk < 15) return 'High Risk';
  if (risk >= 15 && risk < 30) return 'Very High Risk';
  return 'Extremely High Risk';
};

export default calculatePrism3Score;