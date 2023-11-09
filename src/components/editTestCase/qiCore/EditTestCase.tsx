import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import EditTestCaseBreadCrumbs from "../EditTestCaseBreadCrumbs";

import tw, { styled } from "twin.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationCircle,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import "styled-components/macro";
import {
  Group,
  TestCase,
  GroupPopulation,
  HapiOperationOutcome,
  PopulationExpectedValue,
  MeasureErrorType,
} from "@madie/madie-models";
import useTestCaseServiceApi from "../../../api/useTestCaseServiceApi";
import Editor from "../../editor/Editor";
import { TestCaseValidator } from "../../../validators/TestCaseValidator";
import { MadieError, sanitizeUserInput } from "../../../util/Utils";
import TestCaseSeries from "../../createTestCase/TestCaseSeries";
import * as _ from "lodash";
import { Ace } from "ace-builds";
import {
  FHIR_POPULATION_CODES,
  mapExistingTestCasePopulations,
  getPopulationTypesForScoring,
  triggerPopChanges,
} from "../../../util/PopulationsMap";
import calculationService, {
  PopulationEpisodeResult,
} from "../../../api/CalculationService";
import {
  CalculationOutput,
  DetailedPopulationGroupResult,
} from "fqm-execution/build/types/Calculator";
import {
  measureStore,
  routeHandlerStore,
  useDocumentTitle,
  checkUserCanEdit,
  useFeatureFlags,
} from "@madie/madie-util";
import useExecutionContext from "../../routes/qiCore/useExecutionContext";
import { MadieEditor } from "@madie/madie-editor";
import CreateTestCaseRightPanelNavTabs from "../../createTestCase/CreateTestCaseRightPanelNavTabs";
import CreateTestCaseLeftPanelNavTabs from "../../createTestCase/CreateTestCaseLeftPanelNavTabs";
import ExpectedActual from "../../createTestCase/RightPanel/ExpectedActual/ExpectedActual";
import "./EditTestCase.scss";
import "allotment/dist/style.css";
import CalculationResults from "./calculationResults/CalculationResults";
import {
  Button,
  TextField,
  MadieAlert,
  MadieSpinner,
  MadieDiscardDialog,
  Toast,
} from "@madie/madie-design-system/dist/react";
import TextArea from "../../createTestCase/TextArea";
import FileUploader from "../../fileUploader/FileUploader";
import { ScanValidationDto } from "../../../api/models/ScanValidationDto";
import { Bundle } from "fhir/r4";
import { Allotment } from "allotment";
import ElementsTab from "./LeftPanel/ElementsTab/ElementsTab";
import { QiCoreResourceProvider } from "../../../util/QiCorePatientProvider";
import { CqlDefinitionCallstack } from "../groupCoverage/GroupCoverage";

