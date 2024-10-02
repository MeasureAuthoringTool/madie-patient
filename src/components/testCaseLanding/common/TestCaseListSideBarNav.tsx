import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { Group } from "@madie/madie-models";
import { Box } from "@mui/material";
import tw from "twin.macro";
import { Tabs, Tab } from "@madie/madie-design-system/dist/react";
import { useFeatureFlags } from "@madie/madie-util";

import "./TestCaseListSideBarNav.scss";

const OuterWrapper = tw.div`flex flex-col flex-grow py-10 bg-slate overflow-y-auto border-r border-slate`;
const Nav = tw.nav`flex-1 space-y-1 bg-slate`;

export interface TestCaseListSideBarNavProps {
  allPopulationCriteria: Group[];
  qdm?: Boolean;
}
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const TestCaseListSideBarNav = ({
  allPopulationCriteria,
  qdm,
}: TestCaseListSideBarNavProps) => {
  const featureFlags = useFeatureFlags();
  const showConfigurationSection =
    (!qdm && featureFlags?.ShiftTestCasesDates) || qdm;
  let navigate = useNavigate();
  const { measureId, criteriaId } = useParams<{
    measureId: string;
    criteriaId: string;
  }>();

  let location = useLocation();
  const { pathname } = location;

  const [showConfigTabs, setShowConfigTabs] = useState<boolean>(true);
  const [showPopulationCriteriaTabs, setShowPopulationCriteriaTabs] =
    useState<boolean>(true);
  const handleChange = (e, v) => {
    const newPath = `/measures/${measureId}/edit/test-cases/list-page/${v}`;
    navigate(newPath);
  };
  const endRoute = /[^/]*$/.exec(pathname)[0];
  return (
    <OuterWrapper>
      <Nav data-testid="test-case-pop-criteria-nav">
        <div className="nav-collapse-container">
          <button
            className="nav-collapser-title"
            onClick={() => {
              setShowPopulationCriteriaTabs(!showPopulationCriteriaTabs);
            }}
            data-testid="nav-collapser"
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
            value={criteriaId}
            onChange={handleChange}
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
                  />
                );
              })
            ) : (
              <Tab
                label="No Population Criteria Exist"
                disabled
                type="C"
                orientation="vertical"
              />
            )}
          </Tabs>
        )}

        {showConfigurationSection && (
          <>
            <div className="nav-collapse-container">
              <button
                className="nav-collapser-title"
                onClick={() => {
                  setShowConfigTabs(!showConfigTabs);
                }}
                data-testid="qdm-nav-collapser"
                id="qdm-nav-collapser"
                tw="px-2"
              >
                Configuration
                <span className="tab-dropdown">
                  {showConfigTabs ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </span>
              </button>
            </div>

            {showConfigTabs && (
              <Tabs
                type="C"
                size="standard"
                orientation="vertical"
                onChange={handleChange}
                value={endRoute}
              >
                {qdm && (
                  <Tab
                    label="SDE"
                    value="sde"
                    data-testid="nav-link-sde"
                    type="C"
                    orientation="vertical"
                    onChange={handleChange}
                  />
                )}
                {qdm && (
                  <Tab
                    label="Expansion"
                    value="expansion"
                    data-testid="nav-link-expansion"
                    type="C"
                    orientation="vertical"
                    onChange={handleChange}
                  />
                )}
                {featureFlags?.ShiftTestCasesDates && (
                  <Tab
                    label="Test Case Data"
                    value="test-case-data"
                    data-testid="test-case-data"
                    type="C"
                    orientation="vertical"
                    onChange={handleChange}
                  />
                )}
              </Tabs>
            )}
          </>
        )}
      </Nav>
    </OuterWrapper>
  );
};

export default TestCaseListSideBarNav;
