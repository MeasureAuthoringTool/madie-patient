import React from "react";
import classNames from "classnames";
import "./StyledCheckBox.scss";

const StyledCheckbox = ({ checked, onChange, displayType, ...props }) => {
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
        onChange(!!e.target.checked);
      }}
      {...props}
    />
  );
};

export default StyledCheckbox;
