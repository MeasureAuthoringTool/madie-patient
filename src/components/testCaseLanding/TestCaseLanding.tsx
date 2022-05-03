import React from "react";
import "twin.macro";
import "styled-components/macro";
import { Button } from "@madie/madie-components";
import { Link } from "react-router-dom";
import TestCaseList from "../testCaseList/TestCaseList";

const TestCaseLanding = () => {
  return (
    <div tw="m-2">
      <section>
        <TestCaseList />
      </section>
    </div>
  );
};

export default TestCaseLanding;
