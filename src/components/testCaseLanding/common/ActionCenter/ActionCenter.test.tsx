import * as React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import ActionCenter from "./ActionCenter";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { useNavigate } from "react-router-dom";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));
const { getByTestId } = screen;
describe("Action Center Component", () => {
  it("should render filter by with appropriate options and also a search input field, and call navigate on enter", () => {
    const mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    render(
      <MemoryRouter initialEntries={["testcasepage"]}>
        <ActionCenter />
      </MemoryRouter>
    );

    const filterBySelect = screen.getByRole("combobox", {
      name: "Filter By",
    });
    expect(filterBySelect).toBeInTheDocument();
    userEvent.click(filterBySelect);

    const filterByOptions = screen.getAllByRole("option") as HTMLLIElement[];
    expect(filterByOptions[0]).toHaveTextContent("Status");
    expect(filterByOptions[1]).toHaveTextContent("Group");
    expect(filterByOptions[2]).toHaveTextContent("Title");
    expect(filterByOptions[3]).toHaveTextContent("Description");

    userEvent.click(filterByOptions[0]);

    const searchInput = screen.getByRole("textbox", { name: "Search" });
    expect(searchInput).toBeInTheDocument();
    const searchInputField = screen.getByTestId("test-case-list-search-input");
    userEvent.type(searchInputField, "test");
    fireEvent.keyPress(searchInputField, { key: "Enter", charCode: 13 });
    expect(mockNavigate).toHaveBeenCalledWith(
      expect.stringContaining("filter=Status&search=test&page=1&limit=10")
    );
    userEvent.click(getByTestId("test-cases-trigger-search"));
    expect(mockNavigate).toHaveBeenCalledWith(
      expect.stringContaining("filter=Status&search=test&page=1&limit=10")
    );
    userEvent.click(getByTestId("test-cases-clear-search"));
    expect(mockNavigate).toHaveBeenCalledWith(expect.stringContaining("/"));
  });
});
