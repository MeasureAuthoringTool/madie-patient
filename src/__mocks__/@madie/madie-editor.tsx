import React from "react";

export function MadieEditor({ value, onChange }) {
  return (
    <>
      <input
        data-testid="test-case-cql-mock-editor"
        value={value}
        onChange={onChange}
      />
    </>
  );
}
