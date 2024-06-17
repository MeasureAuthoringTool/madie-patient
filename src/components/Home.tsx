import React, { Suspense, useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import RoutesWrapper from "./routes/RoutesWrapper";
import { ServiceConfig, ApiContextProvider } from "../api/ServiceContext";
import axios from "axios";
import { wafIntercept } from "@madie/madie-util";

export default function Home() {
  const [configError, setConfigError] = useState<boolean>(false);
  const [serviceConfig, setServiceConfig] = useState<ServiceConfig | null>(
    null
  );
  axios.interceptors.response.use((response) => {
    return response;
  }, wafIntercept);

  // Use an effect hook to fetch the serviceConfig and set the state
  useEffect(() => {
    axios
      .get<ServiceConfig>("/env-config/serviceConfig.json")
      .then((value) => {
        if (value?.data?.testCaseService?.baseUrl) {
          setServiceConfig(value.data);
        } else {
          console.error("Invalid service config");
          setConfigError(true);
        }
      })
      .catch((reason) => {
        console.error(reason);
        setConfigError(true);
      });
  }, []);
  const errorPage = <div>Error loading service config</div>;

  const loadingState = <div>Loading...</div>;

  const loadedState = (
    <BrowserRouter>
      <ApiContextProvider value={serviceConfig}>
        <Suspense fallback={<div>loading</div>}>
          <RoutesWrapper />
        </Suspense>
      </ApiContextProvider>
    </BrowserRouter>
  );

  let result = serviceConfig === null ? loadingState : loadedState;
  if (configError) {
    result = errorPage;
  }

  return result;
}
