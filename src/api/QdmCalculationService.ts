import { Calculator } from "cqm-execution";
import { CqmMeasure, ValueSet } from "cqm-models";

export class QdmCalculationService {
  async calculateQdmTestCases(cqmMeasure: CqmMeasure, patientJson) {
    let patients = [];
    patients.push(patientJson);

    // Example options; includes directive to produce pretty statement results.
    const options = {
      doPretty: true,
      effectiveDate: "201201010000", //default value till we get measure_period
      effectiveEnd: "201212312359", //default value till we get measure_period
    };

    const calculationResults = await Calculator.calculate(
      cqmMeasure,
      patients,
      cqmMeasure.value_sets,
      options
    );

    // eslint-disable-next-line no-console
    console.log("cqm execution calculation results", calculationResults);
    return calculationResults;
  }
}

export default function qdmCalculationService(): QdmCalculationService {
  return new QdmCalculationService();
}
