import { GroupPopulation, TestCase } from "@madie/madie-models";
import {
  getFhirMeasurePopulationCode,
  getPopulationsForScoring,
} from "./PopulationsMap";
import { PopulationExpectedValue } from "@madie/madie-models/dist/TestCase";

export function processPatientBundles(
  patientBundles,
  measureGroup
): TestCase[] {
  const testCases: TestCase[] = [];
  for (const bundle of patientBundles) {
    const measureReport = bundle.entry?.find(
      (e) => e.resourceType === "MeasureReport"
    );
    const patient = bundle.entry?.find(
      (e) => e?.resource?.resourceType === "Patient"
    );
    const bundleToSave = {
      ...bundle,
      entry: bundle.entry?.filter((e) => e.resourceType !== "MeasureReport"),
    };

    // only support one group for now
    const firstGroup = measureReport?.group?.[0];
    const groupPopulations: GroupPopulation[] = [];

    if (measureGroup && measureGroup.scoring) {
      // console.log(firstGroup);
      const populationsForScoring = getPopulationsForScoring(measureGroup);
      const popValues: PopulationExpectedValue[] = populationsForScoring.map(
        (pop) => {
          const inPop = firstGroup.population.find((p) => {
            return getFhirMeasurePopulationCode(pop) === p.code.coding[0].code;
          });
          return {
            name: pop,
            expected: false,
          };
        }
      );
      // console.log("first group: ", firstGroup);
      groupPopulations.push({
        groupId: measureGroup.id,
        scoring: measureGroup.scoring,
        populationValues: popValues,
      });
    }
    const familyName = patient?.resource?.name?.[0]?.family || "";
    const givenName = patient?.resource?.name?.[0]?.given?.[0] || "";
    const name = `${givenName} ${familyName}`;

    testCases.push({
      title: name,
      description: "",
      json: JSON.stringify(bundleToSave),
      groupPopulations,
    } as TestCase);
  }
  return testCases;
}
