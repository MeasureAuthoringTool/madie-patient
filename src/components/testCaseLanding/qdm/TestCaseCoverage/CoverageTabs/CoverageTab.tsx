import React from "react";
interface Props {
  population: string;
  definitionText: any;
}
import { Accordion } from "@madie/madie-design-system/dist/react";
import "twin.macro";
import "styled-components/macro";

const CoverageTab = ({ population, definitionText }: Props) => {
  return population !== "Functions" &&
    population !== "Used" &&
    population !== "Unused" ? (
    <div
      style={{ maxWidth: "1300px" }}
      data-testid={`${population}-population`}
    >
      <Accordion title={population} isOpen={false}>
        <pre data-testId={`${population}-population-text`}>
          {definitionText.text}
        </pre>
      </Accordion>
    </div>
  ) : (
    <div
      style={{ maxWidth: "1300px" }}
      data-testid={`${population}-definition`}
    >
      <Accordion title={population} isOpen={false}>
        {definitionText ? (
          <div data-testId={`${population}-definition-text`}>
            {Object.keys(definitionText)
              ?.sort()
              .filter(
                (definition) => !!definitionText[definition].definitionLogic
              )
              .map((item: any) => (
                <pre>{definitionText[item]?.definitionLogic}</pre>
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
