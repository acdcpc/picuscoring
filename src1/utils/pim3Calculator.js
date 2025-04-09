/**
 * PIM-3 Score Calculator
 * 
 * This module implements the Pediatric Index of Mortality 3 (PIM-3) scoring system
 * for predicting mortality risk at the time of PICU admission.
 * 
 * Based on research from:
 * - Straney L, et al. Paediatric Index of Mortality 3: An updated model for predicting mortality in pediatric intensive care.
 */

/**
 * Calculate PIM-3 score based on admission variables
 * 
 * @param {Object} params - Admission parameters
 * @returns {Object} - Calculated score and risk assessment
 */
export const calculatePIM3Score = (params) => {
  // Calculate the logit (log odds) using the PIM-3 equation
  const logit = calculateLogit(params);
  
  // Convert logit to probability of death
  const probability = calculateProbability(logit);
  
  // Calculate percentage risk
  const mortalityRisk = (probability * 100).toFixed(1);
  
  // Determine risk category
  const riskCategory = getRiskCategory(mortalityRisk);
  
  return {
    logit,
    probability,
    mortalityRisk,
    riskCategory
  };
};

/**
 * Calculate the logit (log odds) using the PIM-3 equation
 */
const calculateLogit = (params) => {
  // Extract parameters with default values if not provided
  const {
    systolicBP = 120,
    pupillaryReaction = 'both_reactive',
    fio2 = 0.21,
    pao2 = 80,
    baseExcess = 0,
    isVentilated = false,
    isElectiveAdmission = true,
    isRecoveryFromSurgery = false,
    isCardiacBypass = false,
    highRiskDiagnosis = 'none',
    lowRiskDiagnosis = 'none'
  } = params;
  
  // Constants for PIM-3 equation (simplified for prototype)
  const INTERCEPT = -3.8233;
  
  // Calculate components
  let logit = INTERCEPT;
  
  // Systolic blood pressure component
  if (systolicBP === 0) {
    logit += 3.8233; // Cardiac arrest preceding ICU admission
  } else if (systolicBP < 0) {
    logit += 0.9763; // Shock with immeasurable BP
  }
  
  // Pupillary reaction component
  if (pupillaryReaction === 'both_fixed') {
    logit += 3.0042;
  } else if (pupillaryReaction === 'one_fixed') {
    logit += 1.5023;
  }
  
  // FiO2*100/PaO2 component (only if ventilated)
  if (isVentilated && fio2 > 0 && pao2 > 0) {
    const fio2Ratio = (fio2 * 100) / pao2;
    logit += 0.2888 * fio2Ratio;
  }
  
  // Base excess component
  logit += 0.104 * Math.abs(baseExcess);
  
  // Mechanical ventilation component
  if (isVentilated) {
    logit += 0.8233;
  }
  
  // Elective admission component
  if (isElectiveAdmission) {
    logit -= 0.9186;
  }
  
  // Recovery from surgery component
  if (isRecoveryFromSurgery) {
    logit -= 0.4214;
  }
  
  // Cardiac bypass component
  if (isCardiacBypass) {
    logit -= 1.2246;
  }
  
  // High-risk diagnosis component
  if (highRiskDiagnosis !== 'none') {
    switch (highRiskDiagnosis) {
      case 'cardiac_arrest':
        logit += 1.3352;
        break;
      case 'severe_combined_immune_deficiency':
        logit += 1.6524;
        break;
      case 'leukemia_lymphoma_after_first_induction':
        logit += 1.5573;
        break;
      case 'liver_failure':
        logit += 1.3622;
        break;
      case 'neurodegenerative_disorder':
        logit += 2.0986;
        break;
      case 'necrotizing_enterocolitis':
        logit += 1.5164;
        break;
      case 'spontaneous_cerebral_hemorrhage':
        logit += 2.3195;
        break;
      case 'cardiomyopathy_myocarditis':
        logit += 1.1246;
        break;
      case 'hypoplastic_left_heart_syndrome':
        logit += 1.4376;
        break;
      case 'hiv_infection':
        logit += 1.3579;
        break;
      case 'icd_or_pacemaker_during_admission':
        logit += 1.6138;
        break;
      case 'liver_transplant':
        logit += 1.4214;
        break;
      case 'bone_marrow_transplant_recipient':
        logit += 1.2943;
        break;
      default:
        break;
    }
  }
  
  // Low-risk diagnosis component
  if (lowRiskDiagnosis !== 'none') {
    switch (lowRiskDiagnosis) {
      case 'asthma':
        logit -= 1.5164;
        break;
      case 'bronchiolitis':
        logit -= 1.2578;
        break;
      case 'croup':
        logit -= 1.9684;
        break;
      case 'obstructive_sleep_apnea':
        logit -= 1.4214;
        break;
      case 'diabetic_ketoacidosis':
        logit -= 1.1246;
        break;
      case 'seizure_disorder':
        logit -= 1.0725;
        break;
      default:
        break;
    }
  }
  
  return logit;
};

/**
 * Convert logit to probability using the logistic function
 */
const calculateProbability = (logit) => {
  return Math.exp(logit) / (1 + Math.exp(logit));
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

/**
 * High-risk diagnoses for PIM-3
 */
export const HIGH_RISK_DIAGNOSES = [
  { id: 'none', name: 'None' },
  { id: 'cardiac_arrest', name: 'Cardiac arrest preceding ICU admission' },
  { id: 'severe_combined_immune_deficiency', name: 'Severe combined immune deficiency' },
  { id: 'leukemia_lymphoma_after_first_induction', name: 'Leukemia or lymphoma after first induction' },
  { id: 'liver_failure', name: 'Liver failure' },
  { id: 'neurodegenerative_disorder', name: 'Neurodegenerative disorder' },
  { id: 'necrotizing_enterocolitis', name: 'Necrotizing enterocolitis' },
  { id: 'spontaneous_cerebral_hemorrhage', name: 'Spontaneous cerebral hemorrhage' },
  { id: 'cardiomyopathy_myocarditis', name: 'Cardiomyopathy or myocarditis' },
  { id: 'hypoplastic_left_heart_syndrome', name: 'Hypoplastic left heart syndrome' },
  { id: 'hiv_infection', name: 'HIV infection' },
  { id: 'icd_or_pacemaker_during_admission', name: 'ICD or pacemaker during this admission' },
  { id: 'liver_transplant', name: 'Liver transplant' },
  { id: 'bone_marrow_transplant_recipient', name: 'Bone marrow transplant recipient' }
];

/**
 * Low-risk diagnoses for PIM-3
 */
export const LOW_RISK_DIAGNOSES = [
  { id: 'none', name: 'None' },
  { id: 'asthma', name: 'Asthma' },
  { id: 'bronchiolitis', name: 'Bronchiolitis' },
  { id: 'croup', name: 'Croup' },
  { id: 'obstructive_sleep_apnea', name: 'Obstructive sleep apnea' },
  { id: 'diabetic_ketoacidosis', name: 'Diabetic ketoacidosis' },
  { id: 'seizure_disorder', name: 'Seizure disorder' }
];

export default calculatePIM3Score;
