import React from "react";
interface Props {
  population: string;
  populationText;
}
import { Accordion } from "@madie/madie-design-system/dist/react";
import "twin.macro";
import "styled-components/macro";

const CoverageTab = ({ population, populationText }: Props) => {
  return population !== "Functions" &&
    population !== "Used" &&
    population !== "Unused" ? (
    <div style={{ maxWidth: "1300px" }}>
      <Accordion title={population} isOpen={true}>
        <pre>{populationText.text}</pre>
      </Accordion>
    </div>
  ) : (
    <div style={{ maxWidth: "1300px" }}>
      <Accordion title={population} isOpen={true}>
        {populationText
          ? Object.values(populationText).map((item: any) => (
              <pre>
                <div style={{ maxWidth: "1300px", overflowWrap: "break-word" }}>
                  {item?.definitionLogic}
                </div>
              </pre>
            ))
          : "No Results Available"}
      </Accordion>
    </div>
  );
};

export default CoverageTab;
