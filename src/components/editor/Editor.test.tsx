import * as React from "react";
import Editor from "./Editor";
import { TestCase } from "@madie/madie-models";
import { waitFor, act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const { findByText } = screen;
describe("Test Case Editor component", () => {
  it("should render Editor Component", () => {
    const handleChange = jest.fn();
    const container = render(<Editor value={null} onChange={handleChange} />);
    expect(container).toBeDefined();
  });


  it("calls handleChange on change", async () => {
    jest.useFakeTimers("modern");
    const handleValueChanges = jest.fn();
    const typedValue = "this is invalid CQL";
    const outputProps = {
      height: "500px",
      value: "",
      onChange: handleValueChanges,
      setParseErrors: jest.fn(),
      handleClick: true,
      parseDebounceTime: 300,
      inboundAnnotations: [],
    };

    await act(async () => {
      const result = render(<Editor {...outputProps} />);
      let aceEditor: any = await result.container.querySelector(
        "#ace-editor-wrapper textarea"
      );
      userEvent.paste(aceEditor, typedValue);
      jest.advanceTimersByTime(600);
      expect(handleValueChanges).toBeCalledWith(typedValue);
    });
  });
});
