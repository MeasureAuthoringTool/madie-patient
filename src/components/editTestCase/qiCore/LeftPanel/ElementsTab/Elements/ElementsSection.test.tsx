import * as React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ElementsSection from "./ElementsSection";

describe("Display Elements Section", () => {
  it("should display elements section", () => {
    render(<ElementsSection canEdit={true} />);

    expect(screen.getByText("Elements Section")).toBeInTheDocument();
  });
});
