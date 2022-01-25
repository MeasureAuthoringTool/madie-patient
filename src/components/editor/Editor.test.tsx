import * as React from "react";
import { render, screen } from "@testing-library/react";
import Editor from "./Editor";

describe("CreateTestCase component", () => {
  it("should render Editor Component", () => {
    const container = render(<Editor />);
    expect(container).toBeDefined();
  });
});
