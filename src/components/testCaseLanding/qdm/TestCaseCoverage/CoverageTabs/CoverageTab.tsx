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
    <div
      style={{ maxWidth: "1300px" }}
      data-testid={`${population}-population`}
    >
      <Accordion title={population} isOpen={false}>
        <pre data-testId={`${population}-population-text`}>
          {populationText.text}
        </pre>
      </Accordion>
    </div>
  ) : (
    <div
      style={{ maxWidth: "1300px" }}
      data-testid={`${population}-definition`}
    >
      <Accordion title={population} isOpen={false}>
        {populationText ? (
          <div data-testId={`${population}-definition-text`}>
            {Object.values(populationText).map((item: any) => (
              <pre>{item?.definitionLogic}</pre>
            ))}
          </div>
        ) : (
          "No Results Available"
        )}
      </Accordion>
    </div>
  );
};

export default CoverageTab;
