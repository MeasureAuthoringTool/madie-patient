import React from "react";
import classNames from "classnames";
import "./StyledCheckBox.scss";

const StyledCheckbox = ({
  checked,
  onChange,
  setChangedPopulation,
  displayType,
  ...props
}) => {
  const checkBoxClass = classNames("madie-check", {
    expected: displayType === "expected",
    actual: displayType === "actual",
  });
  return (
    <input
      type="checkbox"
      className={checkBoxClass}
      checked={checked}
      onChange={(e) => {
        if (setChangedPopulation) {
          setChangedPopulation(props.name);
        }
        onChange(!!e.target.checked);
      }}
      {...props}
    />
  );
};

export default StyledCheckbox;
