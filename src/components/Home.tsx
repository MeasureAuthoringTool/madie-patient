import React from "react";
import { BrowserRouter } from "react-router-dom";
import TestCaseLayout from "./layout/TestCaseLayout";

export default function Home() {
  return (
    <BrowserRouter>
      <TestCaseLayout />
    </BrowserRouter>
  );
}
