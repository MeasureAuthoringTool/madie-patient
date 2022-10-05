import React from "react";
import { Tabs, Tab } from "@mui/material";
export interface NavTabProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  click: boolean;
}

const defaultStyle = {
  padding: "0px 10px",
  height: "45px",
  minHeight: "45px",
  textTransform: "none",
};

export default function CreateCodeCoverageNavTabs(props: NavTabProps) {
  const { activeTab, setActiveTab } = props;

  const testing = (label, click) => {
    const term = click ? [0, 50, 100][Math.floor(Math.random() * 3)] : "-";
    return (
      <div>
        <div>{click ? term + "%" : "-"} </div>
        {label} {click && "(" + +term / 100 + ")"}
      </div>
    );
  };

  return (
    <Tabs
      value={activeTab}
      onChange={(e, v) => {
        setActiveTab(v);
      }}
      sx={{
        fontWeight: 500,
        height: "55px",
        minHeight: "55px",
        padding: 0,
        fontSize: "39px",
        fontFamily: "Rubik, sans serif",
        color: "#333333",
        borderBottom: "solid 1px #DDDDDD",
        "& .MuiTabs-indicator": {
          height: "4px",
          backgroundColor: "#209FA6",
        },
        "& .Mui-selected": {
          fontWeight: 600,
          color: "#515151 !important",
        },
      }}
    >
      <Tab
        sx={defaultStyle}
        label={testing("Passing", props.click)}
        data-testid="testCasesList-tab"
        value="testCasesList"
      />
      <Tab
        sx={defaultStyle}
        label={testing("Coverage", props.click)}
        //label={"test"}
        data-testid="coverage-tab"
        value="coverage"
      />
    </Tabs>
  );
}
