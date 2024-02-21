import * as React from "react";
import { render, screen, within } from "@testing-library/react";
import DataElementActions from "./DataElementActions";
import userEvent from "@testing-library/user-event";

const mockOnDelete = jest.fn();
const mockOnView = jest.fn();
const mockOnClone = jest.fn();

describe("DatElementActions", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Should display only View action button for a non owner", () => {
    render(
      <DataElementActions
        elementId={"exampleId"}
        canView={true}
        onDelete={mockOnDelete}
        onView={mockOnView}
        canEdit={false}
        onClone={mockOnClone}
      />
    );

    const viewButton = screen.getByRole("button", { name: "View" });
    expect(viewButton).toBeInTheDocument();
    userEvent.click(viewButton);
    expect(mockOnView).toHaveBeenCalledTimes(1);
  });

  it("Should display View action button along with popover for the owner", async () => {
    render(
      <DataElementActions
        elementId={"exampleId"}
        canView={true}
        onDelete={mockOnDelete}
        onView={mockOnView}
        canEdit={true}
        onClone={mockOnClone}
      />
    );

    const viewButton = screen.getByRole("button", { name: "View" });
    expect(viewButton).toBeInTheDocument();
    userEvent.click(viewButton);
    const popOver = await screen.findByTestId("popover-content");
    const editButton = within(popOver).getByRole("button", { name: "Edit" });
    userEvent.click(editButton);
    expect(mockOnView).toHaveBeenCalledTimes(1);
  });

  it("Should display the clone option to the user and calls onClone when clicked", async () => {
    render(
      <DataElementActions
        elementId={"exampleId"}
        canView={true}
        onDelete={mockOnDelete}
        onView={mockOnView}
        canEdit={true}
        onClone={mockOnClone}
      />
    );

    const viewButton = screen.getByRole("button", { name: "View" });
    expect(viewButton).toBeInTheDocument();
    userEvent.click(viewButton);
    const popOver = await screen.findByTestId("popover-content");
    const cloneButton = within(popOver).getByRole("button", {
      name: "Clone",
    });
    userEvent.click(cloneButton);
    expect(mockOnClone).toHaveBeenCalledTimes(1);
  });

  it("Should display the delete button if the user is owner and deletes a dataElement when clicked", async () => {
    render(
      <DataElementActions
        elementId={"exampleId"}
        canView={true}
        onDelete={mockOnDelete}
        onView={mockOnView}
        canEdit={true}
        onClone={mockOnClone}
      />
    );

    const viewButton = screen.getByRole("button", { name: "View" });
    expect(viewButton).toBeInTheDocument();
    userEvent.click(viewButton);
    const popOver = await screen.findByTestId("popover-content");
    const deleteButton = within(popOver).getByRole("button", {
      name: "Delete",
    });
    userEvent.click(deleteButton);
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });
});
