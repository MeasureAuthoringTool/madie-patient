import * as React from "react";
import Editor from "./Editor";
import { TestCase } from "@madie/madie-models";
import { configure, mount } from "enzyme";
import * as Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import "jest-enzyme";
import { waitFor, act, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const adapter = Adapter as any;
configure({ adapter: new adapter.default() });

describe("Test Case Editor component", () => {
  it("should render Editor Component", () => {
    const handleChange = jest.fn();
    const container = mount(<Editor value={null} onChange={handleChange} />);
    expect(container).toBeDefined();
  });

  it("should load existing json into the editor", async () => {
    const testCase = {
      id: "1234",
      description: "Test IPP",
      json: `{
              "resourceType": "Patient",
              "id": "example",
              "meta": {
                "profile": [
                  "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-patient"
                ]
              }
            }`,
    } as TestCase;
    const handleChange = jest.fn();
    const wrapper = mount(
      <Editor value={testCase.json} onChange={handleChange} />
    );
    expect(wrapper.find("Editor")).not.toHaveValue("not the correct stuff");
    expect(wrapper.find("Editor")).toHaveValue(testCase.json);
  });

  it("should apply readonly attribute", () => {
    const testCase = {
      id: "1234",
      description: "Test IPP",
      json: `{
              "resourceType": "Patient",
              "id": "example",
              "meta": {
                "profile": [
                  "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-patient"
                ]
              }
            }`,
    } as TestCase;
    const handleChange = jest.fn();
    const wrapper = mount(
      <Editor value={testCase.json} onChange={handleChange} readOnly={true} />
    );

    expect(wrapper.find("Editor")).toHaveValue(testCase.json);
    expect(wrapper.find("Editor")).toHaveProp("readOnly");
  });

  it("set outer editor is called", async () => {
    const testCase = {
      id: "1234",
      description: "Test IPP",
      json: `{
              "resourceType": "Patient",
              "id": "example",
              "meta": {
                "profile": [
                  "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-patient"
                ]
              }
            }`,
    } as TestCase;
    const handleChange = jest.fn();
    const setOuterEditor = jest.fn();
    const wrapper = mount(
      <Editor
        value={testCase.json}
        onChange={handleChange}
        readOnly={true}
        setEditor={setOuterEditor}
      />
    );

    expect(wrapper.find("Editor")).toHaveValue(testCase.json);
    await waitFor(() => {
      expect(setOuterEditor).toHaveBeenCalled();
    });
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
