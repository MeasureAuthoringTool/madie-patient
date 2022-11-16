import React from "react";
import { Group } from "@madie/madie-models";
import { Box } from "@mui/material";
import tw from "twin.macro";
import { Link as NavLink } from "react-router-dom";

const OuterWrapper = tw.div`flex flex-col flex-grow py-10 bg-slate overflow-y-auto border-r border-slate`;
const Nav = tw.nav`flex-1 space-y-1 bg-slate`;
const StyledNavLink = tw(
  NavLink
)`flex items-center px-3 py-2 text-sm text-slate-80 border-l-8 no-underline hover:text-slate-90 hover:font-medium`;
const ActiveNavLink = tw(StyledNavLink)`
    bg-white
    font-medium
    border-teal-650
    text-slate-90`;
const InactiveNavLink = tw(StyledNavLink)` border-transparent`;

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
  return (
    <OuterWrapper>
      <Nav>
        {allPopulationCriteria && allPopulationCriteria.length > 0 ? (
          allPopulationCriteria.map((populationCriteria, idx) => {
            if (populationCriteria.id === selectedPopulationCriteria?.id) {
              return (
                <ActiveNavLink to={""}>{`Population Criteria ${
                  idx + 1
                }`}</ActiveNavLink>
              );
            }

            return (
              <InactiveNavLink
                to={""}
                onClick={(e) => {
                  e.preventDefault();
                  onChange(populationCriteria);
                }}
              >{`Population Criteria ${idx + 1}`}</InactiveNavLink>
            );
          })
        ) : (
          <Box>
            <i>No Population Criteria Exist</i>
          </Box>
        )}
      </Nav>
    </OuterWrapper>
  );
};

export default TestCaseListSideBarNav;
