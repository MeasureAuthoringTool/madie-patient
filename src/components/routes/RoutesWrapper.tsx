import React, { lazy, useMemo, useState, useEffect } from "react";
import { Measure } from "@madie/madie-models";
import { measureStore } from "@madie/madie-util";

const RoutesWrapper = () => {
  const [measure, setMeasure] = useState<Measure>(measureStore.state);
  useEffect(() => {
    const subscription = measureStore.subscribe(setMeasure);
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const TestCaseRoutesComponent = useMemo(
    () =>
      lazy(() => {
        if (measure?.model.includes("QDM")) {
          return import("./qdm/TestCaseRoutes");
        } else {
          return import("./qiCore/TestCaseRoutes");
        }
      }),
    [measure?.model]
  );

  return <TestCaseRoutesComponent />;
};

export default RoutesWrapper;
