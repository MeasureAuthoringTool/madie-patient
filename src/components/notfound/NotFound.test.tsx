import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import * as React from "react";
import NotFound from "./NotFound";
import { MemoryRouter } from "react-router";

describe("NotFound component", () => {
  it("should render NotFound component", () => {
    const { getByTestId, getByText } = render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );

    expect(getByTestId("404-page")).toBeInTheDocument();
    expect(getByText("404 - Not Found!")).toBeInTheDocument();
    expect(getByTestId("404-page-link")).toBeInTheDocument();
  });

  it("should have link that renders home page", () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );

    const link = screen.getByTestId("404-page-link");
    fireEvent.click(link);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/measures");
  });

  it("should render home page after clicking link", async () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );

    const link = screen.getByRole("link", { name: /home/i });

    // Simulate clicking the link
    fireEvent.click(link);

    // Wait for the 404 page to be rendered and assert it is not found
    await waitFor(() => {
      expect(screen.queryByText("404-page")).not.toBeInTheDocument();
    });
  });
});
