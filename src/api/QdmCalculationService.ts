import { Calculator } from "cqm-execution";
import { CqmMeasure } from "cqm-models";

export class QdmCalculationService {
  async calculateQdmTestCases(cqmMeasure: CqmMeasure, patientJson) {
    let patients = [];
    patients.push(patientJson);

    // Example options; includes directive to produce pretty statement results.
    const options = {
      doPretty: true,
    };

    const calculationResults = await Calculator.calculate(
      cqmMeasure,
      patients,
      cqmMeasure.value_sets,
      options
    );
    // set onto window for any environment debug purposes
    if (localStorage.getItem("madieDebug") || (window as any).madieDebug) {
      // eslint-disable-next-line no-console
      console.log("cqm execution calculation results", calculationResults);
    }
    return calculationResults;
  }
}

export default function qdmCalculationService(): QdmCalculationService {
  return new QdmCalculationService();
}
