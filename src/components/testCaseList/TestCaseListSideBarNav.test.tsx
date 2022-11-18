import * as React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TestCaseListSideBarNav from "./TestCaseListSideBarNav";
import { Group } from "@madie/madie-models";
import userEvent from "@testing-library/user-event";

const groups: Group[] = [
  {
    id: "group1",
    measureGroupTypes: [],
    populations: [],
    stratifications: [],
  },
  {
    id: "group2",
    measureGroupTypes: [],
    populations: [],
    stratifications: [],
  },
];

describe("TestCase component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render no population criteria for null groups array", async () => {
    const onChange = jest.fn();
    render(
      <TestCaseListSideBarNav
        allPopulationCriteria={null}
        selectedPopulationCriteria={null}
        onChange={onChange}
      />
    );

    expect(screen.getByRole("navigation")).toBeInTheDocument();
    expect(
      screen.getByText("No Population Criteria Exist")
    ).toBeInTheDocument();
  });

  it("should render no population criteria for empty groups array", async () => {
    const onChange = jest.fn();
    render(
      <TestCaseListSideBarNav
        allPopulationCriteria={[]}
        selectedPopulationCriteria={null}
        onChange={onChange}
      />
    );

    expect(screen.getByRole("navigation")).toBeInTheDocument();
    expect(
      screen.getByText("No Population Criteria Exist")
    ).toBeInTheDocument();
  });

  it("should render multiple population criteria", async () => {
    const onChange = jest.fn();
    render(
      <MemoryRouter>
        <TestCaseListSideBarNav
          allPopulationCriteria={groups}
          selectedPopulationCriteria={groups[1]}
          onChange={onChange}
        />
      </MemoryRouter>
    );

    expect(screen.getByRole("navigation")).toBeInTheDocument();
    expect(screen.getAllByRole("link").length).toEqual(2);
    const activeLink = screen.getByRole("link", {
      name: "Population Criteria 2",
    });
    expect(activeLink).toBeInTheDocument();
    userEvent.click(activeLink);
    expect(onChange).not.toHaveBeenCalled();
    const inactiveLink = screen.getByRole("link", {
      name: "Population Criteria 1",
    });
    expect(inactiveLink).toBeInTheDocument();
    userEvent.click(inactiveLink);
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
