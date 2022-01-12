import { createContext } from "react";

export interface ServiceConfig {
  testCaseService: {
    baseUrl: string;
  };
}

const ServiceContext = createContext<ServiceConfig>(null);

export default ServiceContext;

export const ApiContextProvider = ServiceContext.Provider;
export const ApiContextConsumer = ServiceContext.Consumer;