const callstackMap: CqlDefinitionCallstack = {
  "AHAOverall-2.5.000|AHA|Has Two Qualifying Outpatient Encounters and Heart Failure Outpatient Encounter During the Measurement Period":
    [
      {
        id: "AHAOverall-2.5.000|AHA|Qualifying Outpatient Encounter During Measurement Period",
        definitionName:
          "Qualifying Outpatient Encounter During Measurement Period",
        definitionLogic:
          'define "Qualifying Outpatient Encounter During Measurement Period":\n    ( [Encounter: "Care Services in Long Term Residential Facility"]\n              union [Encounter: "Home Healthcare Services"]\n              union [Encounter: "Nursing Facility Visit"]\n              union [Encounter: "Office Visit"]\n              union [Encounter: "Outpatient Consultation"]\n              union [Encounter: "Patient Provider Interaction"]\n     ) ValidEncounter\n      where ValidEncounter.period during "Measurement Period"\n        and ValidEncounter.isFinished()',
        context: "Patient",
        supplDataElement: false,
        popDefinition: false,
        commentString: "",
        returnType: null,
        parentLibrary: "AHAOverall",
        libraryDisplayName: "AHA",
        libraryVersion: "2.5.000",
        name: "Qualifying Outpatient Encounter During Measurement Period",
        logic:
          'define "Qualifying Outpatient Encounter During Measurement Period":\n    ( [Encounter: "Care Services in Long Term Residential Facility"]\n              union [Encounter: "Home Healthcare Services"]\n              union [Encounter: "Nursing Facility Visit"]\n              union [Encounter: "Office Visit"]\n              union [Encounter: "Outpatient Consultation"]\n              union [Encounter: "Patient Provider Interaction"]\n     ) ValidEncounter\n      where ValidEncounter.period during "Measurement Period"\n        and ValidEncounter.isFinished()',
      },
      {
        id: "AHAOverall-2.5.000|AHA|Heart Failure Outpatient Encounter",
        definitionName: "Heart Failure Outpatient Encounter",
        definitionLogic:
          'define "Heart Failure Outpatient Encounter":\n  ( [Encounter: "Care Services in Long Term Residential Facility"]\n      union [Encounter: "Home Healthcare Services"]\n      union [Encounter: "Nursing Facility Visit"]\n      union [Encounter: "Office Visit"]\n      union [Encounter: "Outpatient Consultation"]\n     ) QualifyingEncounter\n    with [Condition: "Heart Failure"] HeartFailure\n      such that HeartFailure.prevalenceInterval() overlaps QualifyingEncounter.period  \n        and HeartFailure.isConfirmedActiveDiagnosis()\n    where QualifyingEncounter.period during "Measurement Period"\n      and QualifyingEncounter.isFinished()',
        context: "Patient",
        supplDataElement: false,
        popDefinition: false,
        commentString: "",
        returnType: null,
        parentLibrary: "AHAOverall",
        libraryDisplayName: "AHA",
        libraryVersion: "2.5.000",
        name: "Heart Failure Outpatient Encounter",
        logic:
          'define "Heart Failure Outpatient Encounter":\n  ( [Encounter: "Care Services in Long Term Residential Facility"]\n      union [Encounter: "Home Healthcare Services"]\n      union [Encounter: "Nursing Facility Visit"]\n      union [Encounter: "Office Visit"]\n      union [Encounter: "Outpatient Consultation"]\n     ) QualifyingEncounter\n    with [Condition: "Heart Failure"] HeartFailure\n      such that HeartFailure.prevalenceInterval() overlaps QualifyingEncounter.period  \n        and HeartFailure.isConfirmedActiveDiagnosis()\n    where QualifyingEncounter.period during "Measurement Period"\n      and QualifyingEncounter.isFinished()',
      },
    ],
  "FHIRHelpers-4.3.000|FHIRHelpers|ToValue": [
    {
      id: "FHIRHelpers-4.3.000|FHIRHelpers|ToInterval",
      definitionName: "ToInterval",
      definitionLogic: null,
      context: "Patient",
      supplDataElement: false,
      popDefinition: false,
      commentString: "",
      returnType: null,
      parentLibrary: "FHIRHelpers",
      libraryDisplayName: "FHIRHelpers",
      libraryVersion: "4.3.000",
      name: "ToInterval",
      logic: null,
    },
    {
      id: "FHIRHelpers-4.3.000|FHIRHelpers|ToQuantity",
      definitionName: "ToQuantity",
      definitionLogic: null,
      context: "Patient",
      supplDataElement: false,
      popDefinition: false,
      commentString: "",
      returnType: null,
      parentLibrary: "FHIRHelpers",
      libraryDisplayName: "FHIRHelpers",
      libraryVersion: "4.3.000",
      name: "ToQuantity",
      logic: null,
    },
    {
      id: "FHIRHelpers-4.3.000|FHIRHelpers|ToRatio",
      definitionName: "ToRatio",
      definitionLogic: null,
      context: "Patient",
      supplDataElement: false,
      popDefinition: false,
      commentString: "",
      returnType: null,
      parentLibrary: "FHIRHelpers",
      libraryDisplayName: "FHIRHelpers",
      libraryVersion: "4.3.000",
      name: "ToRatio",
      logic: null,
    },
    {
      id: "FHIRHelpers-4.3.000|FHIRHelpers|ToConcept",
      definitionName: "ToConcept",
      definitionLogic: null,
      context: "Patient",
      supplDataElement: false,
      popDefinition: false,
      commentString: "",
      returnType: null,
      parentLibrary: "FHIRHelpers",
      libraryDisplayName: "FHIRHelpers",
      libraryVersion: "4.3.000",
      name: "ToConcept",
      logic: null,
    },
  ],
  "FHIRHelpers-4.3.000|FHIRHelpers|ToRatio": [
    {
      id: "FHIRHelpers-4.3.000|FHIRHelpers|ToQuantity",
      definitionName: "ToQuantity",
      definitionLogic: null,
      context: "Patient",
      supplDataElement: false,
      popDefinition: false,
      commentString: "",
      returnType: null,
      parentLibrary: "FHIRHelpers",
      libraryDisplayName: "FHIRHelpers",
      libraryVersion: "4.3.000",
      name: "ToQuantity",
      logic: null,
    },
  ],
  "AHAOverall-2.5.000|AHA|Moderate or Severe LVSD Dates": [
    {
      id: "AHAOverall-2.5.000|AHA|isConfirmedActiveDiagnosis",
      definitionName: "isConfirmedActiveDiagnosis",
      definitionLogic: null,
      context: "Patient",
      supplDataElement: false,
      popDefinition: false,
      commentString: "",
      returnType: null,
      parentLibrary: "AHAOverall",
      libraryDisplayName: "AHA",
      libraryVersion: "2.5.000",
      name: "isConfirmedActiveDiagnosis",
      logic: null,
    },
  ],
  "AHAOverall-2.5.000|AHA|overlapsAfterHeartFailureOutpatientEncounter": [
    {
      id: "AHAOverall-2.5.000|AHA|Heart Failure Outpatient Encounter with History of Moderate or Severe LVSD",
      definitionName:
        "Heart Failure Outpatient Encounter with History of Moderate or Severe LVSD",
      definitionLogic:
        'define "Heart Failure Outpatient Encounter with History of Moderate or Severe LVSD":\n    "Heart Failure Outpatient Encounter" HFOutpatientEncounter\n        with "Moderate or Severe LVSD Dates" ModerateSevereLVSDDate\n            such that ModerateSevereLVSDDate before end of HFOutpatientEncounter.period',
      context: "Patient",
      supplDataElement: false,
      popDefinition: false,
      commentString: "",
      returnType: null,
      parentLibrary: "AHAOverall",
      libraryDisplayName: "AHA",
      libraryVersion: "2.5.000",
      name: "Heart Failure Outpatient Encounter with History of Moderate or Severe LVSD",
      logic:
        'define "Heart Failure Outpatient Encounter with History of Moderate or Severe LVSD":\n    "Heart Failure Outpatient Encounter" HFOutpatientEncounter\n        with "Moderate or Severe LVSD Dates" ModerateSevereLVSDDate\n            such that ModerateSevereLVSDDate before end of HFOutpatientEncounter.period',
    },
    {
      id: "AHAOverall-2.5.000|AHA|isConfirmedActiveDiagnosis",
      definitionName: "isConfirmedActiveDiagnosis",
      definitionLogic: null,
      context: "Patient",
      supplDataElement: false,
      popDefinition: false,
      commentString: "",
      returnType: null,
      parentLibrary: "AHAOverall",
      libraryDisplayName: "AHA",
      libraryVersion: "2.5.000",
      name: "isConfirmedActiveDiagnosis",
      logic: null,
    },
  ],
  Numerator: [
    {
      id: "Is Currently Taking ACEI or ARB or ARNI",
      definitionName: "Is Currently Taking ACEI or ARB or ARNI",
      definitionLogic:
        'define "Is Currently Taking ACEI or ARB or ARNI":\n  exists (\n          [MedicationRequest: medication in "ACE Inhibitor or ARB or ARNI"] ActiveACEIOrARBOrARNI\n            where ActiveACEIOrARBOrARNI.overlapsAfterHeartFailureOutpatientEncounter()\n          )',
      context: "Patient",
      supplDataElement: false,
      popDefinition: false,
      commentString: "",
      returnType: null,
      parentLibrary: null,
      libraryDisplayName: null,
      libraryVersion: null,
      name: "Is Currently Taking ACEI or ARB or ARNI",
      logic:
        'define "Is Currently Taking ACEI or ARB or ARNI":\n  exists (\n          [MedicationRequest: medication in "ACE Inhibitor or ARB or ARNI"] ActiveACEIOrARBOrARNI\n            where ActiveACEIOrARBOrARNI.overlapsAfterHeartFailureOutpatientEncounter()\n          )',
    },
    {
      id: "Has ACEI or ARB or ARNI Ordered",
      definitionName: "Has ACEI or ARB or ARNI Ordered",
      definitionLogic:
        'define "Has ACEI or ARB or ARNI Ordered":\n  exists ( \n            [MedicationRequest: medication in "ACE Inhibitor or ARB or ARNI"] ACEIOrARBOrARNIOrdered\n             where ACEIOrARBOrARNIOrdered.isOrderedDuringHeartFailureOutpatientEncounter()\n           )',
      context: "Patient",
      supplDataElement: false,
      popDefinition: false,
      commentString: "",
      returnType: null,
      parentLibrary: null,
      libraryDisplayName: null,
      libraryVersion: null,
      name: "Has ACEI or ARB or ARNI Ordered",
      logic:
        'define "Has ACEI or ARB or ARNI Ordered":\n  exists ( \n            [MedicationRequest: medication in "ACE Inhibitor or ARB or ARNI"] ACEIOrARBOrARNIOrdered\n             where ACEIOrARBOrARNIOrdered.isOrderedDuringHeartFailureOutpatientEncounter()\n           )',
    },
  ],
  "AHAOverall-2.5.000|AHA|Has Left Ventricular Assist Device": [
    {
      id: "AHAOverall-2.5.000|AHA|Heart Failure Outpatient Encounter with History of Moderate or Severe LVSD",
      definitionName:
        "Heart Failure Outpatient Encounter with History of Moderate or Severe LVSD",
      definitionLogic:
        'define "Heart Failure Outpatient Encounter with History of Moderate or Severe LVSD":\n    "Heart Failure Outpatient Encounter" HFOutpatientEncounter\n        with "Moderate or Severe LVSD Dates" ModerateSevereLVSDDate\n            such that ModerateSevereLVSDDate before end of HFOutpatientEncounter.period',
      context: "Patient",
      supplDataElement: false,
      popDefinition: false,
      commentString: "",
      returnType: null,
      parentLibrary: "AHAOverall",
      libraryDisplayName: "AHA",
      libraryVersion: "2.5.000",
      name: "Heart Failure Outpatient Encounter with History of Moderate or Severe LVSD",
      logic:
        'define "Heart Failure Outpatient Encounter with History of Moderate or Severe LVSD":\n    "Heart Failure Outpatient Encounter" HFOutpatientEncounter\n        with "Moderate or Severe LVSD Dates" ModerateSevereLVSDDate\n            such that ModerateSevereLVSDDate before end of HFOutpatientEncounter.period',
    },
  ],
  "AHAOverall-2.5.000|AHA|Has Heart Transplant": [
    {
      id: "AHAOverall-2.5.000|AHA|Heart Failure Outpatient Encounter with History of Moderate or Severe LVSD",
      definitionName:
        "Heart Failure Outpatient Encounter with History of Moderate or Severe LVSD",
      definitionLogic:
        'define "Heart Failure Outpatient Encounter with History of Moderate or Severe LVSD":\n    "Heart Failure Outpatient Encounter" HFOutpatientEncounter\n        with "Moderate or Severe LVSD Dates" ModerateSevereLVSDDate\n            such that ModerateSevereLVSDDate before end of HFOutpatientEncounter.period',
      context: "Patient",
      supplDataElement: false,
      popDefinition: false,
      commentString: "",
      returnType: null,
      parentLibrary: "AHAOverall",
      libraryDisplayName: "AHA",
      libraryVersion: "2.5.000",
      name: "Heart Failure Outpatient Encounter with History of Moderate or Severe LVSD",
      logic:
        'define "Heart Failure Outpatient Encounter with History of Moderate or Severe LVSD":\n    "Heart Failure Outpatient Encounter" HFOutpatientEncounter\n        with "Moderate or Severe LVSD Dates" ModerateSevereLVSDDate\n            such that ModerateSevereLVSDDate before end of HFOutpatientEncounter.period',
    },
  ],
  Denominator: [
    {
      id: "Initial Population",
      definitionName: "Initial Population",
      definitionLogic:
        'define "Initial Population":\n    AHA."Has Two Qualifying Outpatient Encounters and Heart Failure Outpatient Encounter During the Measurement Period"',
      context: "Patient",
      supplDataElement: false,
      popDefinition: false,
      commentString: "",
      returnType: null,
      parentLibrary: null,
      libraryDisplayName: null,
      libraryVersion: null,
      name: "Initial Population",
      logic:
        'define "Initial Population":\n    AHA."Has Two Qualifying Outpatient Encounters and Heart Failure Outpatient Encounter During the Measurement Period"',
    },
    {
      id: "AHAOverall-2.5.000|AHA|Heart Failure Outpatient Encounter with History of Moderate or Severe LVSD",
      definitionName:
        "Heart Failure Outpatient Encounter with History of Moderate or Severe LVSD",
      definitionLogic:
        'define "Heart Failure Outpatient Encounter with History of Moderate or Severe LVSD":\n    "Heart Failure Outpatient Encounter" HFOutpatientEncounter\n        with "Moderate or Severe LVSD Dates" ModerateSevereLVSDDate\n            such that ModerateSevereLVSDDate before end of HFOutpatientEncounter.period',
      context: "Patient",
      supplDataElement: false,
      popDefinition: false,
      commentString: "",
      returnType: null,
      parentLibrary: "AHAOverall",
      libraryDisplayName: "AHA",
      libraryVersion: "2.5.000",
      name: "Heart Failure Outpatient Encounter with History of Moderate or Severe LVSD",
      logic:
        'define "Heart Failure Outpatient Encounter with History of Moderate or Severe LVSD":\n    "Heart Failure Outpatient Encounter" HFOutpatientEncounter\n        with "Moderate or Severe LVSD Dates" ModerateSevereLVSDDate\n            such that ModerateSevereLVSDDate before end of HFOutpatientEncounter.period',
    },
  ],
  "AHAOverall-2.5.000|AHA|isOrderedDuringHeartFailureOutpatientEncounter": [
    {
      id: "AHAOverall-2.5.000|AHA|Heart Failure Outpatient Encounter with History of Moderate or Severe LVSD",
      definitionName:
        "Heart Failure Outpatient Encounter with History of Moderate or Severe LVSD",
      definitionLogic:
        'define "Heart Failure Outpatient Encounter with History of Moderate or Severe LVSD":\n    "Heart Failure Outpatient Encounter" HFOutpatientEncounter\n        with "Moderate or Severe LVSD Dates" ModerateSevereLVSDDate\n            such that ModerateSevereLVSDDate before end of HFOutpatientEncounter.period',
      context: "Patient",
      supplDataElement: false,
      popDefinition: false,
      commentString: "",
      returnType: null,
      parentLibrary: "AHAOverall",
      libraryDisplayName: "AHA",
      libraryVersion: "2.5.000",
      name: "Heart Failure Outpatient Encounter with History of Moderate or Severe LVSD",
      logic:
        'define "Heart Failure Outpatient Encounter with History of Moderate or Severe LVSD":\n    "Heart Failure Outpatient Encounter" HFOutpatientEncounter\n        with "Moderate or Severe LVSD Dates" ModerateSevereLVSDDate\n            such that ModerateSevereLVSDDate before end of HFOutpatientEncounter.period',
    },
  ],
  "SDE Payer": [
    {
      id: "SupplementalDataElements-3.4.000|SDE|SDE Payer",
      definitionName: "SDE Payer",
      definitionLogic:
        'define "SDE Payer":\r\n  [Coverage: type in "Payer Type"] Payer\r\n    return {\r\n      code: Payer.type,\r\n      period: Payer.period\r\n    }',
      context: "Patient",
      supplDataElement: false,
      popDefinition: false,
      commentString: "",
      returnType: null,
      parentLibrary: "SupplementalDataElements",
      libraryDisplayName: "SDE",
      libraryVersion: "3.4.000",
      name: "SDE Payer",
      logic:
        'define "SDE Payer":\r\n  [Coverage: type in "Payer Type"] Payer\r\n    return {\r\n      code: Payer.type,\r\n      period: Payer.period\r\n    }',
    },
  ],
  "AHAOverall-2.5.000|AHA|Has Heart Transplant Complications": [
    {
      id: "AHAOverall-2.5.000|AHA|Heart Failure Outpatient Encounter with History of Moderate or Severe LVSD",
      definitionName:
        "Heart Failure Outpatient Encounter with History of Moderate or Severe LVSD",
      definitionLogic:
        'define "Heart Failure Outpatient Encounter with History of Moderate or Severe LVSD":\n    "Heart Failure Outpatient Encounter" HFOutpatientEncounter\n        with "Moderate or Severe LVSD Dates" ModerateSevereLVSDDate\n            such that ModerateSevereLVSDDate before end of HFOutpatientEncounter.period',
      context: "Patient",
      supplDataElement: false,
      popDefinition: false,
      commentString: "",
      returnType: null,
      parentLibrary: "AHAOverall",
      libraryDisplayName: "AHA",
      libraryVersion: "2.5.000",
      name: "Heart Failure Outpatient Encounter with History of Moderate or Severe LVSD",
      logic:
        'define "Heart Failure Outpatient Encounter with History of Moderate or Severe LVSD":\n    "Heart Failure Outpatient Encounter" HFOutpatientEncounter\n        with "Moderate or Severe LVSD Dates" ModerateSevereLVSDDate\n            such that ModerateSevereLVSDDate before end of HFOutpatientEncounter.period',
    },
    {
      id: "AHAOverall-2.5.000|AHA|isConfirmedActiveDiagnosis",
      definitionName: "isConfirmedActiveDiagnosis",
      definitionLogic: null,
      context: "Patient",
      supplDataElement: false,
      popDefinition: false,
      commentString: "",
      returnType: null,
      parentLibrary: "AHAOverall",
      libraryDisplayName: "AHA",
      libraryVersion: "2.5.000",
      name: "isConfirmedActiveDiagnosis",
      logic: null,
    },
  ],
  "AHAOverall-2.5.000|AHA|Heart Failure Outpatient Encounter": [
    {
      id: "AHAOverall-2.5.000|AHA|isConfirmedActiveDiagnosis",
      definitionName: "isConfirmedActiveDiagnosis",
      definitionLogic: null,
      context: "Patient",
      supplDataElement: false,
      popDefinition: false,
      commentString: "",
      returnType: null,
      parentLibrary: "AHAOverall",
      libraryDisplayName: "AHA",
      libraryVersion: "2.5.000",
      name: "isConfirmedActiveDiagnosis",
      logic: null,
    },
  ],
  "AHAOverall-2.5.000|AHA|Heart Failure Outpatient Encounter with History of Moderate or Severe LVSD":
    [
      {
        id: "AHAOverall-2.5.000|AHA|Moderate or Severe LVSD Dates",
        definitionName: "Moderate or Severe LVSD Dates",
        definitionLogic:
          'define "Moderate or Severe LVSD Dates":\n    ( [Observation: "Ejection Fraction"] EjectionFraction\n        let dateOfFinding: start of ( EjectionFraction Fraction\n                                 where Fraction.value as Quantity <= 40 \'%\'\n                                   and Fraction.status in {\'final\', \'amended\', \'corrected\'} \n                                 return Fraction.effective.toInterval()\n                                   )\n        return dateOfFinding \n      )\n    union\n    ( \n        ( [Condition: "Moderate or Severe LVSD"]\n            union ( [Condition: "Left ventricular systolic dysfunction (disorder)"] LVSDDiagnosis\n                       where LVSDDiagnosis.severity in "Moderate or Severe"\n                    ) \n          ) ModerateOrSevereLVSD\n        let dateOfFinding: start of ( ModerateOrSevereLVSD LVSD\n                                  where LVSD.isConfirmedActiveDiagnosis()\n                                  return LVSD.prevalenceInterval()\n                                )\n        return dateOfFinding \n      )',
        context: "Patient",
        supplDataElement: false,
        popDefinition: false,
        commentString: "",
        returnType: null,
        parentLibrary: "AHAOverall",
        libraryDisplayName: "AHA",
        libraryVersion: "2.5.000",
        name: "Moderate or Severe LVSD Dates",
        logic:
          'define "Moderate or Severe LVSD Dates":\n    ( [Observation: "Ejection Fraction"] EjectionFraction\n        let dateOfFinding: start of ( EjectionFraction Fraction\n                                 where Fraction.value as Quantity <= 40 \'%\'\n                                   and Fraction.status in {\'final\', \'amended\', \'corrected\'} \n                                 return Fraction.effective.toInterval()\n                                   )\n        return dateOfFinding \n      )\n    union\n    ( \n        ( [Condition: "Moderate or Severe LVSD"]\n            union ( [Condition: "Left ventricular systolic dysfunction (disorder)"] LVSDDiagnosis\n                       where LVSDDiagnosis.severity in "Moderate or Severe"\n                    ) \n          ) ModerateOrSevereLVSD\n        let dateOfFinding: start of ( ModerateOrSevereLVSD LVSD\n                                  where LVSD.isConfirmedActiveDiagnosis()\n                                  return LVSD.prevalenceInterval()\n                                )\n        return dateOfFinding \n      )',
      },
      {
        id: "AHAOverall-2.5.000|AHA|Heart Failure Outpatient Encounter",
        definitionName: "Heart Failure Outpatient Encounter",
        definitionLogic:
          'define "Heart Failure Outpatient Encounter":\n  ( [Encounter: "Care Services in Long Term Residential Facility"]\n      union [Encounter: "Home Healthcare Services"]\n      union [Encounter: "Nursing Facility Visit"]\n      union [Encounter: "Office Visit"]\n      union [Encounter: "Outpatient Consultation"]\n     ) QualifyingEncounter\n    with [Condition: "Heart Failure"] HeartFailure\n      such that HeartFailure.prevalenceInterval() overlaps QualifyingEncounter.period  \n        and HeartFailure.isConfirmedActiveDiagnosis()\n    where QualifyingEncounter.period during "Measurement Period"\n      and QualifyingEncounter.isFinished()',
        context: "Patient",
        supplDataElement: false,
        popDefinition: false,
        commentString: "",
        returnType: null,
        parentLibrary: "AHAOverall",
        libraryDisplayName: "AHA",
        libraryVersion: "2.5.000",
        name: "Heart Failure Outpatient Encounter",
        logic:
          'define "Heart Failure Outpatient Encounter":\n  ( [Encounter: "Care Services in Long Term Residential Facility"]\n      union [Encounter: "Home Healthcare Services"]\n      union [Encounter: "Nursing Facility Visit"]\n      union [Encounter: "Office Visit"]\n      union [Encounter: "Outpatient Consultation"]\n     ) QualifyingEncounter\n    with [Condition: "Heart Failure"] HeartFailure\n      such that HeartFailure.prevalenceInterval() overlaps QualifyingEncounter.period  \n        and HeartFailure.isConfirmedActiveDiagnosis()\n    where QualifyingEncounter.period during "Measurement Period"\n      and QualifyingEncounter.isFinished()',
      },
    ],
  "Initial Population": [
    {
      id: "AHAOverall-2.5.000|AHA|Has Two Qualifying Outpatient Encounters and Heart Failure Outpatient Encounter During the Measurement Period",
      definitionName:
        "Has Two Qualifying Outpatient Encounters and Heart Failure Outpatient Encounter During the Measurement Period",
      definitionLogic:
        'define "Has Two Qualifying Outpatient Encounters and Heart Failure Outpatient Encounter During the Measurement Period":\n  AgeInYearsAt(date from start of "Measurement Period") >= 18\n    and exists ( "Qualifying Outpatient Encounter During Measurement Period" Encounter1\n        with "Qualifying Outpatient Encounter During Measurement Period" Encounter2\n          such that Encounter2.id !~ Encounter1.id\n    )\n    and exists "Heart Failure Outpatient Encounter"',
      context: "Patient",
      supplDataElement: false,
      popDefinition: false,
      commentString: "",
      returnType: null,
      parentLibrary: "AHAOverall",
      libraryDisplayName: "AHA",
      libraryVersion: "2.5.000",
      name: "Has Two Qualifying Outpatient Encounters and Heart Failure Outpatient Encounter During the Measurement Period",
      logic:
        'define "Has Two Qualifying Outpatient Encounters and Heart Failure Outpatient Encounter During the Measurement Period":\n  AgeInYearsAt(date from start of "Measurement Period") >= 18\n    and exists ( "Qualifying Outpatient Encounter During Measurement Period" Encounter1\n        with "Qualifying Outpatient Encounter During Measurement Period" Encounter2\n          such that Encounter2.id !~ Encounter1.id\n    )\n    and exists "Heart Failure Outpatient Encounter"',
    },
  ],
  "AHAOverall-2.5.000|AHA|overlapsHeartFailureOutpatientEncounter": [
    {
      id: "AHAOverall-2.5.000|AHA|Heart Failure Outpatient Encounter with History of Moderate or Severe LVSD",
      definitionName:
        "Heart Failure Outpatient Encounter with History of Moderate or Severe LVSD",
      definitionLogic:
        'define "Heart Failure Outpatient Encounter with History of Moderate or Severe LVSD":\n    "Heart Failure Outpatient Encounter" HFOutpatientEncounter\n        with "Moderate or Severe LVSD Dates" ModerateSevereLVSDDate\n            such that ModerateSevereLVSDDate before end of HFOutpatientEncounter.period',
      context: "Patient",
      supplDataElement: false,
      popDefinition: false,
      commentString: "",
      returnType: null,
      parentLibrary: "AHAOverall",
      libraryDisplayName: "AHA",
      libraryVersion: "2.5.000",
      name: "Heart Failure Outpatient Encounter with History of Moderate or Severe LVSD",
      logic:
        'define "Heart Failure Outpatient Encounter with History of Moderate or Severe LVSD":\n    "Heart Failure Outpatient Encounter" HFOutpatientEncounter\n        with "Moderate or Severe LVSD Dates" ModerateSevereLVSDDate\n            such that ModerateSevereLVSDDate before end of HFOutpatientEncounter.period',
    },
    {
      id: "AHAOverall-2.5.000|AHA|isConfirmedActiveDiagnosis",
      definitionName: "isConfirmedActiveDiagnosis",
      definitionLogic: null,
      context: "Patient",
      supplDataElement: false,
      popDefinition: false,
      commentString: "",
      returnType: null,
      parentLibrary: "AHAOverall",
      libraryDisplayName: "AHA",
      libraryVersion: "2.5.000",
      name: "isConfirmedActiveDiagnosis",
      logic: null,
    },
  ],
  "Has Diagnosis of Pregnancy": [
    {
      id: "AHAOverall-2.5.000|AHA|Heart Failure Outpatient Encounter with History of Moderate or Severe LVSD",
      definitionName:
        "Heart Failure Outpatient Encounter with History of Moderate or Severe LVSD",
      definitionLogic:
        'define "Heart Failure Outpatient Encounter with History of Moderate or Severe LVSD":\n    "Heart Failure Outpatient Encounter" HFOutpatientEncounter\n        with "Moderate or Severe LVSD Dates" ModerateSevereLVSDDate\n            such that ModerateSevereLVSDDate before end of HFOutpatientEncounter.period',
      context: "Patient",
      supplDataElement: false,
      popDefinition: false,
      commentString: "",
      returnType: null,
      parentLibrary: "AHAOverall",
      libraryDisplayName: "AHA",
      libraryVersion: "2.5.000",
      name: "Heart Failure Outpatient Encounter with History of Moderate or Severe LVSD",
      logic:
        'define "Heart Failure Outpatient Encounter with History of Moderate or Severe LVSD":\n    "Heart Failure Outpatient Encounter" HFOutpatientEncounter\n        with "Moderate or Severe LVSD Dates" ModerateSevereLVSDDate\n            such that ModerateSevereLVSDDate before end of HFOutpatientEncounter.period',
    },
  ],
  "Denominator Exclusions": [
    {
      id: "AHAOverall-2.5.000|AHA|Has Left Ventricular Assist Device Complications",
      definitionName: "Has Left Ventricular Assist Device Complications",
      definitionLogic:
        'define "Has Left Ventricular Assist Device Complications":\n  exists (\n            [Condition: "Left Ventricular Assist Device Complications"] LVADComplications\n              with "Heart Failure Outpatient Encounter with History of Moderate or Severe LVSD" ModerateOrSevereLVSDHFOutpatientEncounter\n                such that ( Coalesce( LVADComplications.recordedDate.toInterval(), LVADComplications.prevalenceInterval() ) ) starts before end of ModerateOrSevereLVSDHFOutpatientEncounter.period  \n              where LVADComplications.isConfirmedActiveDiagnosis()\n          )',
      context: "Patient",
      supplDataElement: false,
      popDefinition: false,
      commentString: "",
      returnType: null,
      parentLibrary: "AHAOverall",
      libraryDisplayName: "AHA",
      libraryVersion: "2.5.000",
      name: "Has Left Ventricular Assist Device Complications",
      logic:
        'define "Has Left Ventricular Assist Device Complications":\n  exists (\n            [Condition: "Left Ventricular Assist Device Complications"] LVADComplications\n              with "Heart Failure Outpatient Encounter with History of Moderate or Severe LVSD" ModerateOrSevereLVSDHFOutpatientEncounter\n                such that ( Coalesce( LVADComplications.recordedDate.toInterval(), LVADComplications.prevalenceInterval() ) ) starts before end of ModerateOrSevereLVSDHFOutpatientEncounter.period  \n              where LVADComplications.isConfirmedActiveDiagnosis()\n          )',
    },
    {
      id: "AHAOverall-2.5.000|AHA|Has Heart Transplant",
      definitionName: "Has Heart Transplant",
      definitionLogic:
        'define "Has Heart Transplant":\n  exists (\n          [Procedure: "Heart Transplant"] HeartTransplant\n            with "Heart Failure Outpatient Encounter with History of Moderate or Severe LVSD" ModerateOrSevereLVSDHFOutpatientEncounter\n              such that HeartTransplant.performed.toInterval() starts before end of ModerateOrSevereLVSDHFOutpatientEncounter.period\n            where HeartTransplant.status = \'completed\'\n          )',
      context: "Patient",
      supplDataElement: false,
      popDefinition: false,
      commentString: "",
      returnType: null,
      parentLibrary: "AHAOverall",
      libraryDisplayName: "AHA",
      libraryVersion: "2.5.000",
      name: "Has Heart Transplant",
      logic:
        'define "Has Heart Transplant":\n  exists (\n          [Procedure: "Heart Transplant"] HeartTransplant\n            with "Heart Failure Outpatient Encounter with History of Moderate or Severe LVSD" ModerateOrSevereLVSDHFOutpatientEncounter\n              such that HeartTransplant.performed.toInterval() starts before end of ModerateOrSevereLVSDHFOutpatientEncounter.period\n            where HeartTransplant.status = \'completed\'\n          )',
    },
    {
      id: "AHAOverall-2.5.000|AHA|Has Heart Transplant Complications",
      definitionName: "Has Heart Transplant Complications",
      definitionLogic:
        'define "Has Heart Transplant Complications":\n  exists ( \n          [Condition: "Heart Transplant Complications"] HeartTransplantComplications\n            with "Heart Failure Outpatient Encounter with History of Moderate or Severe LVSD" ModerateOrSevereLVSDHFOutpatientEncounter\n              such that ( Coalesce( HeartTransplantComplications.recordedDate.toInterval(), HeartTransplantComplications.prevalenceInterval() ) ) starts before end of ModerateOrSevereLVSDHFOutpatientEncounter.period\n            where HeartTransplantComplications.isConfirmedActiveDiagnosis()\n          )',
      context: "Patient",
      supplDataElement: false,
      popDefinition: false,
      commentString: "",
      returnType: null,
      parentLibrary: "AHAOverall",
      libraryDisplayName: "AHA",
      libraryVersion: "2.5.000",
      name: "Has Heart Transplant Complications",
      logic:
        'define "Has Heart Transplant Complications":\n  exists ( \n          [Condition: "Heart Transplant Complications"] HeartTransplantComplications\n            with "Heart Failure Outpatient Encounter with History of Moderate or Severe LVSD" ModerateOrSevereLVSDHFOutpatientEncounter\n              such that ( Coalesce( HeartTransplantComplications.recordedDate.toInterval(), HeartTransplantComplications.prevalenceInterval() ) ) starts before end of ModerateOrSevereLVSDHFOutpatientEncounter.period\n            where HeartTransplantComplications.isConfirmedActiveDiagnosis()\n          )',
    },
    {
      id: "AHAOverall-2.5.000|AHA|Has Left Ventricular Assist Device",
      definitionName: "Has Left Ventricular Assist Device",
      definitionLogic:
        'define "Has Left Ventricular Assist Device":\n  exists (\n            [Procedure: "Left Ventricular Assist Device Placement"] LVADOutpatient\n              with "Heart Failure Outpatient Encounter with History of Moderate or Severe LVSD" ModerateOrSevereLVSDHFOutpatientEncounter\n                such that LVADOutpatient.performed.toInterval() starts before end of ModerateOrSevereLVSDHFOutpatientEncounter.period\n              where LVADOutpatient.status = \'completed\'\n            )',
      context: "Patient",
      supplDataElement: false,
      popDefinition: false,
      commentString: "",
      returnType: null,
      parentLibrary: "AHAOverall",
      libraryDisplayName: "AHA",
      libraryVersion: "2.5.000",
      name: "Has Left Ventricular Assist Device",
      logic:
        'define "Has Left Ventricular Assist Device":\n  exists (\n            [Procedure: "Left Ventricular Assist Device Placement"] LVADOutpatient\n              with "Heart Failure Outpatient Encounter with History of Moderate or Severe LVSD" ModerateOrSevereLVSDHFOutpatientEncounter\n                such that LVADOutpatient.performed.toInterval() starts before end of ModerateOrSevereLVSDHFOutpatientEncounter.period\n              where LVADOutpatient.status = \'completed\'\n            )',
    },
  ],
  "Has Medical or Patient Reason for Not Ordering ACEI or ARB or ARNI": [
    {
      id: "AHAOverall-2.5.000|AHA|Heart Failure Outpatient Encounter with History of Moderate or Severe LVSD",
      definitionName:
        "Heart Failure Outpatient Encounter with History of Moderate or Severe LVSD",
      definitionLogic:
        'define "Heart Failure Outpatient Encounter with History of Moderate or Severe LVSD":\n    "Heart Failure Outpatient Encounter" HFOutpatientEncounter\n        with "Moderate or Severe LVSD Dates" ModerateSevereLVSDDate\n            such that ModerateSevereLVSDDate before end of HFOutpatientEncounter.period',
      context: "Patient",
      supplDataElement: false,
      popDefinition: false,
      commentString: "",
      returnType: null,
      parentLibrary: "AHAOverall",
      libraryDisplayName: "AHA",
      libraryVersion: "2.5.000",
      name: "Heart Failure Outpatient Encounter with History of Moderate or Severe LVSD",
      logic:
        'define "Heart Failure Outpatient Encounter with History of Moderate or Severe LVSD":\n    "Heart Failure Outpatient Encounter" HFOutpatientEncounter\n        with "Moderate or Severe LVSD Dates" ModerateSevereLVSDDate\n            such that ModerateSevereLVSDDate before end of HFOutpatientEncounter.period',
    },
  ],
  "AHAOverall-2.5.000|AHA|Has Left Ventricular Assist Device Complications": [
    {
      id: "AHAOverall-2.5.000|AHA|Heart Failure Outpatient Encounter with History of Moderate or Severe LVSD",
      definitionName:
        "Heart Failure Outpatient Encounter with History of Moderate or Severe LVSD",
      definitionLogic:
        'define "Heart Failure Outpatient Encounter with History of Moderate or Severe LVSD":\n    "Heart Failure Outpatient Encounter" HFOutpatientEncounter\n        with "Moderate or Severe LVSD Dates" ModerateSevereLVSDDate\n            such that ModerateSevereLVSDDate before end of HFOutpatientEncounter.period',
      context: "Patient",
      supplDataElement: false,
      popDefinition: false,
      commentString: "",
      returnType: null,
      parentLibrary: "AHAOverall",
      libraryDisplayName: "AHA",
      libraryVersion: "2.5.000",
      name: "Heart Failure Outpatient Encounter with History of Moderate or Severe LVSD",
      logic:
        'define "Heart Failure Outpatient Encounter with History of Moderate or Severe LVSD":\n    "Heart Failure Outpatient Encounter" HFOutpatientEncounter\n        with "Moderate or Severe LVSD Dates" ModerateSevereLVSDDate\n            such that ModerateSevereLVSDDate before end of HFOutpatientEncounter.period',
    },
    {
      id: "AHAOverall-2.5.000|AHA|isConfirmedActiveDiagnosis",
      definitionName: "isConfirmedActiveDiagnosis",
      definitionLogic: null,
      context: "Patient",
      supplDataElement: false,
      popDefinition: false,
      commentString: "",
      returnType: null,
      parentLibrary: "AHAOverall",
      libraryDisplayName: "AHA",
      libraryVersion: "2.5.000",
      name: "isConfirmedActiveDiagnosis",
      logic: null,
    },
  ],
  "Denominator Exceptions": [
    {
      id: "Has Diagnosis of Pregnancy",
      definitionName: "Has Diagnosis of Pregnancy",
      definitionLogic:
        'define "Has Diagnosis of Pregnancy":\n    exists (\n            [Condition: "Pregnancy"] PregnancyDiagnosis\n              with AHA."Heart Failure Outpatient Encounter with History of Moderate or Severe LVSD" ModerateOrSevereLVSDHFOutpatientEncounter\n                such that PregnancyDiagnosis.prevalenceInterval() starts 9 months or less before or on start of ModerateOrSevereLVSDHFOutpatientEncounter.period\n           )',
      context: "Patient",
      supplDataElement: false,
      popDefinition: false,
      commentString: "",
      returnType: null,
      parentLibrary: null,
      libraryDisplayName: null,
      libraryVersion: null,
      name: "Has Diagnosis of Pregnancy",
      logic:
        'define "Has Diagnosis of Pregnancy":\n    exists (\n            [Condition: "Pregnancy"] PregnancyDiagnosis\n              with AHA."Heart Failure Outpatient Encounter with History of Moderate or Severe LVSD" ModerateOrSevereLVSDHFOutpatientEncounter\n                such that PregnancyDiagnosis.prevalenceInterval() starts 9 months or less before or on start of ModerateOrSevereLVSDHFOutpatientEncounter.period\n           )',
    },
    {
      id: "Has Diagnosis of Renal Failure Due to ACEI",
      definitionName: "Has Diagnosis of Renal Failure Due to ACEI",
      definitionLogic:
        'define "Has Diagnosis of Renal Failure Due to ACEI":\n    exists (\n            [Condition: "Acute renal failure caused by angiotensin-converting-enzyme inhibitor (disorder)"] RenalFailureDueToACEI\n              where RenalFailureDueToACEI.overlapsAfterHeartFailureOutpatientEncounter()\n           )',
      context: "Patient",
      supplDataElement: false,
      popDefinition: false,
      commentString: "",
      returnType: null,
      parentLibrary: null,
      libraryDisplayName: null,
      libraryVersion: null,
      name: "Has Diagnosis of Renal Failure Due to ACEI",
      logic:
        'define "Has Diagnosis of Renal Failure Due to ACEI":\n    exists (\n            [Condition: "Acute renal failure caused by angiotensin-converting-enzyme inhibitor (disorder)"] RenalFailureDueToACEI\n              where RenalFailureDueToACEI.overlapsAfterHeartFailureOutpatientEncounter()\n           )',
    },
    {
      id: "Has Diagnosis of Allergy or Intolerance to ACEI or ARB",
      definitionName: "Has Diagnosis of Allergy or Intolerance to ACEI or ARB",
      definitionLogic:
        'define "Has Diagnosis of Allergy or Intolerance to ACEI or ARB":\n    exists (\n            ( ["Condition": "Allergy to ACE Inhibitor or ARB"]\n               union ["Condition": "Intolerance to ACE Inhibitor or ARB"] ) ACEIOrARBAllergyOrIntoleranceDiagnosis\n                where ACEIOrARBAllergyOrIntoleranceDiagnosis.overlapsAfterHeartFailureOutpatientEncounter()\n           )',
      context: "Patient",
      supplDataElement: false,
      popDefinition: false,
      commentString: "",
      returnType: null,
      parentLibrary: null,
      libraryDisplayName: null,
      libraryVersion: null,
      name: "Has Diagnosis of Allergy or Intolerance to ACEI or ARB",
      logic:
        'define "Has Diagnosis of Allergy or Intolerance to ACEI or ARB":\n    exists (\n            ( ["Condition": "Allergy to ACE Inhibitor or ARB"]\n               union ["Condition": "Intolerance to ACE Inhibitor or ARB"] ) ACEIOrARBAllergyOrIntoleranceDiagnosis\n                where ACEIOrARBAllergyOrIntoleranceDiagnosis.overlapsAfterHeartFailureOutpatientEncounter()\n           )',
    },
    {
      id: "Has Allergy or Intolerance to ACEI or ARB or ARNI Ingredient",
      definitionName:
        "Has Allergy or Intolerance to ACEI or ARB or ARNI Ingredient",
      definitionLogic:
        'define "Has Allergy or Intolerance to ACEI or ARB or ARNI Ingredient":\n  exists (\n          ( [AllergyIntolerance: "ACE Inhibitor or ARB or ARNI Ingredient"]\n             union [AllergyIntolerance: "Substance with angiotensin-converting enzyme inhibitor mechanism of action (substance)"]\n             union [AllergyIntolerance: "Substance with angiotensin II receptor antagonist mechanism of action (substance)"]\n             union [AllergyIntolerance: "Substance with neprilysin inhibitor mechanism of action (substance)"] ) ACEIOrARBOrARNIAllergyIntolerance\n              where ACEIOrARBOrARNIAllergyIntolerance.overlapsAfterHeartFailureOutpatientEncounter()\n            )',
      context: "Patient",
      supplDataElement: false,
      popDefinition: false,
      commentString: "",
      returnType: null,
      parentLibrary: null,
      libraryDisplayName: null,
      libraryVersion: null,
      name: "Has Allergy or Intolerance to ACEI or ARB or ARNI Ingredient",
      logic:
        'define "Has Allergy or Intolerance to ACEI or ARB or ARNI Ingredient":\n  exists (\n          ( [AllergyIntolerance: "ACE Inhibitor or ARB or ARNI Ingredient"]\n             union [AllergyIntolerance: "Substance with angiotensin-converting enzyme inhibitor mechanism of action (substance)"]\n             union [AllergyIntolerance: "Substance with angiotensin II receptor antagonist mechanism of action (substance)"]\n             union [AllergyIntolerance: "Substance with neprilysin inhibitor mechanism of action (substance)"] ) ACEIOrARBOrARNIAllergyIntolerance\n              where ACEIOrARBOrARNIAllergyIntolerance.overlapsAfterHeartFailureOutpatientEncounter()\n            )',
    },
    {
      id: "Has Medical or Patient Reason for Not Ordering ACEI or ARB or ARNI",
      definitionName:
        "Has Medical or Patient Reason for Not Ordering ACEI or ARB or ARNI",
      definitionLogic:
        "define \"Has Medical or Patient Reason for Not Ordering ACEI or ARB or ARNI\":\n  exists (\n          [MedicationNotRequested: medication in \"ACE Inhibitor or ARB or ARNI\"] NoACEIOrARBOrARNIOrdered\n            with AHA.\"Heart Failure Outpatient Encounter with History of Moderate or Severe LVSD\" ModerateOrSevereLVSDHFOutpatientEncounter\n              such that NoACEIOrARBOrARNIOrdered.authoredOn during day of ModerateOrSevereLVSDHFOutpatientEncounter.period\n            where NoACEIOrARBOrARNIOrdered.status = 'completed'\n              and NoACEIOrARBOrARNIOrdered.intent in { 'order', 'original-order', 'reflex-order', 'filler-order', 'instance-order' } \n              and ( NoACEIOrARBOrARNIOrdered.reasonCode in \"Medical Reason\"\n                     or NoACEIOrARBOrARNIOrdered.reasonCode in \"Patient Reason\"\n                     or NoACEIOrARBOrARNIOrdered.reasonCode in \"Patient Reason for ACE Inhibitor or ARB Decline\"\n                   )\n            )",
      context: "Patient",
      supplDataElement: false,
      popDefinition: false,
      commentString: "",
      returnType: null,
      parentLibrary: null,
      libraryDisplayName: null,
      libraryVersion: null,
      name: "Has Medical or Patient Reason for Not Ordering ACEI or ARB or ARNI",
      logic:
        "define \"Has Medical or Patient Reason for Not Ordering ACEI or ARB or ARNI\":\n  exists (\n          [MedicationNotRequested: medication in \"ACE Inhibitor or ARB or ARNI\"] NoACEIOrARBOrARNIOrdered\n            with AHA.\"Heart Failure Outpatient Encounter with History of Moderate or Severe LVSD\" ModerateOrSevereLVSDHFOutpatientEncounter\n              such that NoACEIOrARBOrARNIOrdered.authoredOn during day of ModerateOrSevereLVSDHFOutpatientEncounter.period\n            where NoACEIOrARBOrARNIOrdered.status = 'completed'\n              and NoACEIOrARBOrARNIOrdered.intent in { 'order', 'original-order', 'reflex-order', 'filler-order', 'instance-order' } \n              and ( NoACEIOrARBOrARNIOrdered.reasonCode in \"Medical Reason\"\n                     or NoACEIOrARBOrARNIOrdered.reasonCode in \"Patient Reason\"\n                     or NoACEIOrARBOrARNIOrdered.reasonCode in \"Patient Reason for ACE Inhibitor or ARB Decline\"\n                   )\n            )",
    },
  ],
  "FHIRHelpers-4.3.000|FHIRHelpers|ToInterval": [
    {
      id: "FHIRHelpers-4.3.000|FHIRHelpers|ToQuantity",
      definitionName: "ToQuantity",
      definitionLogic: null,
      context: "Patient",
      supplDataElement: false,
      popDefinition: false,
      commentString: "",
      returnType: null,
      parentLibrary: "FHIRHelpers",
      libraryDisplayName: "FHIRHelpers",
      libraryVersion: "4.3.000",
      name: "ToQuantity",
      logic: null,
    },
  ],
};

