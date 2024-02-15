import React, { useState } from "react";
import { Group } from "@madie/madie-models";
import { Box } from "@mui/material";
import tw from "twin.macro";
import { Tabs, Tab } from "@madie/madie-design-system/dist/react";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "./TestCaseListSideBarNav.scss";

const OuterWrapper = tw.div`flex flex-col flex-grow py-10 bg-slate overflow-y-auto border-r border-slate`;
const Nav = tw.nav`flex-1 space-y-1 bg-slate`;

export interface TestCaseListSideBarNavProps {
  allPopulationCriteria: Group[];
  selectedPopulationCriteria: Group;
  onChange: (populationCriteria: Group) => void;
}

const TestCaseListSideBarNav = ({
  allPopulationCriteria,
  selectedPopulationCriteria,
  onChange,
}: TestCaseListSideBarNavProps) => {
  const [showPopulationCriteriaTabs, setShowPopulationCriteriaTabs] =
    useState<boolean>(true);
  return (
    <OuterWrapper>
      <Nav data-testid="test-case-pop-criteria-nav">
        <div className="nav-collapse-container">
          <button
            className="nav-collapser-title"
            onClick={() => {
              setShowPopulationCriteriaTabs(!showPopulationCriteriaTabs);
            }}
            data-testId="nav-collapser"
            id="nav-collapser"
          >
            Population Criteria
            <span>
              {showPopulationCriteriaTabs ? (
                <ExpandLessIcon />
              ) : (
                <ExpandMoreIcon />
              )}
            </span>
          </button>
        </div>
        {showPopulationCriteriaTabs && (
          <Tabs
            type="C"
            size="standard"
            orientation="vertical"
            value={selectedPopulationCriteria?.id}
          >
            {allPopulationCriteria && allPopulationCriteria.length > 0 ? (
              allPopulationCriteria.map((populationCriteria, idx) => {
                return (
                  <Tab
                    label={`Population Criteria ${idx + 1}`}
                    key={populationCriteria.id}
                    data-testid={`pop-criteria-nav-link-${populationCriteria.id}`}
                    value={populationCriteria.id}
                    type="C"
                    orientation="vertical"
                    onClick={() => {
                      onChange(populationCriteria);
                    }}
                  />
                );
              })
            ) : (
              <Box>
                <i>No Population Criteria Exist</i>
              </Box>
            )}
          </Tabs>
        )}
      </Nav>
    </OuterWrapper>
  );
};

export default TestCaseListSideBarNav;
