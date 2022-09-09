import React from "react";
import { Tabs, Tab } from "@mui/material";
import "./CreateTestCaseNavTabs.scss";
export interface NavTabProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const defaultStyle = {
  padding: "0px 10px",
  height: "45px",
  minHeight: "45px",
  textTransform: "none",
};

export default function CreateTestCaseNavTabs(props: NavTabProps) {
  const { activeTab, setActiveTab } = props;
  return (
    <Tabs
      value={activeTab}
      onChange={(e, v) => {
        setActiveTab(v);
      }}
      sx={{
        fontWeight: 400,
        height: "45px",
        minHeight: "45px",
        padding: 0,
        fontSize: "14px",
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
        label={`Measure CQL (View Only)`}
        data-testid="measurecql-tab"
        value="measurecql"
      />
      <Tab
        sx={defaultStyle}
        label={`Highlighting`}
        data-testid="highlighting-tab"
        value="highlighting"
      />
      <Tab
        sx={defaultStyle}
        value="expectoractual"
        label="Expected / Actual"
        data-testid="expectoractual-tab"
      />
      <Tab
        sx={defaultStyle}
        value="details"
        label="Details"
        data-testid="details-tab"
      />
    </Tabs>
  );
}