const TestCaseForm = tw.form`m-3`;
const ValidationErrorsButton = tw.button`
  text-lg
  -translate-y-6
  w-[160px]
  h-[30px]
  origin-bottom-left
  rotate-90
  border-solid
  border-2
  border-gray-500
`;

interface AlertProps {
  status?: "success" | "warning" | "error" | "info" | "meta" | null;
  message?: any;
}

interface navigationParams {
  id: string;
  measureId: string;
}

const styles = {
  success: `color #006400; background-color: #90EE90`,
  warning: `color #B0350C; background-color: #ECDF27`,
  error: `color #C03030; background-color: #FFF829`,
  meta: tw`bg-blue-100 text-black`,
  default: `color #00688B; background-color: #E0FFFF`,
};

/*
previous color system based off of tw.
success #249A5B vs #A4FAA8, 3:1 fail dark green to light green
warning #B87A06 vs #FCEB9D, 3:1 fail, orange yellow
error: #BA1C32 vs #FBC4AB 4.1 fail red to red orange
// meta: 000 #b0EEFF: pass 
default: #2469B7 vs #b0EEFF  d-L  teal 4.4:1 
*/

const Alert = styled.div<AlertProps>(({ status = "default" }) => [
  styles[status],
  tw`rounded-lg p-2 m-2 text-base inline-flex items-center w-11/12`,
]);

