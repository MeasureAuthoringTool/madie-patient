import * as React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import StringInput from "./StringInput";

describe("StringInput Component", () => {
  const onStringValueChange = jest.fn();
  it("Should render StringInput component ", () => {
    render(
      <StringInput
        label="ID"
        fieldValue="testId"
        canEdit={true}
        onStringValueChange={onStringValueChange}
      />
    );
    screen.debug(undefined, 20000);
    expect(screen.getByTestId("string-field-id")).toBeInTheDocument();
    const input = screen.getByTestId(
      "string-field-id-input"
    ) as HTMLInputElement;
    expect(input.value).toBe("testId");
  });

  it("Should change input value ", () => {
    render(
      <StringInput
        label="ID"
        fieldValue="testId"
        canEdit={true}
        onStringValueChange={onStringValueChange}
      />
    );
    screen.debug(undefined, 20000);

    expect(screen.getByTestId("string-field-id")).toBeInTheDocument();
    const input = screen.getByTestId(
      "string-field-id-input"
    ) as HTMLInputElement;
    expect(input.value).toBe("testId");

    fireEvent.change(input, {
      target: { value: "newId" },
    });
    expect(input.value).toBe("newId");
  });
});
