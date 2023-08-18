import * as React from "react";
import { PatientActionType, patientReducer } from "./QdmPatientContext";
import {
  QDMPatient,
  AssessmentPerformed,
  EncounterPerformed,
  DeviceOrder,
} from "cqm-models";
import cql from "cql-execution";
import * as _ from "lodash";

describe("QDM Patient Context", () => {
  test("patientReducer LOAD_PATIENT should return state with patient loaded", () => {
    const initialState = { patient: null };
    const patient = new QDMPatient();
    const output = patientReducer(initialState, {
      type: PatientActionType.LOAD_PATIENT,
      payload: patient,
    });
    expect(output).toBeTruthy();
    expect(output.patient).toEqual(patient);
  });

  test("patientReducer ADD_DATA_ELEMENT should return state elements array with single element", () => {
    const patient = new QDMPatient();
    patient.dataElements = null;
    const initialState = { patient };
    const encounter: EncounterPerformed = new EncounterPerformed();
    const output = patientReducer(initialState, {
      type: PatientActionType.ADD_DATA_ELEMENT,
      payload: encounter,
    });
    expect(output).toBeTruthy();
    expect(output.patient).toEqual(patient);
    expect(output.patient.dataElements).toBeTruthy();
    expect(output.patient.dataElements.length).toEqual(1);
    expect(output.patient.dataElements[0]).toEqual(encounter);
  });

  test("patientReducer ADD_DATA_ELEMENT should return state elements array with single element when initial patient is Nil", () => {
    const initialState = { patient: null };
    const encounter: EncounterPerformed = new EncounterPerformed();
    const output = patientReducer(initialState, {
      type: PatientActionType.ADD_DATA_ELEMENT,
      payload: encounter,
    });
    expect(output).toBeTruthy();
    expect(output.patient).toBeTruthy();
    expect(output.patient.dataElements).toBeTruthy();
    expect(output.patient.dataElements.length).toEqual(1);
    expect(output.patient.dataElements[0]).toEqual(encounter);
  });

  test("patientReducer ADD_DATA_ELEMENT should return state elements array with multiple elements", () => {
    const patient = new QDMPatient();
    const initialState = { patient };
    const assessment: AssessmentPerformed = new AssessmentPerformed();
    patient.dataElements = [assessment];
    const encounter: EncounterPerformed = new EncounterPerformed();
    const output = patientReducer(initialState, {
      type: PatientActionType.ADD_DATA_ELEMENT,
      payload: encounter,
    });
    expect(output).toBeTruthy();
    expect(output.patient).toEqual(patient);
    expect(output.patient.dataElements).toBeTruthy();
    expect(output.patient.dataElements.length).toEqual(2);
    expect(output.patient.dataElements[0]).toEqual(assessment);
    expect(output.patient.dataElements[1]).toEqual(encounter);
  });

  test("patientReducer REMOVE_DATA_ELEMENT should return state elements array with target removed", () => {
    const patient = new QDMPatient();
    const initialState = { patient };
    const assessment: AssessmentPerformed = new AssessmentPerformed();
    const encounter: EncounterPerformed = new EncounterPerformed();
    patient.dataElements = [assessment, encounter];
    const output = patientReducer(initialState, {
      type: PatientActionType.REMOVE_DATA_ELEMENT,
      payload: encounter,
    });
    expect(output).toBeTruthy();
    expect(output.patient).toEqual(patient);
    expect(output.patient.dataElements).toBeTruthy();
    expect(output.patient.dataElements.length).toEqual(1);
    expect(output.patient.dataElements[0]).toEqual(assessment);
  });

  test("patientReducer MODIFY_DATA_ELEMENT should return unchanged elements array for target not in array", () => {
    const patient = new QDMPatient();
    const initialState = { patient };
    const assessment: AssessmentPerformed = new AssessmentPerformed();
    const encounter: EncounterPerformed = new EncounterPerformed();
    const deviceOrder: DeviceOrder = new DeviceOrder();
    patient.dataElements = [assessment, encounter, deviceOrder];

    const modifiedEncounter: EncounterPerformed = new EncounterPerformed(
      encounter
    );
    modifiedEncounter.dischargeDisposition = new cql.Code(
      "22157005",
      "2.16.840.1.113883.6.96",
      null,
      "Acute peptic ulcer with hemorrhage but without obstruction (disorder)"
    );

    const output = patientReducer(initialState, {
      type: PatientActionType.MODIFY_DATA_ELEMENT,
      payload: modifiedEncounter,
    });
    expect(output).toBeTruthy();
    expect(output.patient).toEqual(patient);
    expect(output.patient.dataElements).toBeTruthy();
    expect(output.patient.dataElements.length).toEqual(3);
    expect(output.patient.dataElements[0]).toEqual(assessment);
    const encounterElement = output.patient.dataElements[1];
    expect(output.patient.dataElements[2]).toEqual(deviceOrder);
    expect(encounterElement).toBeTruthy();
    expect(encounterElement.id).toEqual(encounter.id);
    expect(encounter.dischargeDisposition).toBeFalsy();
    expect(encounterElement.dischargeDisposition).toBeTruthy();
    expect(_.isEqual(encounterElement, encounter)).toBeFalsy();
  });

  test("patientReducer UNKNOWN should return error for unknown action type", () => {
    const patient = new QDMPatient();
    const initialState = { patient };
    try {
      patientReducer(initialState, {
        type: "UNKNOWN" as unknown as PatientActionType,
        payload: { foo: "broken" },
      });
    } catch (error) {
      expect(error.message).toEqual("Unhandled action type: UNKNOWN");
    }
  });
});
