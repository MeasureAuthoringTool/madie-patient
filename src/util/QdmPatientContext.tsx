import * as React from "react";
import { QDMPatient, DataElement } from "cqm-models";
import { useFormik, useFormikContext } from "formik";

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

function patientReducer(state, action: QdmPatientAction) {
  switch (action.type) {
    case PatientActionType.LOAD_PATIENT: {
      return { patient: action.payload };
      // return { patient: JSON.parse(action.payload) as QDMPatient };
    }
    case PatientActionType.ADD_DATA_ELEMENT: {
      // TODO: fill this in
      return state;
    }
    case PatientActionType.REMOVE_DATA_ELEMENT: {
      // TODO: fill this in
      return state;
    }
    case PatientActionType.MODIFY_DATA_ELEMENT: {
      // TODO: fill this in
      return state;
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function QdmPatientProvider({ children }) {
  const [state, dispatch] = React.useReducer(patientReducer, { patient: new QDMPatient() });
  // NOTE: you *might* need to memoize this value
  // Learn more in http://kcd.im/optimize-context
  const formik = useFormikContext();
  const foo = () => {
    console.log("foo!", formik);
  };
  const value = { state, dispatch, foo };
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
