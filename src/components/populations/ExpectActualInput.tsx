import React from "react";
import classNames from "classnames";
import "./StyledCheckBox.scss";

const ExpectActualInput = ({
  expectedValue,
  onChange,
  setChangedPopulation,
  displayType,
  ...props
}) => {
  const checkBoxClass = classNames("madie-check", {
    expected: displayType === "expected",
    actual: displayType === "actual",
  });
  return props.populationBasis === "Boolean" ? (
    <input
      type="checkbox"
      className={checkBoxClass}
      checked={expectedValue}
      onChange={(e) => {
        if (setChangedPopulation) {
          setChangedPopulation(props.name);
        }
        onChange(!!e.target.checked);
      }}
      {...props}
    />
  ) : (
    <input
      type="text"
      size={2}
      value={expectedValue ? expectedValue : ""}
      onChange={(e) => {
        if (setChangedPopulation) {
          setChangedPopulation(props.name);
        }
        onChange(e.target.value);
      }}
      {...props}
    />
  );
};

export default ExpectActualInput;
