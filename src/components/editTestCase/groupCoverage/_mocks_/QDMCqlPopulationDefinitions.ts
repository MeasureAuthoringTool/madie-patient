export const qdmCqlPopulationsDefinitions = {
  "64ef": {
    populationDefinitions: {
      initialPopulation: 'define "Denominator":\n   "Initial Population"',
      denominator: 'define "Denominator":\n   "Initial Population"',
      numerator: 'define "Numerator":\n  "Initial Population"',
    },
    functions: {
      Latest: {
        definitionLogic:
          'define function "Latest"(period Interval<DateTime> ):\n  if ( HasEnd(period)) then \n  end of period \n    else start of period',
        parentLibrary: "MATGlobalCommonFunctionsQDM",
      },
      HospitalizationWithObservation: {
        definitionLogic:
          'define function "HospitalizationWithObservation"(Encounter "Encounter, Performed" ):\n  Encounter Visit\n  \tlet ObsVisit: Last(["Encounter, Performed": "Observation Services"] LastObs\n  \t\t\twhere LastObs.relevantPeriod ends 1 hour or less on or before start of Visit.relevantPeriod\n  \t\t\tsort by \n  \t\t\tend of relevantPeriod\n  \t),\n  \tVisitStart: Coalesce(start of ObsVisit.relevantPeriod, start of Visit.relevantPeriod),\n  \tEDVisit: Last(["Encounter, Performed": "Emergency Department Visit"] LastED\n  \t\t\twhere LastED.relevantPeriod ends 1 hour or less on or before VisitStart\n  \t\t\tsort by \n  \t\t\tend of relevantPeriod\n  \t)\n  \treturn Interval[Coalesce(start of EDVisit.relevantPeriod, VisitStart), \n  \tend of Visit.relevantPeriod]',
        parentLibrary: "MATGlobalCommonFunctionsQDM",
      },
      ToDateInterval: {
        definitionLogic:
          'define function "ToDateInterval"(period Interval<DateTime> ):\n  Interval[date from start of period, date from end of period]',
        parentLibrary: "MATGlobalCommonFunctionsQDM",
      },
      HasEnd: {
        definitionLogic:
          'define function "HasEnd"(period Interval<DateTime> ):\n  not ( \n    end of period is null\n      or \n      end of period = maximum DateTime\n  )',
        parentLibrary: "MATGlobalCommonFunctionsQDM",
      },
      HospitalArrivalTime: {
        definitionLogic:
          'define function "HospitalArrivalTime"(Encounter "Encounter, Performed" ):\n  start of First(("HospitalizationLocations"(Encounter))HospitalLocation\n  \t\tsort by start of locationPeriod\n  ).locationPeriod',
        parentLibrary: "MATGlobalCommonFunctionsQDM",
      },
      HospitalAdmissionTime: {
        definitionLogic:
          'define function "HospitalAdmissionTime"(Encounter "Encounter, Performed" ):\n  start of "Hospitalization"(Encounter)',
        parentLibrary: "MATGlobalCommonFunctionsQDM",
      },
      HospitalDischargeTime: {
        definitionLogic:
          'define function "HospitalDischargeTime"(Encounter "Encounter, Performed" ):\n  end of Encounter.relevantPeriod',
        parentLibrary: "MATGlobalCommonFunctionsQDM",
      },
      HospitalizationWithObservationAndOutpatientSurgeryService: {
        definitionLogic:
          'define function "HospitalizationWithObservationAndOutpatientSurgeryService"(Encounter "Encounter, Performed" ):\n  Encounter Visit\n  \tlet ObsVisit: Last(["Encounter, Performed": "Observation Services"] LastObs\n  \t\t\twhere LastObs.relevantPeriod ends 1 hour or less on or before start of Visit.relevantPeriod\n  \t\t\tsort by \n  \t\t\tend of relevantPeriod\n  \t),\n  \tVisitStart: Coalesce(start of ObsVisit.relevantPeriod, start of Visit.relevantPeriod),\n  \tEDVisit: Last(["Encounter, Performed": "Emergency Department Visit"] LastED\n  \t\t\twhere LastED.relevantPeriod ends 1 hour or less on or before VisitStart\n  \t\t\tsort by \n  \t\t\tend of relevantPeriod\n  \t),\n  \tVisitStartWithED: Coalesce(start of EDVisit.relevantPeriod, VisitStart),\n  \tOutpatientSurgeryVisit: Last(["Encounter, Performed": "Outpatient Surgery Service"] LastSurgeryOP\n  \t\t\twhere LastSurgeryOP.relevantPeriod ends 1 hour or less on or before VisitStartWithED\n  \t\t\tsort by \n  \t\t\tend of relevantPeriod\n  \t)\n  \treturn Interval[Coalesce(start of OutpatientSurgeryVisit.relevantPeriod, VisitStartWithED), \n  \tend of Visit.relevantPeriod]',
        parentLibrary: "MATGlobalCommonFunctionsQDM",
      },
      HospitalizationWithObservationLengthofStay: {
        definitionLogic:
          'define function "HospitalizationWithObservationLengthofStay"(Encounter "Encounter, Performed" ):\n  "LengthInDays"("HospitalizationWithObservation"(Encounter))',
        parentLibrary: "MATGlobalCommonFunctionsQDM",
      },
      HospitalDepartureTime: {
        definitionLogic:
          'define function "HospitalDepartureTime"(Encounter "Encounter, Performed" ):\n  end of Last(("HospitalizationLocations"(Encounter))HospitalLocation\n  \t\tsort by start of locationPeriod\n  ).locationPeriod',
        parentLibrary: "MATGlobalCommonFunctionsQDM",
      },
      EarliestOf: {
        definitionLogic:
          'define function "EarliestOf"(pointInTime DateTime, period Interval<DateTime> ):\n  Earliest(NormalizeInterval(pointInTime, period))',
        parentLibrary: "MATGlobalCommonFunctionsQDM",
      },
      Earliest: {
        definitionLogic:
          'define function "Earliest"(period Interval<DateTime> ):\n  if ( HasStart(period)) then start of period \n    else \n  end of period',
        parentLibrary: "MATGlobalCommonFunctionsQDM",
      },
      LengthOfStay: {
        definitionLogic:
          'define function "LengthOfStay"(Stay Interval<DateTime> ):\n  difference in days between start of Stay and \n  end of Stay',
        parentLibrary: null,
      },
      LengthInDays: {
        definitionLogic:
          'define function "LengthInDays"(Value Interval<DateTime> ):\n  difference in days between start of Value and end of Value',
        parentLibrary: "MATGlobalCommonFunctionsQDM",
      },
      NormalizeInterval: {
        definitionLogic:
          'define function "NormalizeInterval"(pointInTime DateTime, period Interval<DateTime> ):\n  if pointInTime is not null then Interval[pointInTime, pointInTime]\n    else if period is not null then period \n    else null as Interval<DateTime>',
        parentLibrary: "MATGlobalCommonFunctionsQDM",
      },
      FirstInpatientIntensiveCareUnit: {
        definitionLogic:
          'define function "FirstInpatientIntensiveCareUnit"(Encounter "Encounter, Performed" ):\n  First((Encounter.facilityLocations)HospitalLocation\n      where HospitalLocation.code in "Intensive Care Unit"\n        and HospitalLocation.locationPeriod during Encounter.relevantPeriod\n      sort by start of locationPeriod\n  )',
        parentLibrary: "MATGlobalCommonFunctionsQDM",
      },
      Hospitalization: {
        definitionLogic:
          'define function "Hospitalization"(Encounter "Encounter, Performed" ):\n  Encounter Visit\n  \tlet EDVisit: Last(["Encounter, Performed": "Emergency Department Visit"] LastED\n  \t\t\twhere LastED.relevantPeriod ends 1 hour or less on or before start of Visit.relevantPeriod\n  \t\t\tsort by \n  \t\t\tend of relevantPeriod\n  \t)\n  \treturn Interval[Coalesce(start of EDVisit.relevantPeriod, start of Visit.relevantPeriod), \n  \tend of Visit.relevantPeriod]',
        parentLibrary: "MATGlobalCommonFunctionsQDM",
      },
      HospitalizationLengthofStay: {
        definitionLogic:
          'define function "HospitalizationLengthofStay"(Encounter "Encounter, Performed" ):\n  LengthInDays("Hospitalization"(Encounter))',
        parentLibrary: "MATGlobalCommonFunctionsQDM",
      },
      HasStart: {
        definitionLogic:
          'define function "HasStart"(period Interval<DateTime> ):\n  not ( start of period is null\n      or start of period = minimum DateTime\n  )',
        parentLibrary: "MATGlobalCommonFunctionsQDM",
      },
      LatestOf: {
        definitionLogic:
          'define function "LatestOf"(pointInTime DateTime, period Interval<DateTime> ):\n  Latest(NormalizeInterval(pointInTime, period))',
        parentLibrary: "MATGlobalCommonFunctionsQDM",
      },
      FirstPhysicalExamWithEncounterId: {
        definitionLogic:
          'define function "FirstPhysicalExamWithEncounterId"(ExamList List<QDM.PositivePhysicalExamPerformed> ):\n  "Inpatient Encounters" Encounter\n    let FirstExam: First(ExamList Exam\n        where Global."EarliestOf"(Exam.relevantDatetime, Exam.relevantPeriod)during Interval[start of Encounter.relevantPeriod - 1440 minutes, start of Encounter.relevantPeriod + 120 minutes]\n        sort by Global."EarliestOf"(relevantDatetime, relevantPeriod)\n    )\n    return {\n      EncounterId: Encounter.id,\n      FirstResult: FirstExam.result as Quantity,\n      Timing: Global."EarliestOf" ( FirstExam.relevantDatetime, FirstExam.relevantPeriod )\n    }',
        parentLibrary: null,
      },
      FirstLabTestWithEncounterId: {
        definitionLogic:
          'define function "FirstLabTestWithEncounterId"(LabList List<QDM.PositiveLaboratoryTestPerformed> ):\n  "Inpatient Encounters" Encounter\n    let FirstLab: First(LabList Lab\n        where Lab.resultDatetime during Interval[start of Encounter.relevantPeriod - 1440 minutes, start of Encounter.relevantPeriod + 1440 minutes]\n        sort by resultDatetime\n    )\n    return {\n      EncounterId: Encounter.id,\n      FirstResult: FirstLab.result as Quantity,\n      Timing: FirstLab.resultDatetime\n    }',
        parentLibrary: null,
      },
      HospitalizationLocations: {
        definitionLogic:
          'define function "HospitalizationLocations"(Encounter "Encounter, Performed" ):\n  Encounter Visit\n  \tlet EDVisit: Last(["Encounter, Performed": "Emergency Department Visit"] LastED\n  \t\t\twhere LastED.relevantPeriod ends 1 hour or less on or before start of Visit.relevantPeriod\n  \t\t\tsort by \n  \t\t\tend of relevantPeriod\n  \t)\n  \treturn if EDVisit is null then Visit.facilityLocations \n  \t\telse flatten { EDVisit.facilityLocations, Visit.facilityLocations }',
        parentLibrary: "MATGlobalCommonFunctionsQDM",
      },
      EmergencyDepartmentArrivalTime: {
        definitionLogic:
          'define function "EmergencyDepartmentArrivalTime"(Encounter "Encounter, Performed" ):\n  start of First(("HospitalizationLocations"(Encounter))HospitalLocation\n  \t\twhere HospitalLocation.code in "Emergency Department Visit"\n  \t\tsort by start of locationPeriod\n  ).locationPeriod',
        parentLibrary: "MATGlobalCommonFunctionsQDM",
      },
      FirstPhysicalExamWithEncounterIdUsingLabTiming: {
        definitionLogic:
          'define function "FirstPhysicalExamWithEncounterIdUsingLabTiming"(ExamList List<QDM.PositivePhysicalExamPerformed> ):\n  "Inpatient Encounters" Encounter\n    let FirstExamWithLabTiming: First(ExamList Exam\n        where Global."EarliestOf"(Exam.relevantDatetime, Exam.relevantPeriod)during Interval[start of Encounter.relevantPeriod - 1440 minutes, start of Encounter.relevantPeriod + 1440 minutes]\n        sort by Global."EarliestOf"(relevantDatetime, relevantPeriod)\n    )\n    return {\n      EncounterId: Encounter.id,\n      FirstResult: FirstExamWithLabTiming.result as Quantity,\n      Timing: Global."EarliestOf" ( FirstExamWithLabTiming.relevantDatetime, FirstExamWithLabTiming.relevantPeriod )\n    }',
        parentLibrary: null,
      },
    },
    definitions: {
      Denominator: {
        definitionLogic: 'define "Denominator":\n   "Initial Population"',
        parentLibrary: null,
      },
      "Inpatient Encounters": {
        definitionLogic:
          'define "Inpatient Encounters":\n  ["Encounter, Performed": "Encounter Inpatient"] InpatientEncounter\n    with ( ["Patient Characteristic Payer": "Medicare FFS payer"]\n      union ["Patient Characteristic Payer": "Medicare Advantage payer"] ) Payer\n      such that Global."HospitalizationWithObservationLengthofStay" ( InpatientEncounter ) < 365\n        and InpatientEncounter.relevantPeriod ends during day of "Measurement Period"\n        and AgeInYearsAt(date from start of InpatientEncounter.relevantPeriod)>= 65',
        parentLibrary: null,
      },
      "SDE Results": {
        definitionLogic:
          'define "SDE Results":\n  {\n  // First physical exams\n    FirstHeartRate: "FirstPhysicalExamWithEncounterId"(["Physical Exam, Performed": "Heart Rate"]),\n    FirstSystolicBloodPressure: "FirstPhysicalExamWithEncounterId"(["Physical Exam, Performed": "Systolic Blood Pressure"]),\n    FirstRespiratoryRate: "FirstPhysicalExamWithEncounterId"(["Physical Exam, Performed": "Respiratory Rate"]),\n    FirstBodyTemperature: "FirstPhysicalExamWithEncounterId"(["Physical Exam, Performed": "Body temperature"]),\n    FirstOxygenSaturation: "FirstPhysicalExamWithEncounterId"(["Physical Exam, Performed": "Oxygen Saturation by Pulse Oximetry"]),\n  // Weight uses lab test timing\n    FirstBodyWeight: "FirstPhysicalExamWithEncounterIdUsingLabTiming"(["Physical Exam, Performed": "Body weight"]),\n  \n  // First lab tests\n    FirstHematocritLab: "FirstLabTestWithEncounterId"(["Laboratory Test, Performed": "Hematocrit lab test"]),\n    FirstWhiteBloodCellCount: "FirstLabTestWithEncounterId"(["Laboratory Test, Performed": "White blood cells count lab test"]),\n    FirstPotassiumLab: "FirstLabTestWithEncounterId"(["Laboratory Test, Performed": "Potassium lab test"]),\n    FirstSodiumLab: "FirstLabTestWithEncounterId"(["Laboratory Test, Performed": "Sodium lab test"]),\n    FirstBicarbonateLab: "FirstLabTestWithEncounterId"(["Laboratory Test, Performed": "Bicarbonate lab test"]),\n    FirstCreatinineLab: "FirstLabTestWithEncounterId"(["Laboratory Test, Performed": "Creatinine lab test"]),\n    FirstGlucoseLab: "FirstLabTestWithEncounterId"(["Laboratory Test, Performed": "Glucose lab test"])\n  }',
        parentLibrary: null,
      },
      "SDE Ethnicity": {
        definitionLogic:
          'define "SDE Ethnicity":\n  ["Patient Characteristic Ethnicity": "Ethnicity"]',
        parentLibrary: null,
      },
      "SDE Sex": {
        definitionLogic:
          'define "SDE Sex":\n  ["Patient Characteristic Sex": "ONC Administrative Sex"]',
        parentLibrary: null,
      },
      "SDE Race": {
        definitionLogic:
          'define "SDE Race":\n  ["Patient Characteristic Race": "Race"]',
        parentLibrary: null,
      },
      "ED Encounter": {
        definitionLogic:
          'define "ED Encounter":\n  ["Encounter, Performed": "Emergency Department Visit"]',
        parentLibrary: "MATGlobalCommonFunctionsQDM",
      },
      "Inpatient Encounter": {
        definitionLogic:
          'define "Inpatient Encounter":\n  ["Encounter, Performed": "Encounter Inpatient"] EncounterInpatient\n    where "LengthInDays"(EncounterInpatient.relevantPeriod)<= 120\n      and EncounterInpatient.relevantPeriod ends during day of "Measurement Period"',
        parentLibrary: "MATGlobalCommonFunctionsQDM",
      },
      "Initial Population": {
        definitionLogic:
          'define "Initial Population":\n  "Inpatient Encounters"',
        parentLibrary: null,
      },
      "SDE Payer": {
        definitionLogic:
          'define "SDE Payer":\n  ["Patient Characteristic Payer": "Payer"]',
        parentLibrary: null,
      },
      Numerator: {
        definitionLogic: 'define "Numerator":\n  "Initial Population"',
        parentLibrary: null,
      },
    },
  },
};
