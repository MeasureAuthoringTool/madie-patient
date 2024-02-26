import React, { useState, useEffect } from "react";
import "twin.macro";
import "styled-components/macro";
import { Group } from "@madie/madie-models";
import * as _ from "lodash";
import TestCaseListSideBarNav from "./TestCaseListSideBarNav";
import { measureStore, useFeatureFlags } from "@madie/madie-util";

const TestCaseLandingWrapper = (props) => {
  const [measure, setMeasure] = useState<any>(measureStore.state);
  useEffect(() => {
    const subscription = measureStore.subscribe(setMeasure);
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  return (
    <div
      tw="grid lg:grid-cols-6 gap-4 mx-8 my-6 shadow-lg rounded-md border border-slate bg-white"
      style={{ marginTop: 16 }}
    >
      <>
        <TestCaseListSideBarNav
          allPopulationCriteria={measure?.groups}
          qdm={props.qdm}
        />
        <div tw="lg:col-span-5 pl-2 pr-2">
          {props.children && props.children}
        </div>
      </>
    </div>
  );
};

export default TestCaseLandingWrapper;
