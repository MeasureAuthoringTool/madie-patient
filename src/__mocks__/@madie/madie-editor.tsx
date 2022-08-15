import React from "react";

export function MadieEditor({ value }) {
  return (
    <>
      <input data-testid="test-case-cql-mock-editor" value={value} />
    </>
  );
}
