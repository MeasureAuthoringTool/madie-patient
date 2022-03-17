import { fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";
import NotFound from "./NotFound";
import { MemoryRouter } from "react-router";
import Enzyme, { shallow, mount } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";

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
    Enzyme.configure({ adapter: new Adapter() });
    const wrapper = mount(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );

    expect(wrapper.exists()).toBeTruthy();
    wrapper.find("a").simulate("click", { button: 0 });
    expect(screen.findByText("404-page")).notFound;
  });
});
