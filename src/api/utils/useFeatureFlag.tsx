import React from "react";
import { ServiceConfig, useServiceConfig } from "@madie/madie-util";

/**
 * Get the current state of the target feature flag.
 * @See feature flags in Service Config JSON.
 * @param feature: string name of the target flag.
 * @returns enabled: boolean true, the feature has been enabled.
 *    False, the target feature is disabled or the flag was not found.
 */
export default function useFeature(feature: string): boolean {
  const serviceConfig: ServiceConfig = useServiceConfig();
  return serviceConfig?.features?.[feature] ?? false;
}
