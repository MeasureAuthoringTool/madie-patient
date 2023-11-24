import * as React from "react";
import { render, screen } from "@testing-library/react";
import FacilityLocation from "./FacilityLocation";

export const mockValueSets = [
  {
    display_name: "Encounter Inpatient",
    version: "2023-03",
    concepts: [
      {
        code: "183452005",
        code_system_name: "SNOMEDCT",
        code_system_oid: "1.2.3",
        code_system_version: "2023-03",
        display_name: "Snomed Emergency hospital admission (procedure)",
      },
      {
        code: "305686008",
        code_system_name: "SNOMEDCT",
        code_system_oid: "1.2.3",
        code_system_version: "2023-03",
        display_name: "Seen by palliative care physician (finding)",
      },
    ],
    oid: "1.2.3.4.5",
  },
  {
    display_name: "Palliative Care Intervention",
    version: "2023-03",
    concepts: [
      {
        code: "443761007",
        code_system_name: "SNOMEDCT",
        code_system_oid: "1.2.3",
        code_system_version: "2023-03",
        display_name: "Anticipatory palliative care (regime/therapy)",
      },
    ],
    oid: "7.8.9.10",
  },
];
const mockOnChange = jest.fn();

jest.mock("@madie/madie-util", () => ({
  routeHandlerStore: {
    subscribe: (set) => {
      set();
      return { unsubscribe: () => null };
    },
    updateRouteHandlerState: () => null,
    state: { canTravel: true, pendingPath: "" },
    initialState: { canTravel: true, pendingPath: "" },
  },
}));

describe("FacilityLocation Component", () => {
  it("should render FacilityLocation view", () => {
    render(
      <FacilityLocation
        onChange={mockOnChange}
        valueSets={mockValueSets}
        canEdit
      />
    );
    expect(screen.getByTestId("value-set-selector")).toBeInTheDocument();
    expect(screen.getByTestId("location-period-start")).toBeInTheDocument();
    expect(screen.getByTestId("location-period-end")).toBeInTheDocument();
  });
});
