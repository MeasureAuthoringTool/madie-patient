import React from "react";
interface Props {
  population: string;
  populationText: any;
}
import { Accordion } from "@madie/madie-design-system/dist/react";

const CoverageTab = ({ population, populationText }: Props) => {
  return (
    <Accordion title={population} isOpen={true}>
      <pre>{populationText.text}</pre>
    </Accordion>
  );
};

export default CoverageTab;
