import React from "react";

export function MadieEditor({ value }) {
  return (
    <>
      <input data-testid="test-case-cql-editor" value={value} />
    </>
  );
}
