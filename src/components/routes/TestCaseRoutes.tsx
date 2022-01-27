import React from "react";
import { Route, Routes } from "react-router-dom";
import TestCaseLanding from "../testCaseLanding/TestCaseLanding";
import CreateTestCase from "../createTestCase/CreateTestCase";

const TestCaseRoutes = () => {
  return (
    <Routes>
      <Route path="/measure/:measureId/edit/test-cases">
        <Route index element={<TestCaseLanding />} />
        <Route path="create" element={<CreateTestCase />} />
        <Route path=":id" element={<CreateTestCase />} />
      </Route>
    </Routes>
  );
};

export default TestCaseRoutes;
