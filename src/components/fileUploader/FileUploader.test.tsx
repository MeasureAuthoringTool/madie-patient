import * as React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import FileUploader from "./FileUploader";
import userEvent from "@testing-library/user-event";

describe("FileUploader component", () => {
  it("should show file upload dialog and calls callback if file input changed", () => {
    const fileImportCb = jest.fn();
    const file = new File(["test"], "testcase.json", {
      type: "application/json",
    });
    render(<FileUploader onFileImport={fileImportCb} />);
    const importTestBtn = screen.getByRole("button", {
      name: "Import",
    });
    const fileInput = screen.getByTestId(
      "import-file-input"
    ) as HTMLInputElement;
    // open file upload dialog
    userEvent.click(importTestBtn);
    expect(fileInput.files.length).toBe(0);
    // select the file
    userEvent.upload(fileInput, file);
    expect(fileInput.files.length).toBe(1);
    expect(fileImportCb).toHaveBeenCalledTimes(1);
  });
});
