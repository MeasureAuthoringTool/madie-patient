import * as React from "react";

export interface QiCoreResourceContextType {
  state: { resource };
  dispatch: React.Dispatch<any>;
}

export enum ResourceActionType {
  LOAD_RESOURCE = "LoadResource",
}

export interface QiCoreResourceAction {
  type: ResourceActionType;
  payload: any;
}

const QiCoreResourceContext =
  React.createContext<QiCoreResourceContextType>(null);

/**
 * @param state
 * @param action
 */
export function resourceReducer(state, action: QiCoreResourceAction) {
  switch (action.type) {
    case ResourceActionType.LOAD_RESOURCE: {
      return { ...state, resource: action.payload };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function QiCoreResourceProvider({ children }) {
  const [state, dispatch] = React.useReducer(resourceReducer, {
    resource: null,
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
