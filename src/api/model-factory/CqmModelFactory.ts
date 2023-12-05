import {
  DataElement,
  PatientEntity,
  CarePartner,
  RelatedPerson,
  Practitioner,
  Organization,
  Location,
  PhysicalExamOrder,
  Participation,
  PatientCharacteristicSex,
  CareGoal,
  PatientCharacteristic,
  PatientCharacteristicEthnicity,
  PatientCharacteristicRace,
  LaboratoryTestPerformed,
  Symptom,
  MedicationAdministered,
  ProcedureRecommended,
  Diagnosis,
  CommunicationPerformed,
  AssessmentPerformed,
  PatientCharacteristicClinicalTrialParticipant,
  DeviceOrder,
  DiagnosticStudyPerformed,
  InterventionOrder,
  FamilyHistory,
  MedicationActive,
  LaboratoryTestOrder,
  DiagnosticStudyOrder,
  SubstanceOrder,
  PatientCharacteristicPayer,
  PatientCharacteristicExpired,
  AssessmentOrder,
  AssessmentRecommended,
  ImmunizationAdministered,
  SubstanceAdministered,
  EncounterPerformed,
  EncounterOrder,
  EncounterRecommended,
  ProcedurePerformed,
  AllergyIntolerance,
  PhysicalExamRecommended,
  PatientCharacteristicBirthdate,
  AdverseEvent,
  DeviceRecommended,
  MedicationDischarge,
  InterventionPerformed,
  LaboratoryTestRecommended,
  MedicationDispensed,
  DiagnosticStudyRecommended,
  ImmunizationOrder,
  PatientCareExperience,
  ProviderCareExperience,
  ProcedureOrder,
  MedicationOrder,
  SubstanceRecommended,
  InterventionRecommended,
  PhysicalExamPerformed,
  Observation,
} from "cqm-models";

export class CqmModelFactory {
  static instantiateModel(modelName: string): DataElement {
    // TODO: any other better way to instantiate these?
    switch (modelName) {
      case "PatientEntity":
        return new PatientEntity();
      case "CarePartner":
        return new CarePartner();
      case "RelatedPerson":
        return new RelatedPerson();
      case "Practitioner":
        return new Practitioner();
      case "Organization":
        return new Organization();
      case "Location":
        return new Location();
      case "PhysicalExamOrder":
        return new PhysicalExamOrder();
      case "Participation":
        return new Participation();
      case "PatientCharacteristicSex":
        return new PatientCharacteristicSex();
      case "CareGoal":
        return new CareGoal();
      case "PatientCharacteristic":
        return new PatientCharacteristic();
      case "PatientCharacteristicEthnicity":
        return new PatientCharacteristicEthnicity();
      case "PatientCharacteristicRace":
        return new PatientCharacteristicRace();
      case "LaboratoryTestPerformed":
        return new LaboratoryTestPerformed();
      case "Symptom":
        return new Symptom();
      case "MedicationAdministered":
        return new MedicationAdministered();
      case "ProcedureRecommended":
        return new ProcedureRecommended();
      case "Diagnosis":
        return new Diagnosis();
      case "CommunicationPerformed":
        return new CommunicationPerformed();
      case "AssessmentPerformed":
        return new AssessmentPerformed();
      case "PatientCharacteristicClinicalTrialParticipant":
        return new PatientCharacteristicClinicalTrialParticipant();
      case "DeviceOrder":
        return new DeviceOrder();
      case "DiagnosticStudyPerformed":
        return new DiagnosticStudyPerformed();
      case "InterventionOrder":
        return new InterventionOrder();
      case "FamilyHistory":
        return new FamilyHistory();
      case "MedicationActive":
        return new MedicationActive();
      case "LaboratoryTestOrder":
        return new LaboratoryTestOrder();
      case "DiagnosticStudyOrder":
        return new DiagnosticStudyOrder();
      case "SubstanceOrder":
        return new SubstanceOrder();
      case "PatientCharacteristicPayer":
        return new PatientCharacteristicPayer();
      case "PatientCharacteristicExpired":
        return new PatientCharacteristicExpired();
      case "AssessmentOrder":
        return new AssessmentOrder();
      case "AssessmentRecommended":
        return new AssessmentRecommended();
      case "ImmunizationAdministered":
        return new ImmunizationAdministered();
      case "SubstanceAdministered":
        return new SubstanceAdministered();
      case "EncounterPerformed":
        return new EncounterPerformed();
      case "EncounterOrder":
        return new EncounterOrder();
      case "EncounterRecommended":
        return new EncounterRecommended();
      case "ProcedurePerformed":
        return new ProcedurePerformed();
      case "Allergy/Intolerance":
        return new AllergyIntolerance();
      case "PhysicalExamRecommended":
        return new PhysicalExamRecommended();
      case "PatientCharacteristicBirthdate":
        return new PatientCharacteristicBirthdate();
      case "AdverseEvent":
        return new AdverseEvent();
      case "DeviceRecommended":
        return new DeviceRecommended();
      case "MedicationDischarge":
        return new MedicationDischarge();
      case "InterventionPerformed":
        return new InterventionPerformed();
      case "LaboratoryTestRecommended":
        return new LaboratoryTestRecommended();
      case "MedicationDispensed":
        return new MedicationDispensed();
      case "DiagnosticStudyRecommended":
        return new DiagnosticStudyRecommended();
      case "ImmunizationOrder":
        return new ImmunizationOrder();
      case "PatientCareExperience":
        return new PatientCareExperience();
      case "ProviderCareExperience":
        return new ProviderCareExperience();
      case "ProcedureOrder":
        return new ProcedureOrder();
      case "MedicationOrder":
        return new MedicationOrder();
      case "SubstanceRecommended":
        return new SubstanceRecommended();
      case "InterventionRecommended":
        return new InterventionRecommended();
      case "PhysicalExamPerformed":
        return new PhysicalExamPerformed();
      case "CommunicationNotPerformed":
        return new CommunicationPerformed();
      case "Observation":
        return new Observation();
      default:
        console.error(`Unsupported data type: ${modelName}`);
        throw new Error(`Unsupported data type: ${modelName}`);
    }
  }
}
