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
      type={props.populationBasis === "Boolean" ? "checkbox" : "text"}
      size={2}
      //readOnly={true}
      className={checkBoxClass}
      checked={checked}
      onChange={(e) => {
        if (setChangedPopulation) {
          setChangedPopulation(props.name);
        }
        if (props.populationBasis === "Boolean") {
          onChange(!!e.target.checked);
        } else {
          onChange(e.target.value);
        }
      }}
      {...props}
    />
  );
};

export default StyledCheckbox;
