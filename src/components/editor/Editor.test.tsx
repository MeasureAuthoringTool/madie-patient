import * as React from "react";
import Editor from "./Editor";
import TestCase from "../../models/TestCase";
import { configure, mount } from "enzyme";
import * as Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import "jest-enzyme";

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
});
