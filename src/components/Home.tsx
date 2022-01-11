import React, { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import TestCaseLayout from "./layout/TestCaseLayout";
import { ServiceConfig, ApiContextProvider } from "../api/ServiceContext";
import axios from "axios";

export default function Home() {
  const [configError, setConfigError] = useState<boolean>(false);
  const [serviceConfig, setServiceConfig] = useState<ServiceConfig | null>(
    null
  );

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
  return (
    <BrowserRouter>
      <ApiContextProvider value={serviceConfig}>
        <TestCaseLayout />
      </ApiContextProvider>
    </BrowserRouter>
  );
}
