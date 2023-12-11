export const qdmCallStack = [
  {
    id: "MATGlobalCommonFunctionsQDM-1.0.000|Global|ED Encounter",
    definitionName: "ED Encounter",
    definitionLogic:
      'define "ED Encounter":\n  ["Encounter, Performed": "Emergency Department Visit"]',
    context: "Patient",
    supplDataElement: false,
    popDefinition: false,
    commentString: "",
    returnType: null,
    parentLibrary: "MATGlobalCommonFunctionsQDM",
    libraryDisplayName: "Global",
    libraryVersion: "1.0.000",
    name: "ED Encounter",
    function: false,
    logic:
      'define "ED Encounter":\n  ["Encounter, Performed": "Emergency Department Visit"]',
  },
  {
    id: "MATGlobalCommonFunctionsQDM-1.0.000|Global|EarliestOf",
    definitionName: "EarliestOf",
    definitionLogic:
      'define function "EarliestOf"(pointInTime DateTime, period Interval<DateTime> ):\n  Earliest(NormalizeInterval(pointInTime, period))',
    context: "Patient",
    supplDataElement: false,
    popDefinition: false,
    commentString: "",
    returnType: null,
    parentLibrary: "MATGlobalCommonFunctionsQDM",
    libraryDisplayName: "Global",
    libraryVersion: "1.0.000",
    name: "EarliestOf",
    function: true,
    logic:
      'define function "EarliestOf"(pointInTime DateTime, period Interval<DateTime> ):\n  Earliest(NormalizeInterval(pointInTime, period))',
  },
  {
    id: "MATGlobalCommonFunctionsQDM-1.0.000|Global|HospitalizationLengthofStay",
    definitionName: "HospitalizationLengthofStay",
    definitionLogic:
      'define function "HospitalizationLengthofStay"(Encounter "Encounter, Performed" ):\n  LengthInDays("Hospitalization"(Encounter))',
    context: "Patient",
    supplDataElement: false,
    popDefinition: false,
    commentString: "",
    returnType: null,
    parentLibrary: "MATGlobalCommonFunctionsQDM",
    libraryDisplayName: "Global",
    libraryVersion: "1.0.000",
    name: "HospitalizationLengthofStay",
    function: true,
    logic:
      'define function "HospitalizationLengthofStay"(Encounter "Encounter, Performed" ):\n  LengthInDays("Hospitalization"(Encounter))',
  },
  {
    id: "SDE Race",
    definitionName: "SDE Race",
    definitionLogic:
      'define "SDE Race":\n  ["Patient Characteristic Race": "Race"]',
    context: "Patient",
    supplDataElement: false,
    popDefinition: false,
    commentString: "",
    returnType: null,
    parentLibrary: null,
    libraryDisplayName: null,
    libraryVersion: null,
    name: "SDE Race",
    function: false,
    logic: 'define "SDE Race":\n  ["Patient Characteristic Race": "Race"]',
  },
  {
    id: "MATGlobalCommonFunctionsQDM-1.0.000|Global|Inpatient Encounter",
    definitionName: "Inpatient Encounter",
    definitionLogic:
      'define "Inpatient Encounter":\n  ["Encounter, Performed": "Encounter Inpatient"] EncounterInpatient\n    where "LengthInDays"(EncounterInpatient.relevantPeriod)<= 120\n      and EncounterInpatient.relevantPeriod ends during day of "Measurement Period"',
    context: "Patient",
    supplDataElement: false,
    popDefinition: false,
    commentString: "",
    returnType: null,
    parentLibrary: "MATGlobalCommonFunctionsQDM",
    libraryDisplayName: "Global",
    libraryVersion: "1.0.000",
    name: "Inpatient Encounter",
    function: false,
    logic:
      'define "Inpatient Encounter":\n  ["Encounter, Performed": "Encounter Inpatient"] EncounterInpatient\n    where "LengthInDays"(EncounterInpatient.relevantPeriod)<= 120\n      and EncounterInpatient.relevantPeriod ends during day of "Measurement Period"',
  },
  {
    id: "MATGlobalCommonFunctionsQDM-1.0.000|Global|HospitalizationLocations",
    definitionName: "HospitalizationLocations",
    definitionLogic:
      'define function "HospitalizationLocations"(Encounter "Encounter, Performed" ):\n  Encounter Visit\n  \tlet EDVisit: Last(["Encounter, Performed": "Emergency Department Visit"] LastED\n  \t\t\twhere LastED.relevantPeriod ends 1 hour or less on or before start of Visit.relevantPeriod\n  \t\t\tsort by \n  \t\t\tend of relevantPeriod\n  \t)\n  \treturn if EDVisit is null then Visit.facilityLocations \n  \t\telse flatten { EDVisit.facilityLocations, Visit.facilityLocations }',
    context: "Patient",
    supplDataElement: false,
    popDefinition: false,
    commentString: "",
    returnType: null,
    parentLibrary: "MATGlobalCommonFunctionsQDM",
    libraryDisplayName: "Global",
    libraryVersion: "1.0.000",
    name: "HospitalizationLocations",
    function: true,
    logic:
      'define function "HospitalizationLocations"(Encounter "Encounter, Performed" ):\n  Encounter Visit\n  \tlet EDVisit: Last(["Encounter, Performed": "Emergency Department Visit"] LastED\n  \t\t\twhere LastED.relevantPeriod ends 1 hour or less on or before start of Visit.relevantPeriod\n  \t\t\tsort by \n  \t\t\tend of relevantPeriod\n  \t)\n  \treturn if EDVisit is null then Visit.facilityLocations \n  \t\telse flatten { EDVisit.facilityLocations, Visit.facilityLocations }',
  },
  {
    id: "Inpatient Encounters",
    definitionName: "Inpatient Encounters",
    definitionLogic:
      'define "Inpatient Encounters":\n  ["Encounter, Performed": "Encounter Inpatient"] InpatientEncounter\n    with ( ["Patient Characteristic Payer": "Medicare FFS payer"]\n      union ["Patient Characteristic Payer": "Medicare Advantage payer"] ) Payer\n      such that Global."HospitalizationWithObservationLengthofStay" ( InpatientEncounter ) < 365\n        and InpatientEncounter.relevantPeriod ends during day of "Measurement Period"\n        and AgeInYearsAt(date from start of InpatientEncounter.relevantPeriod)>= 65',
    context: "Patient",
    supplDataElement: false,
    popDefinition: false,
    commentString: "",
    returnType: null,
    parentLibrary: null,
    libraryDisplayName: null,
    libraryVersion: null,
    name: "Inpatient Encounters",
    function: false,
    logic:
      'define "Inpatient Encounters":\n  ["Encounter, Performed": "Encounter Inpatient"] InpatientEncounter\n    with ( ["Patient Characteristic Payer": "Medicare FFS payer"]\n      union ["Patient Characteristic Payer": "Medicare Advantage payer"] ) Payer\n      such that Global."HospitalizationWithObservationLengthofStay" ( InpatientEncounter ) < 365\n        and InpatientEncounter.relevantPeriod ends during day of "Measurement Period"\n        and AgeInYearsAt(date from start of InpatientEncounter.relevantPeriod)>= 65',
  },
  {
    id: "SDE Results",
    definitionName: "SDE Results",
    definitionLogic:
      'define "SDE Results":\n  {\n  // First physical exams\n    FirstHeartRate: "FirstPhysicalExamWithEncounterId"(["Physical Exam, Performed": "Heart Rate"]),\n    FirstSystolicBloodPressure: "FirstPhysicalExamWithEncounterId"(["Physical Exam, Performed": "Systolic Blood Pressure"]),\n    FirstRespiratoryRate: "FirstPhysicalExamWithEncounterId"(["Physical Exam, Performed": "Respiratory Rate"]),\n    FirstBodyTemperature: "FirstPhysicalExamWithEncounterId"(["Physical Exam, Performed": "Body temperature"]),\n    FirstOxygenSaturation: "FirstPhysicalExamWithEncounterId"(["Physical Exam, Performed": "Oxygen Saturation by Pulse Oximetry"]),\n  // Weight uses lab test timing\n    FirstBodyWeight: "FirstPhysicalExamWithEncounterIdUsingLabTiming"(["Physical Exam, Performed": "Body weight"]),\n  \n  // First lab tests\n    FirstHematocritLab: "FirstLabTestWithEncounterId"(["Laboratory Test, Performed": "Hematocrit lab test"]),\n    FirstWhiteBloodCellCount: "FirstLabTestWithEncounterId"(["Laboratory Test, Performed": "White blood cells count lab test"]),\n    FirstPotassiumLab: "FirstLabTestWithEncounterId"(["Laboratory Test, Performed": "Potassium lab test"]),\n    FirstSodiumLab: "FirstLabTestWithEncounterId"(["Laboratory Test, Performed": "Sodium lab test"]),\n    FirstBicarbonateLab: "FirstLabTestWithEncounterId"(["Laboratory Test, Performed": "Bicarbonate lab test"]),\n    FirstCreatinineLab: "FirstLabTestWithEncounterId"(["Laboratory Test, Performed": "Creatinine lab test"]),\n    FirstGlucoseLab: "FirstLabTestWithEncounterId"(["Laboratory Test, Performed": "Glucose lab test"])\n  }',
    context: "Patient",
    supplDataElement: false,
    popDefinition: false,
    commentString: "",
    returnType: null,
    parentLibrary: null,
    libraryDisplayName: null,
    libraryVersion: null,
    name: "SDE Results",
    function: false,
    logic:
      'define "SDE Results":\n  {\n  // First physical exams\n    FirstHeartRate: "FirstPhysicalExamWithEncounterId"(["Physical Exam, Performed": "Heart Rate"]),\n    FirstSystolicBloodPressure: "FirstPhysicalExamWithEncounterId"(["Physical Exam, Performed": "Systolic Blood Pressure"]),\n    FirstRespiratoryRate: "FirstPhysicalExamWithEncounterId"(["Physical Exam, Performed": "Respiratory Rate"]),\n    FirstBodyTemperature: "FirstPhysicalExamWithEncounterId"(["Physical Exam, Performed": "Body temperature"]),\n    FirstOxygenSaturation: "FirstPhysicalExamWithEncounterId"(["Physical Exam, Performed": "Oxygen Saturation by Pulse Oximetry"]),\n  // Weight uses lab test timing\n    FirstBodyWeight: "FirstPhysicalExamWithEncounterIdUsingLabTiming"(["Physical Exam, Performed": "Body weight"]),\n  \n  // First lab tests\n    FirstHematocritLab: "FirstLabTestWithEncounterId"(["Laboratory Test, Performed": "Hematocrit lab test"]),\n    FirstWhiteBloodCellCount: "FirstLabTestWithEncounterId"(["Laboratory Test, Performed": "White blood cells count lab test"]),\n    FirstPotassiumLab: "FirstLabTestWithEncounterId"(["Laboratory Test, Performed": "Potassium lab test"]),\n    FirstSodiumLab: "FirstLabTestWithEncounterId"(["Laboratory Test, Performed": "Sodium lab test"]),\n    FirstBicarbonateLab: "FirstLabTestWithEncounterId"(["Laboratory Test, Performed": "Bicarbonate lab test"]),\n    FirstCreatinineLab: "FirstLabTestWithEncounterId"(["Laboratory Test, Performed": "Creatinine lab test"]),\n    FirstGlucoseLab: "FirstLabTestWithEncounterId"(["Laboratory Test, Performed": "Glucose lab test"])\n  }',
  },
  {
    id: "Denominator",
    definitionName: "Denominator",
    definitionLogic: 'define "Denominator":\n  "Initial Population"',
    context: "Patient",
    supplDataElement: false,
    popDefinition: false,
    commentString: "",
    returnType: null,
    parentLibrary: null,
    libraryDisplayName: null,
    libraryVersion: null,
    name: "Denominator",
    function: false,
    logic: 'define "Denominator":\n  "Initial Population"',
  },
  {
    id: "MATGlobalCommonFunctionsQDM-1.0.000|Global|HospitalDepartureTime",
    definitionName: "HospitalDepartureTime",
    definitionLogic:
      'define function "HospitalDepartureTime"(Encounter "Encounter, Performed" ):\n  end of Last(("HospitalizationLocations"(Encounter))HospitalLocation\n  \t\tsort by start of locationPeriod\n  ).locationPeriod',
    context: "Patient",
    supplDataElement: false,
    popDefinition: false,
    commentString: "",
    returnType: null,
    parentLibrary: "MATGlobalCommonFunctionsQDM",
    libraryDisplayName: "Global",
    libraryVersion: "1.0.000",
    name: "HospitalDepartureTime",
    function: true,
    logic:
      'define function "HospitalDepartureTime"(Encounter "Encounter, Performed" ):\n  end of Last(("HospitalizationLocations"(Encounter))HospitalLocation\n  \t\tsort by start of locationPeriod\n  ).locationPeriod',
  },
  {
    id: "MATGlobalCommonFunctionsQDM-1.0.000|Global|HospitalArrivalTime",
    definitionName: "HospitalArrivalTime",
    definitionLogic:
      'define function "HospitalArrivalTime"(Encounter "Encounter, Performed" ):\n  start of First(("HospitalizationLocations"(Encounter))HospitalLocation\n  \t\tsort by start of locationPeriod\n  ).locationPeriod',
    context: "Patient",
    supplDataElement: false,
    popDefinition: false,
    commentString: "",
    returnType: null,
    parentLibrary: "MATGlobalCommonFunctionsQDM",
    libraryDisplayName: "Global",
    libraryVersion: "1.0.000",
    name: "HospitalArrivalTime",
    function: true,
    logic:
      'define function "HospitalArrivalTime"(Encounter "Encounter, Performed" ):\n  start of First(("HospitalizationLocations"(Encounter))HospitalLocation\n  \t\tsort by start of locationPeriod\n  ).locationPeriod',
  },
  {
    id: "MATGlobalCommonFunctionsQDM-1.0.000|Global|FirstInpatientIntensiveCareUnit",
    definitionName: "FirstInpatientIntensiveCareUnit",
    definitionLogic:
      'define function "FirstInpatientIntensiveCareUnit"(Encounter "Encounter, Performed" ):\n  First((Encounter.facilityLocations)HospitalLocation\n      where HospitalLocation.code in "Intensive Care Unit"\n        and HospitalLocation.locationPeriod during Encounter.relevantPeriod\n      sort by start of locationPeriod\n  )',
    context: "Patient",
    supplDataElement: false,
    popDefinition: false,
    commentString: "",
    returnType: null,
    parentLibrary: "MATGlobalCommonFunctionsQDM",
    libraryDisplayName: "Global",
    libraryVersion: "1.0.000",
    name: "FirstInpatientIntensiveCareUnit",
    function: true,
    logic:
      'define function "FirstInpatientIntensiveCareUnit"(Encounter "Encounter, Performed" ):\n  First((Encounter.facilityLocations)HospitalLocation\n      where HospitalLocation.code in "Intensive Care Unit"\n        and HospitalLocation.locationPeriod during Encounter.relevantPeriod\n      sort by start of locationPeriod\n  )',
  },
  {
    id: "MATGlobalCommonFunctionsQDM-1.0.000|Global|HospitalAdmissionTime",
    definitionName: "HospitalAdmissionTime",
    definitionLogic:
      'define function "HospitalAdmissionTime"(Encounter "Encounter, Performed" ):\n  start of "Hospitalization"(Encounter)',
    context: "Patient",
    supplDataElement: false,
    popDefinition: false,
    commentString: "",
    returnType: null,
    parentLibrary: "MATGlobalCommonFunctionsQDM",
    libraryDisplayName: "Global",
    libraryVersion: "1.0.000",
    name: "HospitalAdmissionTime",
    function: true,
    logic:
      'define function "HospitalAdmissionTime"(Encounter "Encounter, Performed" ):\n  start of "Hospitalization"(Encounter)',
  },
  {
    id: "Numerator",
    definitionName: "Numerator",
    definitionLogic: 'define "Numerator":\n  "Initial Population"',
    context: "Patient",
    supplDataElement: false,
    popDefinition: false,
    commentString: "",
    returnType: null,
    parentLibrary: null,
    libraryDisplayName: null,
    libraryVersion: null,
    name: "Numerator",
    function: false,
    logic: 'define "Numerator":\n  "Initial Population"',
  },
  {
    id: "MATGlobalCommonFunctionsQDM-1.0.000|Global|EmergencyDepartmentArrivalTime",
    definitionName: "EmergencyDepartmentArrivalTime",
    definitionLogic:
      'define function "EmergencyDepartmentArrivalTime"(Encounter "Encounter, Performed" ):\n  start of First(("HospitalizationLocations"(Encounter))HospitalLocation\n  \t\twhere HospitalLocation.code in "Emergency Department Visit"\n  \t\tsort by start of locationPeriod\n  ).locationPeriod',
    context: "Patient",
    supplDataElement: false,
    popDefinition: false,
    commentString: "",
    returnType: null,
    parentLibrary: "MATGlobalCommonFunctionsQDM",
    libraryDisplayName: "Global",
    libraryVersion: "1.0.000",
    name: "EmergencyDepartmentArrivalTime",
    function: true,
    logic:
      'define function "EmergencyDepartmentArrivalTime"(Encounter "Encounter, Performed" ):\n  start of First(("HospitalizationLocations"(Encounter))HospitalLocation\n  \t\twhere HospitalLocation.code in "Emergency Department Visit"\n  \t\tsort by start of locationPeriod\n  ).locationPeriod',
  },
  {
    id: "MATGlobalCommonFunctionsQDM-1.0.000|Global|HospitalizationWithObservationAndOutpatientSurgeryService",
    definitionName: "HospitalizationWithObservationAndOutpatientSurgeryService",
    definitionLogic:
      'define function "HospitalizationWithObservationAndOutpatientSurgeryService"(Encounter "Encounter, Performed" ):\n  Encounter Visit\n  \tlet ObsVisit: Last(["Encounter, Performed": "Observation Services"] LastObs\n  \t\t\twhere LastObs.relevantPeriod ends 1 hour or less on or before start of Visit.relevantPeriod\n  \t\t\tsort by \n  \t\t\tend of relevantPeriod\n  \t),\n  \tVisitStart: Coalesce(start of ObsVisit.relevantPeriod, start of Visit.relevantPeriod),\n  \tEDVisit: Last(["Encounter, Performed": "Emergency Department Visit"] LastED\n  \t\t\twhere LastED.relevantPeriod ends 1 hour or less on or before VisitStart\n  \t\t\tsort by \n  \t\t\tend of relevantPeriod\n  \t),\n  \tVisitStartWithED: Coalesce(start of EDVisit.relevantPeriod, VisitStart),\n  \tOutpatientSurgeryVisit: Last(["Encounter, Performed": "Outpatient Surgery Service"] LastSurgeryOP\n  \t\t\twhere LastSurgeryOP.relevantPeriod ends 1 hour or less on or before VisitStartWithED\n  \t\t\tsort by \n  \t\t\tend of relevantPeriod\n  \t)\n  \treturn Interval[Coalesce(start of OutpatientSurgeryVisit.relevantPeriod, VisitStartWithED), \n  \tend of Visit.relevantPeriod]',
    context: "Patient",
    supplDataElement: false,
    popDefinition: false,
    commentString: "",
    returnType: null,
    parentLibrary: "MATGlobalCommonFunctionsQDM",
    libraryDisplayName: "Global",
    libraryVersion: "1.0.000",
    name: "HospitalizationWithObservationAndOutpatientSurgeryService",
    function: true,
    logic:
      'define function "HospitalizationWithObservationAndOutpatientSurgeryService"(Encounter "Encounter, Performed" ):\n  Encounter Visit\n  \tlet ObsVisit: Last(["Encounter, Performed": "Observation Services"] LastObs\n  \t\t\twhere LastObs.relevantPeriod ends 1 hour or less on or before start of Visit.relevantPeriod\n  \t\t\tsort by \n  \t\t\tend of relevantPeriod\n  \t),\n  \tVisitStart: Coalesce(start of ObsVisit.relevantPeriod, start of Visit.relevantPeriod),\n  \tEDVisit: Last(["Encounter, Performed": "Emergency Department Visit"] LastED\n  \t\t\twhere LastED.relevantPeriod ends 1 hour or less on or before VisitStart\n  \t\t\tsort by \n  \t\t\tend of relevantPeriod\n  \t),\n  \tVisitStartWithED: Coalesce(start of EDVisit.relevantPeriod, VisitStart),\n  \tOutpatientSurgeryVisit: Last(["Encounter, Performed": "Outpatient Surgery Service"] LastSurgeryOP\n  \t\t\twhere LastSurgeryOP.relevantPeriod ends 1 hour or less on or before VisitStartWithED\n  \t\t\tsort by \n  \t\t\tend of relevantPeriod\n  \t)\n  \treturn Interval[Coalesce(start of OutpatientSurgeryVisit.relevantPeriod, VisitStartWithED), \n  \tend of Visit.relevantPeriod]',
  },
  {
    id: "MATGlobalCommonFunctionsQDM-1.0.000|Global|Earliest",
    definitionName: "Earliest",
    definitionLogic:
      'define function "Earliest"(period Interval<DateTime> ):\n  if ( HasStart(period)) then start of period \n    else \n  end of period',
    context: "Patient",
    supplDataElement: false,
    popDefinition: false,
    commentString: "",
    returnType: null,
    parentLibrary: "MATGlobalCommonFunctionsQDM",
    libraryDisplayName: "Global",
    libraryVersion: "1.0.000",
    name: "Earliest",
    function: true,
    logic:
      'define function "Earliest"(period Interval<DateTime> ):\n  if ( HasStart(period)) then start of period \n    else \n  end of period',
  },
  {
    id: "MATGlobalCommonFunctionsQDM-1.0.000|Global|HospitalizationWithObservationLengthofStay",
    definitionName: "HospitalizationWithObservationLengthofStay",
    definitionLogic:
      'define function "HospitalizationWithObservationLengthofStay"(Encounter "Encounter, Performed" ):\n  "LengthInDays"("HospitalizationWithObservation"(Encounter))',
    context: "Patient",
    supplDataElement: false,
    popDefinition: false,
    commentString: "",
    returnType: null,
    parentLibrary: "MATGlobalCommonFunctionsQDM",
    libraryDisplayName: "Global",
    libraryVersion: "1.0.000",
    name: "HospitalizationWithObservationLengthofStay",
    function: true,
    logic:
      'define function "HospitalizationWithObservationLengthofStay"(Encounter "Encounter, Performed" ):\n  "LengthInDays"("HospitalizationWithObservation"(Encounter))',
  },
  {
    id: "FirstPhysicalExamWithEncounterIdUsingLabTiming",
    definitionName: "FirstPhysicalExamWithEncounterIdUsingLabTiming",
    definitionLogic:
      'define function "FirstPhysicalExamWithEncounterIdUsingLabTiming"(ExamList List<QDM.PositivePhysicalExamPerformed> ):\n  "Inpatient Encounters" Encounter\n    let FirstExamWithLabTiming: First(ExamList Exam\n        where Global."EarliestOf"(Exam.relevantDatetime, Exam.relevantPeriod)during Interval[start of Encounter.relevantPeriod - 1440 minutes, start of Encounter.relevantPeriod + 1440 minutes]\n        sort by Global."EarliestOf"(relevantDatetime, relevantPeriod)\n    )\n    return {\n      EncounterId: Encounter.id,\n      FirstResult: FirstExamWithLabTiming.result as Quantity,\n      Timing: Global."EarliestOf" ( FirstExamWithLabTiming.relevantDatetime, FirstExamWithLabTiming.relevantPeriod )\n    }',
    context: "Patient",
    supplDataElement: false,
    popDefinition: false,
    commentString: "",
    returnType: null,
    parentLibrary: null,
    libraryDisplayName: null,
    libraryVersion: null,
    name: "FirstPhysicalExamWithEncounterIdUsingLabTiming",
    function: true,
    logic:
      'define function "FirstPhysicalExamWithEncounterIdUsingLabTiming"(ExamList List<QDM.PositivePhysicalExamPerformed> ):\n  "Inpatient Encounters" Encounter\n    let FirstExamWithLabTiming: First(ExamList Exam\n        where Global."EarliestOf"(Exam.relevantDatetime, Exam.relevantPeriod)during Interval[start of Encounter.relevantPeriod - 1440 minutes, start of Encounter.relevantPeriod + 1440 minutes]\n        sort by Global."EarliestOf"(relevantDatetime, relevantPeriod)\n    )\n    return {\n      EncounterId: Encounter.id,\n      FirstResult: FirstExamWithLabTiming.result as Quantity,\n      Timing: Global."EarliestOf" ( FirstExamWithLabTiming.relevantDatetime, FirstExamWithLabTiming.relevantPeriod )\n    }',
  },
  {
    id: "MATGlobalCommonFunctionsQDM-1.0.000|Global|HospitalDischargeTime",
    definitionName: "HospitalDischargeTime",
    definitionLogic:
      'define function "HospitalDischargeTime"(Encounter "Encounter, Performed" ):\n  end of Encounter.relevantPeriod',
    context: "Patient",
    supplDataElement: false,
    popDefinition: false,
    commentString: "",
    returnType: null,
    parentLibrary: "MATGlobalCommonFunctionsQDM",
    libraryDisplayName: "Global",
    libraryVersion: "1.0.000",
    name: "HospitalDischargeTime",
    function: true,
    logic:
      'define function "HospitalDischargeTime"(Encounter "Encounter, Performed" ):\n  end of Encounter.relevantPeriod',
  },
  {
    id: "SDE Sex",
    definitionName: "SDE Sex",
    definitionLogic:
      'define "SDE Sex":\n  ["Patient Characteristic Sex": "ONC Administrative Sex"]',
    context: "Patient",
    supplDataElement: false,
    popDefinition: false,
    commentString: "",
    returnType: null,
    parentLibrary: null,
    libraryDisplayName: null,
    libraryVersion: null,
    name: "SDE Sex",
    function: false,
    logic:
      'define "SDE Sex":\n  ["Patient Characteristic Sex": "ONC Administrative Sex"]',
  },
  {
    id: "MATGlobalCommonFunctionsQDM-1.0.000|Global|HasEnd",
    definitionName: "HasEnd",
    definitionLogic:
      'define function "HasEnd"(period Interval<DateTime> ):\n  not ( \n    end of period is null\n      or \n      end of period = maximum DateTime\n  )',
    context: "Patient",
    supplDataElement: false,
    popDefinition: false,
    commentString: "",
    returnType: null,
    parentLibrary: "MATGlobalCommonFunctionsQDM",
    libraryDisplayName: "Global",
    libraryVersion: "1.0.000",
    name: "HasEnd",
    function: true,
    logic:
      'define function "HasEnd"(period Interval<DateTime> ):\n  not ( \n    end of period is null\n      or \n      end of period = maximum DateTime\n  )',
  },
  {
    id: "LengthOfStay",
    definitionName: "LengthOfStay",
    definitionLogic:
      'define function "LengthOfStay"(Stay Interval<DateTime> ):\n  difference in days between start of Stay and \n  end of Stay',
    context: "Patient",
    supplDataElement: false,
    popDefinition: false,
    commentString: "",
    returnType: null,
    parentLibrary: null,
    libraryDisplayName: null,
    libraryVersion: null,
    name: "LengthOfStay",
    function: true,
    logic:
      'define function "LengthOfStay"(Stay Interval<DateTime> ):\n  difference in days between start of Stay and \n  end of Stay',
  },
  {
    id: "MATGlobalCommonFunctionsQDM-1.0.000|Global|ToDateInterval",
    definitionName: "ToDateInterval",
    definitionLogic:
      'define function "ToDateInterval"(period Interval<DateTime> ):\n  Interval[date from start of period, date from end of period]',
    context: "Patient",
    supplDataElement: false,
    popDefinition: false,
    commentString: "",
    returnType: null,
    parentLibrary: "MATGlobalCommonFunctionsQDM",
    libraryDisplayName: "Global",
    libraryVersion: "1.0.000",
    name: "ToDateInterval",
    function: true,
    logic:
      'define function "ToDateInterval"(period Interval<DateTime> ):\n  Interval[date from start of period, date from end of period]',
  },
  {
    id: "MATGlobalCommonFunctionsQDM-1.0.000|Global|HasStart",
    definitionName: "HasStart",
    definitionLogic:
      'define function "HasStart"(period Interval<DateTime> ):\n  not ( start of period is null\n      or start of period = minimum DateTime\n  )',
    context: "Patient",
    supplDataElement: false,
    popDefinition: false,
    commentString: "",
    returnType: null,
    parentLibrary: "MATGlobalCommonFunctionsQDM",
    libraryDisplayName: "Global",
    libraryVersion: "1.0.000",
    name: "HasStart",
    function: true,
    logic:
      'define function "HasStart"(period Interval<DateTime> ):\n  not ( start of period is null\n      or start of period = minimum DateTime\n  )',
  },
  {
    id: "MATGlobalCommonFunctionsQDM-1.0.000|Global|LengthInDays",
    definitionName: "LengthInDays",
    definitionLogic:
      'define function "LengthInDays"(Value Interval<DateTime> ):\n  difference in days between start of Value and end of Value',
    context: "Patient",
    supplDataElement: false,
    popDefinition: false,
    commentString: "",
    returnType: null,
    parentLibrary: "MATGlobalCommonFunctionsQDM",
    libraryDisplayName: "Global",
    libraryVersion: "1.0.000",
    name: "LengthInDays",
    function: true,
    logic:
      'define function "LengthInDays"(Value Interval<DateTime> ):\n  difference in days between start of Value and end of Value',
  },
  {
    id: "Initial Population",
    definitionName: "Initial Population",
    definitionLogic: 'define "Initial Population":\n  "Inpatient Encounters"',
    context: "Patient",
    supplDataElement: false,
    popDefinition: false,
    commentString: "",
    returnType: null,
    parentLibrary: null,
    libraryDisplayName: null,
    libraryVersion: null,
    name: "Initial Population",
    function: false,
    logic: 'define "Initial Population":\n  "Inpatient Encounters"',
  },
  {
    id: "FirstPhysicalExamWithEncounterId",
    definitionName: "FirstPhysicalExamWithEncounterId",
    definitionLogic:
      'define function "FirstPhysicalExamWithEncounterId"(ExamList List<QDM.PositivePhysicalExamPerformed> ):\n  "Inpatient Encounters" Encounter\n    let FirstExam: First(ExamList Exam\n        where Global."EarliestOf"(Exam.relevantDatetime, Exam.relevantPeriod)during Interval[start of Encounter.relevantPeriod - 1440 minutes, start of Encounter.relevantPeriod + 120 minutes]\n        sort by Global."EarliestOf"(relevantDatetime, relevantPeriod)\n    )\n    return {\n      EncounterId: Encounter.id,\n      FirstResult: FirstExam.result as Quantity,\n      Timing: Global."EarliestOf" ( FirstExam.relevantDatetime, FirstExam.relevantPeriod )\n    }',
    context: "Patient",
    supplDataElement: false,
    popDefinition: false,
    commentString: "",
    returnType: null,
    parentLibrary: null,
    libraryDisplayName: null,
    libraryVersion: null,
    name: "FirstPhysicalExamWithEncounterId",
    function: true,
    logic:
      'define function "FirstPhysicalExamWithEncounterId"(ExamList List<QDM.PositivePhysicalExamPerformed> ):\n  "Inpatient Encounters" Encounter\n    let FirstExam: First(ExamList Exam\n        where Global."EarliestOf"(Exam.relevantDatetime, Exam.relevantPeriod)during Interval[start of Encounter.relevantPeriod - 1440 minutes, start of Encounter.relevantPeriod + 120 minutes]\n        sort by Global."EarliestOf"(relevantDatetime, relevantPeriod)\n    )\n    return {\n      EncounterId: Encounter.id,\n      FirstResult: FirstExam.result as Quantity,\n      Timing: Global."EarliestOf" ( FirstExam.relevantDatetime, FirstExam.relevantPeriod )\n    }',
  },
  {
    id: "FirstLabTestWithEncounterId",
    definitionName: "FirstLabTestWithEncounterId",
    definitionLogic:
      'define function "FirstLabTestWithEncounterId"(LabList List<QDM.PositiveLaboratoryTestPerformed> ):\n  "Inpatient Encounters" Encounter\n    let FirstLab: First(LabList Lab\n        where Lab.resultDatetime during Interval[start of Encounter.relevantPeriod - 1440 minutes, start of Encounter.relevantPeriod + 1440 minutes]\n        sort by resultDatetime\n    )\n    return {\n      EncounterId: Encounter.id,\n      FirstResult: FirstLab.result as Quantity,\n      Timing: FirstLab.resultDatetime\n    }',
    context: "Patient",
    supplDataElement: false,
    popDefinition: false,
    commentString: "",
    returnType: null,
    parentLibrary: null,
    libraryDisplayName: null,
    libraryVersion: null,
    name: "FirstLabTestWithEncounterId",
    function: true,
    logic:
      'define function "FirstLabTestWithEncounterId"(LabList List<QDM.PositiveLaboratoryTestPerformed> ):\n  "Inpatient Encounters" Encounter\n    let FirstLab: First(LabList Lab\n        where Lab.resultDatetime during Interval[start of Encounter.relevantPeriod - 1440 minutes, start of Encounter.relevantPeriod + 1440 minutes]\n        sort by resultDatetime\n    )\n    return {\n      EncounterId: Encounter.id,\n      FirstResult: FirstLab.result as Quantity,\n      Timing: FirstLab.resultDatetime\n    }',
  },
  {
    id: "MATGlobalCommonFunctionsQDM-1.0.000|Global|Hospitalization",
    definitionName: "Hospitalization",
    definitionLogic:
      'define function "Hospitalization"(Encounter "Encounter, Performed" ):\n  Encounter Visit\n  \tlet EDVisit: Last(["Encounter, Performed": "Emergency Department Visit"] LastED\n  \t\t\twhere LastED.relevantPeriod ends 1 hour or less on or before start of Visit.relevantPeriod\n  \t\t\tsort by \n  \t\t\tend of relevantPeriod\n  \t)\n  \treturn Interval[Coalesce(start of EDVisit.relevantPeriod, start of Visit.relevantPeriod), \n  \tend of Visit.relevantPeriod]',
    context: "Patient",
    supplDataElement: false,
    popDefinition: false,
    commentString: "",
    returnType: null,
    parentLibrary: "MATGlobalCommonFunctionsQDM",
    libraryDisplayName: "Global",
    libraryVersion: "1.0.000",
    name: "Hospitalization",
    function: true,
    logic:
      'define function "Hospitalization"(Encounter "Encounter, Performed" ):\n  Encounter Visit\n  \tlet EDVisit: Last(["Encounter, Performed": "Emergency Department Visit"] LastED\n  \t\t\twhere LastED.relevantPeriod ends 1 hour or less on or before start of Visit.relevantPeriod\n  \t\t\tsort by \n  \t\t\tend of relevantPeriod\n  \t)\n  \treturn Interval[Coalesce(start of EDVisit.relevantPeriod, start of Visit.relevantPeriod), \n  \tend of Visit.relevantPeriod]',
  },
  {
    id: "MATGlobalCommonFunctionsQDM-1.0.000|Global|Latest",
    definitionName: "Latest",
    definitionLogic:
      'define function "Latest"(period Interval<DateTime> ):\n  if ( HasEnd(period)) then \n  end of period \n    else start of period',
    context: "Patient",
    supplDataElement: false,
    popDefinition: false,
    commentString: "",
    returnType: null,
    parentLibrary: "MATGlobalCommonFunctionsQDM",
    libraryDisplayName: "Global",
    libraryVersion: "1.0.000",
    name: "Latest",
    function: true,
    logic:
      'define function "Latest"(period Interval<DateTime> ):\n  if ( HasEnd(period)) then \n  end of period \n    else start of period',
  },
  {
    id: "MATGlobalCommonFunctionsQDM-1.0.000|Global|HospitalizationWithObservation",
    definitionName: "HospitalizationWithObservation",
    definitionLogic:
      'define function "HospitalizationWithObservation"(Encounter "Encounter, Performed" ):\n  Encounter Visit\n  \tlet ObsVisit: Last(["Encounter, Performed": "Observation Services"] LastObs\n  \t\t\twhere LastObs.relevantPeriod ends 1 hour or less on or before start of Visit.relevantPeriod\n  \t\t\tsort by \n  \t\t\tend of relevantPeriod\n  \t),\n  \tVisitStart: Coalesce(start of ObsVisit.relevantPeriod, start of Visit.relevantPeriod),\n  \tEDVisit: Last(["Encounter, Performed": "Emergency Department Visit"] LastED\n  \t\t\twhere LastED.relevantPeriod ends 1 hour or less on or before VisitStart\n  \t\t\tsort by \n  \t\t\tend of relevantPeriod\n  \t)\n  \treturn Interval[Coalesce(start of EDVisit.relevantPeriod, VisitStart), \n  \tend of Visit.relevantPeriod]',
    context: "Patient",
    supplDataElement: false,
    popDefinition: false,
    commentString: "",
    returnType: null,
    parentLibrary: "MATGlobalCommonFunctionsQDM",
    libraryDisplayName: "Global",
    libraryVersion: "1.0.000",
    name: "HospitalizationWithObservation",
    function: true,
    logic:
      'define function "HospitalizationWithObservation"(Encounter "Encounter, Performed" ):\n  Encounter Visit\n  \tlet ObsVisit: Last(["Encounter, Performed": "Observation Services"] LastObs\n  \t\t\twhere LastObs.relevantPeriod ends 1 hour or less on or before start of Visit.relevantPeriod\n  \t\t\tsort by \n  \t\t\tend of relevantPeriod\n  \t),\n  \tVisitStart: Coalesce(start of ObsVisit.relevantPeriod, start of Visit.relevantPeriod),\n  \tEDVisit: Last(["Encounter, Performed": "Emergency Department Visit"] LastED\n  \t\t\twhere LastED.relevantPeriod ends 1 hour or less on or before VisitStart\n  \t\t\tsort by \n  \t\t\tend of relevantPeriod\n  \t)\n  \treturn Interval[Coalesce(start of EDVisit.relevantPeriod, VisitStart), \n  \tend of Visit.relevantPeriod]',
  },
  {
    id: "MATGlobalCommonFunctionsQDM-1.0.000|Global|NormalizeInterval",
    definitionName: "NormalizeInterval",
    definitionLogic:
      'define function "NormalizeInterval"(pointInTime DateTime, period Interval<DateTime> ):\n  if pointInTime is not null then Interval[pointInTime, pointInTime]\n    else if period is not null then period \n    else null as Interval<DateTime>',
    context: "Patient",
    supplDataElement: false,
    popDefinition: false,
    commentString: "",
    returnType: null,
    parentLibrary: "MATGlobalCommonFunctionsQDM",
    libraryDisplayName: "Global",
    libraryVersion: "1.0.000",
    name: "NormalizeInterval",
    function: true,
    logic:
      'define function "NormalizeInterval"(pointInTime DateTime, period Interval<DateTime> ):\n  if pointInTime is not null then Interval[pointInTime, pointInTime]\n    else if period is not null then period \n    else null as Interval<DateTime>',
  },
  {
    id: "SDE Ethnicity",
    definitionName: "SDE Ethnicity",
    definitionLogic:
      'define "SDE Ethnicity":\n  ["Patient Characteristic Ethnicity": "Ethnicity"]',
    context: "Patient",
    supplDataElement: false,
    popDefinition: false,
    commentString: "",
    returnType: null,
    parentLibrary: null,
    libraryDisplayName: null,
    libraryVersion: null,
    name: "SDE Ethnicity",
    function: false,
    logic:
      'define "SDE Ethnicity":\n  ["Patient Characteristic Ethnicity": "Ethnicity"]',
  },
  {
    id: "SDE Payer",
    definitionName: "SDE Payer",
    definitionLogic:
      'define "SDE Payer":\n  ["Patient Characteristic Payer": "Payer"]',
    context: "Patient",
    supplDataElement: false,
    popDefinition: false,
    commentString: "",
    returnType: null,
    parentLibrary: null,
    libraryDisplayName: null,
    libraryVersion: null,
    name: "SDE Payer",
    function: false,
    logic: 'define "SDE Payer":\n  ["Patient Characteristic Payer": "Payer"]',
  },
  {
    id: "MATGlobalCommonFunctionsQDM-1.0.000|Global|LatestOf",
    definitionName: "LatestOf",
    definitionLogic:
      'define function "LatestOf"(pointInTime DateTime, period Interval<DateTime> ):\n  Latest(NormalizeInterval(pointInTime, period))',
    context: "Patient",
    supplDataElement: false,
    popDefinition: false,
    commentString: "",
    returnType: null,
    parentLibrary: "MATGlobalCommonFunctionsQDM",
    libraryDisplayName: "Global",
    libraryVersion: "1.0.000",
    name: "LatestOf",
    function: true,
    logic:
      'define function "LatestOf"(pointInTime DateTime, period Interval<DateTime> ):\n  Latest(NormalizeInterval(pointInTime, period))',
  },
];