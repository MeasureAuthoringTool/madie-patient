import { TestCase } from "@madie/madie-models";
import { addValues } from "./DefaultValueProcessor";

export function processPatientBundles(patientBundles): TestCase[] {
  const testCases: TestCase[] = [];
  for (const bundle of patientBundles) {
    const patient = bundle.entry?.find(
      (e) => e?.resource?.resourceType === "Patient"
    );
    const importedBundle = {
      ...bundle,
      entry: bundle.entry?.filter((e) => e.resourceType !== "MeasureReport"),
    };

    // Apply Default Values
    const bundleToSave = addValues(importedBundle);

    const familyName = patient?.resource?.name?.[0]?.family || "";
    const givenName = patient?.resource?.name?.[0]?.given?.[0] || "";

    testCases.push({
      id: bundle.id,
      title: givenName,
      series: familyName,
      description: "",
      createdAt: new Date().toISOString(),
      json: JSON.stringify(bundleToSave, null, 4),
      groupPopulations: [],
    } as TestCase);
  }
  return testCases;
}

// TODO: Refactor to dedup with useTestCaseService::readTestCaseFile
export function readImportFile(importFile): Promise<string> {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = async function (e) {
      const content: string = e.target.result as string;
      let patientBundles = null;
      try {
        patientBundles = JSON.parse(content);
        resolve(patientBundles);
      } catch (error) {
        reject(error);
      }
      return;
    };
    fileReader.readAsText(importFile);
  });
}
