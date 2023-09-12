import React, { useContext } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import events from "events";
import DemographicsSection from "./DemographicsSection";
import { within } from "@testing-library/dom";
import { shallow } from "enzyme";

import { QiCoreResourceProvider } from "../../../../../../util/QiCorePatientProvider";

describe("Display Demographics Section", () => {
  it("should display demographics section", () => {
    render(
      <QiCoreResourceProvider>
        <DemographicsSection canEdit={true} />
      </QiCoreResourceProvider>
    );

    expect(screen.getByText("Ethnicity (OMB)")).toBeInTheDocument();
  });
});

it.only("Shows 'Ethnicity (Detailed)' selection when Hispanic is chosen", async () => {
  render(
    <QiCoreResourceProvider>
      <DemographicsSection canEdit={true} />
    </QiCoreResourceProvider>
  );
  const ethnicityOmbSelect = await screen.getByTestId(
    "demographics-ethnicity-omb-select-id"
  );
  const selectDropdown = within(ethnicityOmbSelect).getByRole(
    "button"
  ) as HTMLInputElement;
  userEvent.click(selectDropdown);
  const selectOption = screen.getByText("Hispanic or Latino");
  expect(selectOption).toBeInTheDocument();

  const options = await screen.findAllByRole("option");

  fireEvent.click(options[1]);
  expect(screen.getByText("Ethnicity (Detailed)")).toBeInTheDocument();
});

// it("Handles OMB Race Change correctly", async () => {
//   const wrapper = shallow(<DemographicsSection canEdit={true} />);
//   wrapper.debug;
//   const button = wrapper.find('div[children="Click"]');
//   expect(wrapper.find('div[children="simple text"]').exists()).toBeFalsy();
//   button.simulate('mousedown');
//   expect(wrapper.find('div[children="simple text"]').exists()).toBeTruthy();

// });
