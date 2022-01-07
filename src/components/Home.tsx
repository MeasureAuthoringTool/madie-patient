import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import TestCaseLanding from "./testCaseLanding/TestCaseLanding";
import CreateTestCase from "./createTestCase/CreateTestCase";

export default function Home() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/measure/:measureId/edit/patients">
            <Route index element={<TestCaseLanding />} />
            <Route path="create" element={<CreateTestCase />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}
