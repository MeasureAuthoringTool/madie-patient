import * as React from "react";
import { QDMPatient } from "cqm-models";
import { useFormikContext } from "formik";
import * as _ from "lodash";

export interface QdmPatientContextType {
  state: { patient: QDMPatient };
  dispatch: React.Dispatch<any>;
}

export enum PatientActionType {
  LOAD_PATIENT = "LoadPatient",
  ADD_DATA_ELEMENT = "AddDataElement",
  REMOVE_DATA_ELEMENT = "RemoveDataElement",
  MODIFY_DATA_ELEMENT = "ModifyDataElement",
}

export interface QdmPatientAction {
  type: PatientActionType;
  payload: any;
}

const QdmPatientContext = React.createContext<QdmPatientContextType>(null);

/**
 * TODO: consider moving QDMPatient state into formik and the reducer logic into a helper function
 * TODO: look at possible optimization to reduce number of dispatch calls due to changes with input components - do not
 *  invoke dispatch until input value is valid
 * @param state
 * @param action
 */
function patientReducer(state, action: QdmPatientAction) {
  switch (action.type) {
    case PatientActionType.LOAD_PATIENT: {
      return { ...state, patient: action.payload };
    }
    case PatientActionType.ADD_DATA_ELEMENT: {
      let patient = _.isNil(state.patient) ? new QDMPatient() : state.patient;
      if (patient.dataElements) {
        patient.dataElements.push({ ...action.payload });
      } else {
        patient.dataElements = [{ ...action.payload }];
      }
      return { ...state, patient };
    }
    case PatientActionType.REMOVE_DATA_ELEMENT: {
      let patient = _.isNil(state.patient) ? new QDMPatient() : state.patient;
      if (patient.dataElements) {
        patient.dataElements = patient.dataElements.filter(
          (dataElement) => dataElement?.id !== action.payload.id
        );
      }
      return { ...state, patient };
    }
    case PatientActionType.MODIFY_DATA_ELEMENT: {
      let patient = _.isNil(state.patient) ? new QDMPatient() : state.patient;
      if (patient.dataElements) {
        patient.dataElements = patient.dataElements.map((dataElement) => {
          if (dataElement.id === action.payload.id) {
            return action.payload;
          }
          return dataElement;
        });
      }
      return { ...state, patient };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function QdmPatientProvider({ children }) {
  const [state, dispatch] = React.useReducer(patientReducer, {
    patient: null,
  });
  // NOTE: you *might* need to memoize this value
  // Learn more in http://kcd.im/optimize-context
  // tod: decide if we want to directly update formik inside this context
  // const formik = useFormikContext();
  const value = { state, dispatch };
  return (
    <QdmPatientContext.Provider value={value}>
      {children}
    </QdmPatientContext.Provider>
  );
}

function useQdmPatient() {
  const context = React.useContext(QdmPatientContext);
  if (context === undefined) {
    throw new Error("useCount must be used within a CountProvider");
  }
  return context;
}

export { QdmPatientProvider, useQdmPatient };
