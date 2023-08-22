import * as React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import StringField from "./StringField";

describe("StringField Component", () => {
  const onStringValueChange = jest.fn();
  it("Should render StringField component ", () => {
    render(
      <StringField
        label="ID"
        fieldValue="testId"
        canEdit={true}
        onStringValueChange={onStringValueChange}
      />
    );
    screen.debug(undefined, 20000);
    expect(screen.getByTestId("string-field-ID")).toBeInTheDocument();
    const input = screen.getByTestId(
      "string-field-ID-input"
    ) as HTMLInputElement;
    expect(input.value).toBe("testId");
  });

  it("Should change input value ", () => {
    render(
      <StringField
        label="ID"
        fieldValue="testId"
        canEdit={true}
        onStringValueChange={onStringValueChange}
      />
    );
    screen.debug(undefined, 20000);

    expect(screen.getByTestId("string-field-ID")).toBeInTheDocument();
    const input = screen.getByTestId(
      "string-field-ID-input"
    ) as HTMLInputElement;
    expect(input.value).toBe("testId");

    fireEvent.change(input, {
      target: { value: "newId" },
    });
    expect(input.value).toBe("newId");
  });
});
