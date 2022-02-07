import React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import TestCaseSeries from "./TestCaseSeries";
import userEvent from "@testing-library/user-event";

describe("", () => {
  test("renders the field", () => {
    const handleChange = jest.fn();
    const options = ["Option1", "Option2"];
    render(
      <TestCaseSeries
        value={"Option1"}
        onChange={handleChange}
        seriesOptions={options}
      />
    );
    const seriesAutocomplete = screen.getByRole("textbox");
    expect(seriesAutocomplete).toBeInTheDocument();
  });

  test("renders the options on click", async () => {
    const handleChange = jest.fn();
    const options = ["Option1", "Option2"];
    render(
      <TestCaseSeries
        value={"Option1"}
        onChange={handleChange}
        seriesOptions={options}
      />
    );
    const seriesAutocomplete = screen.getByRole("textbox");
    userEvent.click(seriesAutocomplete);
    const list = await screen.findByRole("listbox");
    expect(list).toBeInTheDocument();
    const listItems = within(list).getAllByRole("option");
    expect(listItems.length).toEqual(2);
    expect(listItems[0]).toHaveTextContent("Option1");
    expect(listItems[1]).toHaveTextContent("Option2");
  });

  test("removes null, undefined, and empty string options", async () => {
    const handleChange = jest.fn();
    const options = ["Option1", null, undefined, "", "Option2"];
    render(
      <TestCaseSeries
        value={"Option1"}
        onChange={handleChange}
        seriesOptions={options}
      />
    );
    const seriesAutocomplete = screen.getByRole("textbox");
    userEvent.click(seriesAutocomplete);
    const list = await screen.findByRole("listbox");
    expect(list).toBeInTheDocument();
    const listItems = within(list).getAllByRole("option");
    expect(listItems.length).toEqual(2);
    expect(listItems[0]).toHaveTextContent("Option1");
    expect(listItems[1]).toHaveTextContent("Option2");
  });

  test("displays no options when all were null, undefined, or empty string", async () => {
    const handleChange = jest.fn();
    const options = [null, undefined, ""];
    render(
      <TestCaseSeries
        value={"Option1"}
        onChange={handleChange}
        seriesOptions={options}
      />
    );
    const seriesAutocomplete = screen.getByRole("textbox");
    userEvent.click(seriesAutocomplete);
    const list = screen.queryByRole("listbox");
    expect(list).not.toBeInTheDocument();
  });

  test("invokes the callback on option click", async () => {
    const handleChange = jest.fn();
    const options = ["Option1", "Option2"];
    render(
      <TestCaseSeries
        value={""}
        onChange={handleChange}
        seriesOptions={options}
      />
    );
    const seriesAutocomplete = screen.getByRole("textbox");
    userEvent.click(seriesAutocomplete);
    const list = await screen.findByRole("listbox");
    // screen.debug();
    expect(list).toBeInTheDocument();
    const listItems = within(list).getAllByRole("option");
    userEvent.click(listItems[0]);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    await waitFor(() => {
      expect(handleChange).toHaveBeenCalledWith("Option1");
    });
  });

  test("filters options on typing", async () => {
    const handleChange = jest.fn();
    const options = ["Option1", "Option2", "SeriesA"];
    render(
      <TestCaseSeries
        value={""}
        onChange={handleChange}
        seriesOptions={options}
      />
    );
    const seriesAutocomplete = screen.getByRole("textbox");
    userEvent.click(seriesAutocomplete);
    const list = await screen.findByRole("listbox");
    // screen.debug();
    expect(list).toBeInTheDocument();
    const listItems = within(list).getAllByRole("option");
    expect(listItems.length).toEqual(3);
    userEvent.type(seriesAutocomplete, "Opti");
    const listItems2 = await screen.findAllByRole("option");
    expect(listItems2.length).toEqual(3);
    const contents = listItems2.map((li) => li.textContent);
    expect(contents).toEqual(["Option1", "Option2", 'Add "Opti"']);
  });

  test("returns added option on select", async () => {
    const handleChange = jest.fn();
    const options = ["Option1", "Option2", "SeriesB"];
    render(
      <TestCaseSeries
        value={""}
        onChange={handleChange}
        seriesOptions={options}
      />
    );
    const seriesAutocomplete = screen.getByRole("textbox");
    userEvent.click(seriesAutocomplete);
    const list = await screen.findByRole("listbox");
    expect(list).toBeInTheDocument();
    const listItems = within(list).getAllByRole("option");
    expect(listItems.length).toEqual(3);
    userEvent.type(seriesAutocomplete, "Opti");
    const listItems2 = await screen.findAllByRole("option");
    expect(listItems2[2]).toHaveTextContent('Add "Opti"');
    userEvent.click(listItems2[2]);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    await waitFor(() => {
      expect(handleChange).toHaveBeenCalledWith("Opti");
    });
  });

  test("returns case insensitive option on enter", async () => {
    const handleChange = jest.fn();
    const options = ["Option1", "Option2", "Option3"];
    render(
      <TestCaseSeries
        value={""}
        onChange={handleChange}
        seriesOptions={options}
      />
    );
    const seriesAutocomplete = screen.getByRole("textbox");
    userEvent.click(seriesAutocomplete);
    const list = await screen.findByRole("listbox");
    expect(list).toBeInTheDocument();
    const listItems = within(list).getAllByRole("option");
    expect(listItems.length).toEqual(3);
    userEvent.type(seriesAutocomplete, "option2");
    userEvent.type(seriesAutocomplete, "{enter}");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    await waitFor(() => {
      expect(handleChange).toHaveBeenCalledWith("Option2");
    });
  });

  test("returns null when clear button clicked", async () => {
    const handleChange = jest.fn();
    const options = ["Option1", "Option2", "Option3"];
    const { container, rerender } = render(
      <TestCaseSeries
        value={null}
        onChange={handleChange}
        seriesOptions={options}
      />
    );
    const seriesAutocomplete = screen.getByRole("textbox");
    userEvent.click(seriesAutocomplete);
    const list = await screen.findByRole("listbox");
    expect(list).toBeInTheDocument();
    const listItems = within(list).getAllByRole("option");
    userEvent.click(listItems[0]);
    await waitFor(() => {
      expect(handleChange).toHaveBeenCalledWith("Option1");
    });
    rerender(
      <TestCaseSeries
        value={"Option1"}
        onChange={handleChange}
        seriesOptions={options}
      />
    );
    // logRoles(container);
    userEvent.click(seriesAutocomplete);
    // const clearButton = await screen.findByRole("button");
    const clearButton = await screen.findByTitle("Clear");
    userEvent.click(clearButton);
    await waitFor(() => {
      expect(handleChange).toHaveBeenCalledWith(null);
    });
  });

  test("returns null when input deleted", async () => {
    const handleChange = jest.fn();
    const options = ["Option1", "Option2", "Option3"];
    const { container, rerender } = render(
      <TestCaseSeries
        value={null}
        onChange={handleChange}
        seriesOptions={options}
      />
    );
    const seriesAutocomplete = screen.getByRole("textbox");
    userEvent.click(seriesAutocomplete);
    const list = await screen.findByRole("listbox");
    expect(list).toBeInTheDocument();
    const listItems = within(list).getAllByRole("option");
    userEvent.click(listItems[0]);
    await waitFor(() => {
      expect(handleChange).toHaveBeenCalledWith("Option1");
    });
    rerender(
      <TestCaseSeries
        value={"Option1"}
        onChange={handleChange}
        seriesOptions={options}
      />
    );
    // logRoles(container);
    userEvent.clear(seriesAutocomplete);
    await waitFor(() => {
      expect(handleChange).toHaveBeenCalledWith(null);
    });
  });
});
