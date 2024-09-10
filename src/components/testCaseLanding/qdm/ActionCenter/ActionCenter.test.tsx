import * as React from "react";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import ActionCenter from "./ActionCenter";
import userEvent from "@testing-library/user-event";

describe("Action Center Component", () => {
  it("should render filter by with appropriate options and also a search input field", () => {
    render(<ActionCenter />);

    const filterBySelect = screen.getByRole("button", {
      name: "Filter By Filter By",
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
  });
});
