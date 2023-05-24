import { Calculator } from "cqm-execution";
import cqmMeasure from "../mockdata/qdm/CMS108/cqm_measure.json";
import valueSets from "../mockdata/qdm/CMS108/value_sets.json";
import patient from "../mockdata/qdm/CMS108/IPP_DENOME_NUMER_PASS_NoVTEPatientRefusal.json";

export class QdmCalculationService {
  async calculateQdmTestCases() {
    let patients = [];
    patients.push(patient);

    // Example options; includes directive to produce pretty statement results.
    const options = { doPretty: true };

    // Todo Mocked data will be replaced in future stories
    const calculationResults = await Calculator.calculate(
      cqmMeasure,
      patients,
      valueSets,
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
