import React from "react";
import { Route, Routes } from "react-router-dom";
import TestCaseLanding from "../testCaseLanding/TestCaseLanding";
import CreateTestCase from "../createTestCase/CreateTestCase";
import NotFound from "../notfound/NotFound";

const TestCaseRoutes = () => {
  return (
    <Routes>
      <Route path="/measures/:measureId/edit/test-cases">
        <Route index element={<TestCaseLanding />} />
        <Route path="create" element={<CreateTestCase />} />
        <Route path=":id" element={<CreateTestCase />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default TestCaseRoutes;
