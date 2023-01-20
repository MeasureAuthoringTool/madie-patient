declare module "@madie/madie-util" {
  import { LifeCycleFn } from "single-spa";
  import { Consumer, Provider } from "react";
  import { Measure, Acl } from "@madie/madie-models/dist/Measure";

  export interface OktaConfig {
    baseUrl: string;
    issuer: string;
    clientId: string;
    redirectUri: string;
  }

  export interface ServiceConfig {
    measureService: {
      baseUrl: string;
    };
    elmTranslationService: {
      baseUrl: string;
    };
    terminologyService: {
      baseUrl: string;
    };
    testCaseService: {
      baseUrl: string;
    };
    features: {
      export: boolean;
      measureVersioning: boolean;
      applyDefaults: boolean;
    };
  }

  export interface RouteHandlerState {
    canTravel: boolean;
    pendingRoute: string;
  }

  export const measureStore: {
    subscribe: (
      setMeasureState: React.Dispatch<React.SetStateAction<Measure>>
    ) => import("rxjs").Subscription;
    updateMeasure: (measure: Measure | null) => void;
    initialState: null;
    state: Measure;
  };

  export const routeHandlerStore: {
    subscribe: (
      setRouteHandlerState: React.Dispatch<React.SetStateAction<object>>
    ) => import("rxjs").Subscription;
    updateRouteHandlerState: (routeHandlerState: RouteHandlerState) => void;
    initialState: RouteHandlerState;
    state: RouteHandlerState;
  };

  export function getServiceConfig(): Promise<ServiceConfig>;
  export function useServiceConfig(): ServiceConfig;
  export const ApiContextConsumer: Consumer<ServiceConfig>;
  export const ApiContextProvider: Provider<ServiceConfig>;
  export function useFeatureFlag(feature: string): boolean;

  export function useKeyPress(targetKey: any): boolean;
  export const useOktaTokens: (storageKey?: string) => {
    getAccessToken: () => any;
    getAccessTokenObj: () => any;
    getUserName: () => any;
    getIdToken: () => any;
    getIdTokenObj: () => any;
  };
  export function useOnClickOutside(ref: any, handler: any): void;

  export function checkUserCanEdit(
    createdBy: string,
    acls: Array<Acl>
  ): boolean;

  export class TerminologyServiceApi {
    constructor(baseUrl: string, getAccessToken: () => string);
    checkLogin(): Promise<Boolean>;
    loginUMLS(apiKey: string): Promise<string>;
  }
  export function useTerminologyServiceApi(): TerminologyServiceApi;

  export function useDocumentTitle(
    title: string,
    prevailOnMount?: boolean
  ): void;

  export const bootstrap: LifeCycleFn<void>;
  export const mount: LifeCycleFn<void>;
  export const unmount: LifeCycleFn<void>;
}
