import React from "react";
import axios from "axios";
import useServiceConfig from "./useServiceConfig";
import { ServiceConfig } from "./ServiceContext";
import { Measure } from "@madie/madie-models";
import { useOktaTokens } from "@madie/madie-util";
import { Bundle } from "fhir/r4";

export class MeasureServiceApi {
  constructor(private baseUrl: string, private getAccessToken: () => string) {}
  async fetchMeasureBundle(measure: Measure): Promise<Bundle> {
    if (measure.cqlErrors || !measure.elmJson) {
      throw new Error(
        "An error exists with the measure CQL, please review the CQL Editor tab."
      );
    }

    if (!measure.groups) {
      throw new Error(
        "There are no groups associated with this measure. Please review the Groups tab."
      );
    }

    try {
      const response = await axios.get(
        `${this.baseUrl}/measures/${measure.id}/bundles`,
        {
          headers: {
            Authorization: `Bearer ${this.getAccessToken()}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      console.error("Bundle Error", err?.response);
      throw new Error(
        "An error occurred, please try again. If the error persists, please contact the help desk."
      );
    }
  }
}

export default function useMeasureServiceApi(): MeasureServiceApi {
  const serviceConfig: ServiceConfig = useServiceConfig();
  const { getAccessToken } = useOktaTokens();
  const { baseUrl } = serviceConfig.measureService;

  return new MeasureServiceApi(baseUrl, getAccessToken);
}