const ValidationAlertCard = styled.p<AlertProps>(({ status = "default" }) => [
  tw`text-xs bg-white p-3 rounded-xl mx-3 my-1 break-words`,
  styles[status],
]);

const StyledIcon = styled(FontAwesomeIcon)(
  ({ errorSeverity }: { errorSeverity: string }) => [
    errorSeverity !== "default"
      ? errorSeverity === "error"
        ? tw`text-red-700`
        : tw`text-yellow-700`
      : "",
  ]
);

const testCaseSeriesStyles = {
  border: "1px solid #8c8c8c",
  "& .MuiOutlinedInput-notchedOutline": {
    borderRadius: "3px",
    "& legend": {
      width: 0,
    },
  },
  "& .MuiOutlinedInput-root": {
    padding: 0,
  },
};

/*
For population values...
If testCase is present, then take the population groups off the testCase
If no testCase is present, then show the populations for the measure groups
coming from the loaded measure
 */

export function isEmptyTestCaseJsonString(
  jsonString: string | undefined | null
) {
  try {
    return (
      _.isNil(jsonString) ||
      _.isEmpty(jsonString.trim()) ||
      _.isEmpty(JSON.parse(jsonString))
    );
  } catch (error) {
    return true;
  }
}

export function findEpisodeActualValue(
  populationEpisodeResults: PopulationEpisodeResult[],
  populationValue: PopulationExpectedValue,
  populationDefinition: string
): number {
  const groupEpisodeResult = populationEpisodeResults?.find(
    (popEpResult) =>
      FHIR_POPULATION_CODES[popEpResult.populationType] ===
        populationValue.name && populationDefinition === popEpResult.define
  );
  return _.isNil(groupEpisodeResult) ? 0 : groupEpisodeResult.value;
}

