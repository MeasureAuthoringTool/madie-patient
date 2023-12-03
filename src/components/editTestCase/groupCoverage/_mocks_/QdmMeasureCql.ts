export const measureCql = `library TestQDM version '0.0.000'

using QDM version '5.6'

include MATGlobalCommonFunctionsQDM version '1.0.000' called Global
codesystem "LOINC": 'urn:oid:2.16.840.1.113883.6.1' 

valueset "Acute care hospital Inpatient Encounter": 'urn:oid:2.16.840.1.113883.3.666.5.2289' 
valueset "Bicarbonate lab test": 'urn:oid:2.16.840.1.113762.1.4.1045.139' 
valueset "Body temperature": 'urn:oid:2.16.840.1.113762.1.4.1045.152' 
valueset "Body weight": 'urn:oid:2.16.840.1.113762.1.4.1045.159' 
valueset "Creatinine lab test": 'urn:oid:2.16.840.1.113883.3.666.5.2363' 
valueset "Emergency Department Visit": 'urn:oid:2.16.840.1.113883.3.117.1.7.1.292' 
valueset "Encounter Inpatient": 'urn:oid:2.16.840.1.113883.3.666.5.307' 
valueset "Ethnicity": 'urn:oid:2.16.840.1.114222.4.11.837' 
valueset "Glucose lab test": 'urn:oid:2.16.840.1.113762.1.4.1045.134' 
valueset "Heart Rate": 'urn:oid:2.16.840.1.113762.1.4.1045.149' 
valueset "Hematocrit lab test": 'urn:oid:2.16.840.1.113762.1.4.1045.114' 
valueset "Medicare Advantage payer": 'urn:oid:2.16.840.1.113762.1.4.1104.12' 
valueset "Medicare FFS payer": 'urn:oid:2.16.840.1.113762.1.4.1104.10' 
valueset "Observation Services": 'urn:oid:2.16.840.1.113762.1.4.1111.143' 
valueset "ONC Administrative Sex": 'urn:oid:2.16.840.1.113762.1.4.1' 
valueset "Oxygen Saturation by Pulse Oximetry": 'urn:oid:2.16.840.1.113762.1.4.1045.151' 
valueset "Payer": 'urn:oid:2.16.840.1.114222.4.11.3591' 

valueset "Potassium lab test": 'urn:oid:2.16.840.1.113762.1.4.1045.117' 
valueset "Race": 'urn:oid:2.16.840.1.114222.4.11.836' 
valueset "Respiratory Rate": 'urn:oid:2.16.840.1.113762.1.4.1045.130' 
valueset "Sodium lab test": 'urn:oid:2.16.840.1.113762.1.4.1045.119' 
valueset "Systolic Blood Pressure": 'urn:oid:2.16.840.1.113762.1.4.1045.163' 
valueset "White blood cells count lab test": 'urn:oid:2.16.840.1.113762.1.4.1045.129' 

code "Birth date": '21112-8' from "LOINC" display 'Birth date'

parameter "Measurement Period" Interval<DateTime>

context Patient

define "Denominator":
  "Initial Population"

define "Initial Population":
  "Inpatient Encounters"
  

define "Numerator":
  "Initial Population"

define "SDE Ethnicity":
  ["Patient Characteristic Ethnicity": "Ethnicity"]

define "SDE Payer":
  ["Patient Characteristic Payer": "Payer"]

define "SDE Race":
  ["Patient Characteristic Race": "Race"]

define "SDE Sex":
  ["Patient Characteristic Sex": "ONC Administrative Sex"]

define "SDE Results":
  {
  // First physical exams
    FirstHeartRate: "FirstPhysicalExamWithEncounterId"(["Physical Exam, Performed": "Heart Rate"]),
    FirstSystolicBloodPressure: "FirstPhysicalExamWithEncounterId"(["Physical Exam, Performed": "Systolic Blood Pressure"]),
    FirstRespiratoryRate: "FirstPhysicalExamWithEncounterId"(["Physical Exam, Performed": "Respiratory Rate"]),
    FirstBodyTemperature: "FirstPhysicalExamWithEncounterId"(["Physical Exam, Performed": "Body temperature"]),
    FirstOxygenSaturation: "FirstPhysicalExamWithEncounterId"(["Physical Exam, Performed": "Oxygen Saturation by Pulse Oximetry"]),
  // Weight uses lab test timing
    FirstBodyWeight: "FirstPhysicalExamWithEncounterIdUsingLabTiming"(["Physical Exam, Performed": "Body weight"]),
  
  // First lab tests
    FirstHematocritLab: "FirstLabTestWithEncounterId"(["Laboratory Test, Performed": "Hematocrit lab test"]),
    FirstWhiteBloodCellCount: "FirstLabTestWithEncounterId"(["Laboratory Test, Performed": "White blood cells count lab test"]),
    FirstPotassiumLab: "FirstLabTestWithEncounterId"(["Laboratory Test, Performed": "Potassium lab test"]),
    FirstSodiumLab: "FirstLabTestWithEncounterId"(["Laboratory Test, Performed": "Sodium lab test"]),
    FirstBicarbonateLab: "FirstLabTestWithEncounterId"(["Laboratory Test, Performed": "Bicarbonate lab test"]),
    FirstCreatinineLab: "FirstLabTestWithEncounterId"(["Laboratory Test, Performed": "Creatinine lab test"]),
    FirstGlucoseLab: "FirstLabTestWithEncounterId"(["Laboratory Test, Performed": "Glucose lab test"])
  }

define "Inpatient Encounters":
  ["Encounter, Performed": "Encounter Inpatient"] InpatientEncounter
    with ( ["Patient Characteristic Payer": "Medicare FFS payer"]
      union ["Patient Characteristic Payer": "Medicare Advantage payer"] ) Payer
      such that Global."HospitalizationWithObservationLengthofStay" ( InpatientEncounter ) < 365
        and InpatientEncounter.relevantPeriod ends during day of "Measurement Period"
        and AgeInYearsAt(date from start of InpatientEncounter.relevantPeriod)>= 65

define function "LengthOfStay"(Stay Interval<DateTime> ):
  difference in days between start of Stay and 
  end of Stay

define function "FirstPhysicalExamWithEncounterId"(ExamList List<QDM.PositivePhysicalExamPerformed> ):
  "Inpatient Encounters" Encounter
    let FirstExam: First(ExamList Exam
        where Global."EarliestOf"(Exam.relevantDatetime, Exam.relevantPeriod)during Interval[start of Encounter.relevantPeriod - 1440 minutes, start of Encounter.relevantPeriod + 120 minutes]
        sort by Global."EarliestOf"(relevantDatetime, relevantPeriod)
    )
    return {
      EncounterId: Encounter.id,
      FirstResult: FirstExam.result as Quantity,
      Timing: Global."EarliestOf" ( FirstExam.relevantDatetime, FirstExam.relevantPeriod )
    }

define function "FirstPhysicalExamWithEncounterIdUsingLabTiming"(ExamList List<QDM.PositivePhysicalExamPerformed> ):
  "Inpatient Encounters" Encounter
    let FirstExamWithLabTiming: First(ExamList Exam
        where Global."EarliestOf"(Exam.relevantDatetime, Exam.relevantPeriod)during Interval[start of Encounter.relevantPeriod - 1440 minutes, start of Encounter.relevantPeriod + 1440 minutes]
        sort by Global."EarliestOf"(relevantDatetime, relevantPeriod)
    )
    return {
      EncounterId: Encounter.id,
      FirstResult: FirstExamWithLabTiming.result as Quantity,
      Timing: Global."EarliestOf" ( FirstExamWithLabTiming.relevantDatetime, FirstExamWithLabTiming.relevantPeriod )
    }

define function "FirstLabTestWithEncounterId"(LabList List<QDM.PositiveLaboratoryTestPerformed> ):
  "Inpatient Encounters" Encounter
    let FirstLab: First(LabList Lab
        where Lab.resultDatetime during Interval[start of Encounter.relevantPeriod - 1440 minutes, start of Encounter.relevantPeriod + 1440 minutes]
        sort by resultDatetime
    )
    return {
      EncounterId: Encounter.id,
      FirstResult: FirstLab.result as Quantity,
      Timing: FirstLab.resultDatetime
    }`;
