declare module "@madie/madie-util" {
  import { LifeCycleFn } from "single-spa";
  import { Measure, Acl } from "@madie/madie-models/dist/Measure";

  export interface OktaConfig {
    baseUrl: string;
    issuer: string;
    clientId: string;
    redirectUri: string;
  }

  interface FeatureFlags {
    export: boolean;
    populationCriteriaTabs: boolean;
    importTestCases: boolean;
    qdmTestCases: boolean;
    qiCoreElementsTab: boolean;
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

  export function useFeatureFlags(): FeatureFlags;

  export function getServiceConfig(): Promise<ServiceConfig>;

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
    acls: Array<Acl>,
    draft?: boolean
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

  export function getOidFromString(
    oidString: string,
    dataModel: string
  ): string;

  export const bootstrap: LifeCycleFn<void>;
  export const mount: LifeCycleFn<void>;
  export const unmount: LifeCycleFn<void>;
}