const INITIAL_VALUES = {
  title: "",
  description: "",
  series: "",
  groupPopulations: [],
} as TestCase;

export interface EditTestCaseProps {
  errors: Array<string>;
  setErrors: (value: Array<string>) => void;
}

const EditTestCase = (props: EditTestCaseProps) => {
  useDocumentTitle("MADiE Edit Measure Edit Test Case");
  const navigate = useNavigate();
  const featureFlags = useFeatureFlags();
  const { id, measureId } = useParams<
    keyof navigationParams
  >() as navigationParams;
  // Avoid infinite dependency render. May require additional error handling for timeouts.
  const testCaseService = useRef(useTestCaseServiceApi());
  const calculation = useRef(calculationService());
  const [alert, setAlert] = useState<AlertProps>(null);
  const { errors, setErrors } = props;
  if (!errors) {
    setErrors([]);
  }

  // Toast utilities
  const [toastOpen, setToastOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastType, setToastType] = useState<string>("danger");
  const onToastClose = () => {
    setToastMessage("");
    setToastOpen(false);
  };

  const showToast = (
    message: string,
    toastType: "success" | "danger" | "warning"
  ) => {
    setToastOpen(true);
    setToastType(toastType);
    setToastMessage(message);
  };

  const [testCase, setTestCase] = useState<TestCase>(null);
  const [editorVal, setEditorVal]: [string, Dispatch<SetStateAction<string>>] =
    useState("Loading...");
  const [validationErrors, setValidationErrors] = useState<any[]>([]);
  const [seriesState, setSeriesState] = useState<any>({
    loaded: false,
    series: [],
  });
  // const [expressionDefinitions, setExpressionDefinitions] = useState<Array<ExpressionDefinition>>([]);
  const [editor, setEditor] = useState<Ace.Editor>(null);
  function resizeEditor() {
    // hack to force Ace to resize as it doesn't seem to be responsive
    setTimeout(() => {
      editor?.resize(true);
    }, 500);
  }
  // we need this to fire on initial load because it doesn't know about allotment's client width
  useEffect(() => {
    if (editor) {
      resizeEditor();
    }
  }, [editor]);
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  const [populationGroupResults, setPopulationGroupResults] =
    useState<DetailedPopulationGroupResult[]>();
  const [calculationErrors, setCalculationErrors] = useState<AlertProps>();
  const [rightPanelActiveTab, setRightPanelActiveTab] =
    useState<string>("measurecql");
  const [leftPanelActiveTab, setLeftPanelActiveTab] =
    useState<string>("elements");
  const [groupPopulations, setGroupPopulations] = useState<GroupPopulation[]>(
    []
  );

  const {
    measureState,
    bundleState,
    valueSetsState,
    executionContextReady,
    executing,
    setExecuting,
  } = useExecutionContext();
  const [measure] = measureState;
  const [measureBundle] = bundleState;
  const [valueSets] = valueSetsState;
  const [discardDialogOpen, setDiscardDialogOpen] = useState(false);
  const { updateMeasure } = measureStore;
  const load = useRef(0);
  const canEdit = checkUserCanEdit(
    measure?.measureSet?.owner,
    measure?.measureSet?.acls,
    measure?.measureMetaData?.draft
  );

  const formik = useFormik({
    initialValues: { ...INITIAL_VALUES },
    validationSchema: TestCaseValidator,
    onSubmit: async (values: TestCase) => await handleSubmit(values),
  });
  const { resetForm } = formik;

  //needs to be added to feature flag config once the feature flags are moved to Util
  const testCaseAlertToast = false;

  useEffect(() => {
    if (_.isNil(populationGroupResults) || _.isEmpty(populationGroupResults)) {
      setGroupPopulations(_.cloneDeep(formik.values.groupPopulations));
    } else {
      setGroupPopulations(
        _.cloneDeep(
          calculation.current.processTestCaseResults(
            formik.values,
            measure.groups,
            populationGroupResults
          )?.groupPopulations
        )
      );
    }
  }, [formik.values.groupPopulations, populationGroupResults]);

  const mapMeasureGroup = (group: Group): GroupPopulation => {
    const calculateEpisodes = group.populationBasis === "boolean";
    return {
      groupId: group.id,
      scoring: group.scoring,
      populationBasis: group.populationBasis,
      stratificationValues: group.stratifications
        ?.filter((stratification) => stratification.cqlDefinition)
        ?.map((stratification, index) => ({
          name: `Strata-${index + 1} ${_.startCase(
            stratification.association
          )}`,
          expected: calculateEpisodes ? false : null,
          actual: calculateEpisodes ? false : null,
          id: stratification.id,
          criteriaReference: "",
        })),
      populationValues: getPopulationTypesForScoring(group)?.map(
        (population: PopulationExpectedValue) => ({
          name: population.name,
          expected: calculateEpisodes ? false : null,
          actual: calculateEpisodes ? false : null,
          id: population.id,
          criteriaReference: population.criteriaReference,
        })
      ),
    };
  };

  const mapMeasureGroups = useCallback(
    (measureGroups: Group[]): GroupPopulation[] => {
      return measureGroups.map(mapMeasureGroup);
    },
    []
  );

  const { updateRouteHandlerState } = routeHandlerStore;
  useEffect(() => {
    updateRouteHandlerState({
      canTravel: !formik.dirty && !isJsonModified(),
      pendingRoute: "",
    });
  }, [formik.dirty, editorVal, testCase?.json]);

  const standardizeJson = (testCase) => {
    try {
      if (JSON.parse(testCase.json)) {
        return JSON.stringify(JSON.parse(testCase.json), null, 2);
      }
    } catch (e) {
      return testCase?.json;
    }
  };

  const loadTestCase = () => {
    testCaseService.current
      .getTestCase(id, measureId)
      .then((tc: TestCase) => {
        const nextTc = _.cloneDeep(tc);
        nextTc.json = standardizeJson(nextTc);
        setTestCase(nextTc);
        setEditorVal(nextTc.json ? nextTc.json : "");
        if (measure && measure.groups) {
          nextTc.groupPopulations = measure.groups.map((group) => {
            const existingGroupPop = tc.groupPopulations?.find(
              (gp) => gp.groupId === group.id
            );
            return _.isNil(existingGroupPop)
              ? mapMeasureGroup(group)
              : {
                  ...mapExistingTestCasePopulations(existingGroupPop, group),
                  populationBasis: group?.populationBasis,
                };
          });
        } else {
          nextTc.groupPopulations = [];
        }
        resetForm({ values: _.cloneDeep(nextTc) });
        handleHapiOutcome(nextTc?.hapiOperationOutcome);
      })
      .catch((error) => {
        if (error.toString().includes("404")) {
          navigate("/404");
        }
      });
  };

  useEffect(() => {
    if (!seriesState.loaded) {
      testCaseService.current
        .getTestCaseSeriesForMeasure(measureId)
        .then((existingSeries) =>
          setSeriesState({ loaded: true, series: existingSeries })
        )
        .catch((error) => {
          setAlert(() => ({
            status: "error",
            message: error.message,
          }));
          setErrors([...errors, error.message]);
        });
    }

    if (id && _.isNil(testCase) && measure && load.current === 0) {
      load.current = +1;
      loadTestCase();
    }
  }, [
    id,
    measureId,
    testCaseService,
    setTestCase,
    resetForm,
    measure,
    mapMeasureGroups,
    seriesState.loaded,
  ]);

  const handleSubmit = async (testCase: TestCase) => {
    setAlert(null);
    testCase.title = sanitizeUserInput(testCase.title);
    testCase.description = sanitizeUserInput(testCase.description);
    testCase.series = sanitizeUserInput(testCase.series);

    if (id) {
      return await updateTestCase(testCase);
    }
    await createTestCase(testCase);
  };

  const createTestCase = async (testCase: TestCase) => {
    try {
      testCase.json = editorVal || null;
      const savedTestCase = await testCaseService.current.createTestCase(
        testCase,
        measureId
      );
      setEditorVal(savedTestCase.json);

      handleTestCaseResponse(savedTestCase, "create");
    } catch (error) {
      setAlert(() => ({
        status: "error",
        message: "An error occurred while creating the test case.",
      }));
      setErrors([...errors, "An error occurred while creating the test case."]);
    }
  };

  const updateTestCase = async (testCase: TestCase) => {
    try {
      if (editorVal !== testCase.json) {
        testCase.json = editorVal;
      }
      setValidationErrors(() => []);
      const updatedTestCase = await testCaseService.current.updateTestCase(
        testCase,
        measureId
      );

      const updatedTc = _.cloneDeep(updatedTestCase);
      updatedTc.json = standardizeJson(updatedTc);
      resetForm({
        values: _.cloneDeep(updatedTc),
      });
      setTestCase(_.cloneDeep(updatedTc));
      setEditorVal(updatedTc.json);

      handleTestCaseResponse(updatedTc, "update");
    } catch (error) {
      setAlert(() => {
        if (error instanceof MadieError) {
          return {
            status: "error",
            message: error.message,
          };
        }
        return {
          status: "error",
          message: "An error occurred while updating the test case.",
        };
      });
      setErrors([...errors, "An error occurred while updating the test case."]);
    }
  };

  const calculate = async (e) => {
    e.preventDefault();
    setExecuting(true);
    setErrors([]);
    setPopulationGroupResults(() => undefined);
    if (measure && measure.cqlErrors) {
      setCalculationErrors({
        status: "warning",
        message:
          "Cannot execute test case while errors exist in the measure CQL.",
      });
      return;
    }
    setValidationErrors(() => []);
    let modifiedTestCase = { ...testCase };
    if (isJsonModified()) {
      modifiedTestCase.json = editorVal;
      try {
        // Validate test case JSON prior to execution
        const validationResult =
          await testCaseService.current.validateTestCaseBundle(
            JSON.parse(editorVal)
          );
        const errors = handleHapiOutcome(validationResult);
        if (!_.isNil(errors) && errors.length > 0 && hasErrorSeverity(errors)) {
          setCalculationErrors({
            status: "warning",
            message:
              "Test case execution was aborted due to errors with the test case JSON.",
          });
          return;
        }
      } catch (error) {
        setCalculationErrors({
          status: "error",
          message:
            "Test case execution was aborted because JSON could not be validated. If this error persists, please contact the help desk.",
        });
        return;
      } finally {
        setExecuting(false);
      }
    }

    try {
      const calculationOutput: CalculationOutput<any> =
        await calculation.current.calculateTestCases(
          measure,
          [modifiedTestCase],
          measureBundle,
          valueSets
        );

      const executionResults = calculationOutput.results;
      const validationResult =
        await testCaseService.current.validateTestCaseBundle(
          JSON.parse(editorVal)
        );
      handleHapiOutcome(validationResult);
      setCalculationErrors(undefined);
      setPopulationGroupResults(
        executionResults[0].detailedResults as DetailedPopulationGroupResult[]
      );
      // if (measure?.cql) {
      // const definitions = new Array<ExpressionDefinition>();
      // const expressions = new CqlAntlr(measure.cql).parse()
      //   .expressionDefinitions;
      // expressions.forEach(expression => {
      //   const defName = expression.name.slice(1, -1);
      //   definitions.push(
      //     {...expression,
      //       callstack: callstackMap[defName]
      //     });
      // });
      // setExpressionDefinitions(definitions);
      // }
    } catch (error) {
      setCalculationErrors({
        status: "error",
        message: error.message,
      });
      setErrors([...errors, error.message]);
    } finally {
      setExecuting(false);
    }
  };

  const discardChanges = () => {
    //To DO: need to optimize it as it is calling the backend
    loadTestCase();
    setDiscardDialogOpen(false);
  };

  function handleTestCaseResponse(
    testCase: TestCase,
    action: "create" | "update"
  ) {
    if (testCase && testCase.id) {
      const validationErrors =
        testCase?.hapiOperationOutcome?.outcomeResponse?.issue;
      if (hasValidHapiOutcome(testCase)) {
        setAlert({
          status: "success",
          message: `Test case ${action}d successfully!`,
        });
      } else {
        const valErrors = validationErrors.map((error) => (
          <li>{error.diagnostics}</li>
        ));
        setAlert({
          status: `${severityOfValidationErrors(validationErrors)}`,
          message: testCaseAlertToast ? (
            <div>
              <h3>
                Changes {action}d successfully but the following{" "}
                {severityOfValidationErrors(validationErrors)}(s) were found
              </h3>
              <ul>{valErrors}</ul>
            </div>
          ) : (
            `Test case updated successfully with ${severityOfValidationErrors(
              validationErrors
            )}s in JSON`
          ),
        });
        handleHapiOutcome(testCase.hapiOperationOutcome);
      }
      updateMeasureStore(action, testCase);
    } else {
      setAlert(() => ({
        status: "error",
        message: `An error occurred - ${action} did not return the expected successful result.`,
      }));
      setErrors([
        ...errors,
        `An error occurred - ${action} did not return the expected successful result.`,
      ]);
    }
  }

  // we need to update measure store with created/updated test case to avoid stale state,
  // otherwise we'll lose testcase updates
  function updateMeasureStore(action: string, testCase: TestCase) {
    const measureCopy = Object.assign({}, measure);
    if (action === "update") {
      // for update action, find and remove stale test case from measure
      measureCopy.testCases = measureCopy.testCases?.filter(
        (tc) => tc.id !== testCase.id
      );
    }
    // add updated test to measure
    if (measureCopy.testCases) {
      measureCopy.testCases.push(testCase);
    } else {
      measureCopy.testCases = [testCase];
    }
    // update measure store
    updateMeasure(measureCopy);
  }

  function isHapiOutcomeIssueCodeInformational(outcome: HapiOperationOutcome) {
    return (
      outcome?.outcomeResponse?.issue.filter(
        (issue) => /^information/.exec(issue.severity) === null
      ).length <= 0
    );
  }

  // TODO: What's the diff between this function and "handleHapiOutcome"?
  // do we need both?
  function hasValidHapiOutcome(testCase: TestCase) {
    return (
      // Consider valid if no hapi outcome. Most likely the editor is empty.
      _.isNil(testCase.hapiOperationOutcome) ||
      ((testCase.hapiOperationOutcome.code === 200 ||
        testCase.hapiOperationOutcome.code === 201) &&
        isHapiOutcomeIssueCodeInformational(testCase?.hapiOperationOutcome))
    );
  }

  function handleHapiOutcome(outcome: HapiOperationOutcome) {
    if (
      _.isNil(outcome) ||
      (outcome.successful !== false &&
        (outcome.code === 200 || outcome.code === 201) &&
        isHapiOutcomeIssueCodeInformational(outcome))
    ) {
      setValidationErrors(() => []);
      return [];
    }
    if (
      outcome.outcomeResponse?.issue?.length > 0 &&
      !isHapiOutcomeIssueCodeInformational(outcome)
    ) {
      const ves = outcome.outcomeResponse.issue.map((issue, index) => ({
        ...issue,
        key: index,
      }));
      setValidationErrors(() => ves);
      return ves;
    } else {
      const error =
        outcome.outcomeResponse?.text ||
        outcome.message ||
        `HAPI FHIR returned error code ${outcome.code} but no discernible error message`;
      const ves = [{ key: 0, diagnostics: error }];
      setValidationErrors(ves);
      return ves;
    }
  }

  function formikErrorHandler(name: string) {
    if (formik.touched[name] && formik.errors[name]) {
      return `${formik.errors[name]}`;
    }
  }

  function isModified() {
    if (testCase) {
      if (
        _.isNil(testCase?.json) &&
        !_.isNil(editorVal) &&
        _.isEmpty(editorVal.trim()) &&
        !formik.dirty
      ) {
        return false;
      } else {
        return (
          formik.isValid &&
          (formik.dirty ||
            editorVal !== testCase?.json ||
            !_.isEqual(
              _.cloneDeep(testCase?.groupPopulations),
              _.cloneDeep(formik.values.groupPopulations)
            ))
        );
      }
    } else {
      return formik.isValid && formik.dirty;
    }
  }

  function isJsonModified() {
    return testCase && (!_.isNil(testCase?.json) || !_.isEmpty(editorVal))
      ? editorVal !== testCase?.json
      : !isEmptyTestCaseJsonString(editorVal);
  }

  const hasErrorSeverity = (validationErrors) => {
    return (
      validationErrors.filter(
        (validationError) => validationError.severity === "error"
      ).length > 0
    );
  };

  const severityOfValidationErrors = (validationErrors) => {
    const errorsWithNoSeverity = validationErrors?.filter(
      (validationError) => !validationError.hasOwnProperty("severity")
    ).length;
    const nonInformationalErrors = validationErrors?.filter(
      (validationError) =>
        /^information/.exec(validationError.severity) === null
    ).length;
    if (nonInformationalErrors > 0) {
      if (hasErrorSeverity(validationErrors) || errorsWithNoSeverity > 0) {
        return "error";
      }
      return "warning";
    }
    if (_.isNil(nonInformationalErrors)) {
      return "error";
    }
    return "info";
  };

  const readTestFileCb = (testCaseBundle: Bundle, errorMessage: string) => {
    if (errorMessage) {
      showToast(errorMessage, "danger");
    } else {
      setEditorVal(JSON.stringify(testCaseBundle, null, "\t"));
      showToast(
        "Test Case JSON copied into editor. QI-Core Defaults have been added. Please review and save your Test Case.",
        "success"
      );
    }
  };
  const updateTestCaseJson = (file) => {
    testCaseService.current
      .scanImportFile(file)
      .then((response: ScanValidationDto) => {
        if (response.valid) {
          testCaseService.current.readTestCaseFile(file, readTestFileCb);
        } else {
          showToast(response.error.defaultMessage, "danger");
        }
      })
      .catch((errors) => {
        showToast(
          "An error occurred while importing the test case, please try again. If the error persists, please contact the help desk.",
          "danger"
        );
      });
  };

  const allotmentRef = useRef(null);

  return (
    <TestCaseForm
      data-testid="create-test-case-form"
      id="edit-test-case-qi-core"
      onSubmit={formik.handleSubmit}
    >
      <EditTestCaseBreadCrumbs testCase={testCase} measureId={measureId} />
      <div className="allotment-wrapper">
        <Allotment
          minSize={10}
          ref={allotmentRef}
          defaultSizes={[200, 200, 10]}
          vertical={false}
          onDragEnd={resizeEditor}
        >
          <Allotment.Pane>
            {featureFlags?.qiCoreElementsTab ? (
              <div className="nav-panel">
                <div className="tab-container">
                  <CreateTestCaseLeftPanelNavTabs
                    leftPanelActiveTab={leftPanelActiveTab}
                    setLeftPanelActiveTab={setLeftPanelActiveTab}
                  />
                </div>

                <QiCoreResourceProvider>
                  {leftPanelActiveTab === "elements" && (
                    <div className="panel-content">
                      <div data-testid="elements-content">
                        <ElementsTab
                          canEdit={canEdit}
                          setEditorVal={setEditorVal}
                          editorVal={editorVal}
                        />
                      </div>
                    </div>
                  )}
                  {leftPanelActiveTab === "json" && (
                    <Editor
                      onChange={(val: string) => setEditorVal(val)}
                      value={editorVal}
                      setEditor={setEditor}
                      readOnly={!canEdit || _.isNil(testCase)}
                      height="100%"
                    />
                  )}
                </QiCoreResourceProvider>
              </div>
            ) : (
              <div className="left-panel">
                <Editor
                  onChange={(val: string) => setEditorVal(val)}
                  value={editorVal}
                  setEditor={setEditor}
                  readOnly={!canEdit || _.isNil(testCase)}
                  height="100%"
                />
              </div>
            )}
          </Allotment.Pane>

          <Allotment.Pane>
            <div className="right-panel">
              <CreateTestCaseRightPanelNavTabs
                rightPanelActiveTab={rightPanelActiveTab}
                setRightPanelActiveTab={setRightPanelActiveTab}
              />
              {rightPanelActiveTab === "measurecql" &&
                (!measure?.cqlErrors ? (
                  <div
                    data-testid="test-case-cql-editor"
                    id="test-case-cql-editor"
                    style={{ height: "calc(100% - 24px)" }}
                  >
                    <MadieEditor
                      value={measure?.cql}
                      height="100%"
                      readOnly={true}
                      validationsEnabled={false}
                    />
                  </div>
                ) : (
                  <div data-testid="test-case-cql-has-errors-message">
                    An error exists with the measure CQL, please review the CQL
                    Editor tab
                  </div>
                ))}
              {rightPanelActiveTab === "highlighting" && (
                <div className="panel-content" style={{ marginRight: "15px" }}>
                  {executing ? (
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <MadieSpinner style={{ height: 50, width: 50 }} />
                    </div>
                  ) : (
                    <CalculationResults
                      calculationResults={populationGroupResults}
                      calculationErrors={calculationErrors}
                      groupPopulations={groupPopulations}
                      cqlDefinitionCallstack={callstackMap}
                    />
                  )}
                </div>
              )}
              {rightPanelActiveTab === "expectoractual" && (
                <div className="panel-content">
                  <ExpectedActual
                    canEdit={canEdit}
                    groupPopulations={groupPopulations}
                    executionRun={!_.isNil(populationGroupResults)}
                    errors={formik.errors.groupPopulations}
                    onChange={(
                      groupPopulations,
                      changedGroupId,
                      changedPopulation
                    ) => {
                      const stratOutput = triggerPopChanges(
                        groupPopulations,
                        changedGroupId,
                        changedPopulation,
                        measure?.groups
                      );
                      formik.setFieldValue(
                        "groupPopulations",
                        stratOutput as GroupPopulation[]
                      );
                    }}
                    onStratificationChange={(
                      groupPopulations,
                      changedGroupId,
                      changedStratification
                    ) => {
                      const stratOutput = triggerPopChanges(
                        groupPopulations,
                        changedGroupId,
                        changedStratification,
                        measure?.groups
                      );
                      formik.setFieldValue(
                        "groupPopulations",
                        stratOutput as GroupPopulation[]
                      );
                    }}
                  />
                </div>
              )}
              {/*
            Independent views should be their own components when possible
            This will allow for independent unit testing and help render performance.
           */}

              {rightPanelActiveTab === "details" && (
                <div className="panel-content">
                  {alert &&
                    (testCaseAlertToast ? (
                      <MadieAlert
                        type={alert?.status}
                        content={alert?.message}
                        alertProps={{
                          "data-testid": "create-test-case-alert",
                        }}
                        closeButtonProps={{
                          "data-testid": "close-create-test-case-alert",
                        }}
                      />
                    ) : (
                      <Alert
                        status={alert?.status}
                        role="alert"
                        aria-label="Create Alert"
                        data-testid="create-test-case-alert"
                      >
                        {alert?.message}
                        <button
                          data-testid="close-create-test-case-alert"
                          type="button"
                          tw="box-content h-4 p-1 ml-3 mb-1.5"
                          data-bs-dismiss="alert"
                          aria-label="Close Alert"
                          onClick={() => setAlert(null)}
                        >
                          <FontAwesomeIcon icon={faTimes} />
                        </button>
                      </Alert>
                    ))}

                  {/* TODO Replace with re-usable form component
               label, input, and error => single input control component */}

                  <div tw="flex flex-col flex-wrap p-5 w-9/12">
                    <TextField
                      placeholder="Test Case Title"
                      required
                      disabled={!canEdit}
                      label="Title"
                      id="test-case-title"
                      inputProps={{
                        "data-testid": "test-case-title",
                        "aria-describedby": "title-helper-text",
                        "aria-required": true,
                        required: true,
                      }}
                      helperText={formikErrorHandler("title")}
                      size="small"
                      error={
                        formik.touched.title && Boolean(formik.errors.title)
                      }
                      {...formik.getFieldProps("title")}
                    />
                    <div tw="mt-4">
                      <TextArea
                        placeholder="Test Case Description"
                        id="test-case-description"
                        data-testid="edit-test-case-description"
                        disabled={!canEdit}
                        {...formik.getFieldProps("description")}
                        label="Description"
                        required={false}
                        inputProps={{
                          "data-testid": "test-case-description",
                          "aria-describedby": "description-helper-text",
                        }}
                        onChange={formik.handleChange}
                        value={formik.values.description}
                        error={
                          formik.touched.description &&
                          Boolean(formik.errors.description)
                        }
                        helperText={formikErrorHandler("description")}
                      />
                    </div>

                    <div
                      tw="-mt-5"
                      style={{
                        marginTop: 10,
                      }}
                    >
                      <label
                        htmlFor="test-case-series"
                        tw="text-gray-980"
                        style={{
                          fontFamily: "Rubik",
                          fontSize: "14px",
                          textTransform: "capitalize",
                        }}
                      >
                        Group
                      </label>
                      <TestCaseSeries
                        disabled={!canEdit}
                        value={formik.values.series}
                        onChange={(nextValue) =>
                          formik.setFieldValue("series", nextValue)
                        }
                        seriesOptions={seriesState.series}
                        sx={testCaseSeriesStyles}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Allotment.Pane>
          <Allotment.Pane>
            <div className="validation-panel">
              {showValidationErrors ? (
                <aside
                  tw="w-full h-full flex flex-col"
                  data-testid="open-json-validation-errors-aside"
                >
                  <button
                    data-testid="hide-json-validation-errors-button"
                    onClick={() => {
                      setShowValidationErrors((prevState) => {
                        allotmentRef.current.resize([200, 200, 10]);
                        return !prevState;
                      });
                    }}
                  >
                    <StyledIcon
                      icon={faExclamationCircle}
                      errorSeverity={severityOfValidationErrors(
                        validationErrors
                      )}
                    />
                    Validation Errors
                  </button>

                  <div
                    tw="h-full flex flex-col overflow-y-scroll"
                    data-testid="json-validation-errors-list"
                    className="validation-content"
                  >
                    {validationErrors && validationErrors.length > 0 ? (
                      validationErrors
                        .filter(
                          (error) =>
                            /^information/.exec(error?.severity) === null
                        )
                        .map((error) => {
                          return (
                            <ValidationAlertCard
                              key={error.key}
                              status={
                                error.diagnostics.includes("Meta.profile")
                                  ? "meta"
                                  : error.severity
                                  ? error.severity
                                  : "error"
                              }
                            >
                              {error.diagnostics.includes("Meta.profile")
                                ? "Meta.profile: "
                                : error.severity
                                ? error.severity.charAt(0).toUpperCase() +
                                  error.severity.slice(1) +
                                  ": "
                                : ""}
                              {error.diagnostics}
                            </ValidationAlertCard>
                          );
                        })
                    ) : (
                      <span>Nothing to see here!</span>
                    )}
                  </div>
                </aside>
              ) : (
                <aside
                  tw="h-full w-full"
                  data-testid="closed-json-validation-errors-aside"
                >
                  <ValidationErrorsButton
                    data-testid="show-json-validation-errors-button"
                    onClick={() =>
                      setShowValidationErrors((prevState) => {
                        allotmentRef.current.resize([200, 200, 50]);
                        resizeEditor();
                        return !prevState;
                      })
                    }
                  >
                    <StyledIcon
                      icon={faExclamationCircle}
                      errorSeverity={severityOfValidationErrors(
                        validationErrors
                      )}
                    />
                    Validation Errors
                  </ValidationErrorsButton>
                </aside>
              )}
            </div>
          </Allotment.Pane>
        </Allotment>

        <div tw="bg-gray-75 w-full sticky bottom-0 left-0 z-40">
          <div tw="flex items-center">
            <div tw="w-1/2 flex items-center px-2">
              {canEdit && <FileUploader onFileImport={updateTestCaseJson} />}
            </div>
            <div
              tw="w-1/2 flex justify-end items-center px-10 py-6"
              style={{ alignItems: "end" }}
            >
              <Button
                tw="m-2"
                variant="outline"
                onClick={() => setDiscardDialogOpen(true)}
                data-testid="edit-test-case-discard-button"
                disabled={!isModified()}
              >
                Discard Changes
              </Button>
              <Button
                tw="m-2"
                type="button"
                onClick={calculate}
                disabled={
                  !!measure?.cqlErrors ||
                  measure?.errors?.includes(
                    MeasureErrorType.MISMATCH_CQL_POPULATION_RETURN_TYPES
                  ) ||
                  _.isNil(measure?.groups) ||
                  measure?.groups.length === 0 ||
                  (!isJsonModified() && hasErrorSeverity(validationErrors)) ||
                  isEmptyTestCaseJsonString(editorVal) ||
                  !executionContextReady ||
                  executing
                }
                /*
                  if new test case
                    enable run button if json modified, regardless of errors
                 */
                data-testid="run-test-case-button"
              >
                Run Test Case
              </Button>
              {canEdit && (
                <Button
                  tw="m-2"
                  variant="cyan"
                  type="submit"
                  data-testid="edit-test-case-save-button"
                  disabled={!isModified()}
                >
                  Save
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      <MadieDiscardDialog
        open={discardDialogOpen}
        onClose={() => setDiscardDialogOpen(false)}
        onContinue={discardChanges}
      />
      <Toast
        toastKey="edit-action-toast"
        aria-live="polite"
        toastType={toastType}
        testId={toastType === "danger" ? "error-toast" : "success-toast"}
        closeButtonProps={{
          "data-testid": "close-toast-button",
        }}
        open={toastOpen}
        message={toastMessage}
        onClose={onToastClose}
        autoHideDuration={10000}
      />
    </TestCaseForm>
  );
};

export default EditTestCase;
