import * as React from "react";
import * as _ from "lodash";
import { v4 as uuidv4 } from "uuid";
import { PatientActionType } from "./QdmPatientContext";

export interface QiCoreResourceContextType {
  state: { bundle: any };
  dispatch: React.Dispatch<any>;
}

export enum ResourceActionType {
  LOAD_BUNDLE = "LoadBundle",
  ADD_BUNDLE_ENTRY = "AddBundleEntry",
  REMOVE_BUNDLE_ENTRY = "RemoveBundleEntry",
  MODIFY_BUNDLE_ENTRY = "ModifyBundleEntry",
}

export interface QiCoreResourceAction {
  type: ResourceActionType;
  payload: any;
}

const QiCoreResourceContext =
  React.createContext<QiCoreResourceContextType>(null);

// TODO: replace with JSON template?
const INITIAL_BUNDLE = {
  resourceType: "Bundle",
  type: "collection",
  entry: [],
};

/**
 * @param state
 * @param action
 */
export function resourceReducer(state, action: QiCoreResourceAction) {
  switch (action.type) {
    case ResourceActionType.LOAD_BUNDLE: {
      return { ...state, bundle: action.payload };
    }
    case ResourceActionType.ADD_BUNDLE_ENTRY: {
      let bundle = _.isNil(state.bundle)
        ? { id: uuidv4(), ...INITIAL_BUNDLE }
        : state.bundle;
      if (_.isEmpty(bundle.entry)) {
        bundle.entry = [{ ...action.payload }];
      } else {
        bundle.entry = [...bundle.entry, { ...action.payload }];
      }
      return { ...state, bundle };
    }
    case ResourceActionType.REMOVE_BUNDLE_ENTRY: {
      let bundle = _.isNil(state.bundle)
        ? { id: uuidv4(), ...INITIAL_BUNDLE }
        : state.bundle;
      if (bundle.entry) {
        bundle.entry = bundle.entry.filter(
          (entry) => entry?.resource?.id !== action.payload.resource.id
        );
      }
      return { ...state, bundle };
    }
    case ResourceActionType.MODIFY_BUNDLE_ENTRY: {
      let bundle = _.isNil(state.bundle)
        ? { id: uuidv4(), ...INITIAL_BUNDLE }
        : state.bundle;
      if (bundle.entry) {
        bundle.entry = bundle.entry.map((entry) => {
          if (entry?.resource.id === action.payload.resource?.id) {
            return action.payload;
          }
          return entry;
        });
      }
      return { ...state, bundle };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function QiCoreResourceProvider({ children }) {
  const [state, dispatch] = React.useReducer(resourceReducer, {
    resource: null,
    bundle: null,
  });

  const value = { state, dispatch };
  return (
    <QiCoreResourceContext.Provider value={value}>
      {children}
    </QiCoreResourceContext.Provider>
  );
}

function useQiCoreResource() {
  const context = React.useContext(QiCoreResourceContext);
  if (context === undefined) {
    throw new Error("useCount must be used within a CountProvider");
  }
  return context;
}

export { QiCoreResourceProvider, useQiCoreResource };
