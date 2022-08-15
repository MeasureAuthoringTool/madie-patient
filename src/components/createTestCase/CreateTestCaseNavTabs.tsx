import React from "react";
import tw, { styled } from "twin.macro";

interface PropTypes {
  isActive?: boolean;
}

const MenuItemContainer = tw.ul`bg-transparent flex px-8`;
const MenuItem = styled.li((props: PropTypes) => [
  tw`relative h-2 mr-3 ml-3 mt-3 mb-0 font-rubik text-sm leading-4 text-gray-980`,
  props.isActive && tw`bg-white h-2 text-black pb-6 border-b-4 border-blue-950`,
]);

export interface NavTabProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

export default function CreateTestCaseNavTabs(props: NavTabProps) {
  const { activeTab, setActiveTab } = props;
  return (
    <MenuItemContainer>
      <MenuItem
        data-testid="measurecql-tab"
        isActive={activeTab == "measurecql"}
        onClick={() => {
          setActiveTab("measurecql");
        }}
      >
        Measure CQL(View Only)
      </MenuItem>

      <MenuItem
        data-testid="expectoractual-tab"
        isActive={activeTab == "expectoractual"}
        onClick={() => setActiveTab("expectoractual")}
      >
        Expected / Actual
      </MenuItem>

      <MenuItem
        data-testid="details-tab"
        isActive={activeTab == "details"}
        onClick={() => setActiveTab("details")}
      >
        Details
      </MenuItem>
    </MenuItemContainer>
  );
}
