import { Calculator } from "cqm-execution";
//import cqmMeasure from "../mockdata/qdm/CMS108/cqm_measure.json";
//import valueSets from "../mockdata/qdm/CMS108/value_sets.json";
import patient from "../mockdata/qdm/CMS108/IPP_DENOME_NUMER_PASS_NoVTEPatientRefusal.json";
import { CqmMeasure } from "cqm-models";

export class QdmCalculationService {
  async calculateQdmTestCases(cqmMeasure: CqmMeasure, valueSets, patientJson) {
    let patients = [];
    patients.push(JSON.parse(patientJson));

    // Example options; includes directive to produce pretty statement results.
    const options = { doPretty: true, effectiveDate:"201201010000", effectiveEnd: "201212312359"};

    console.log("calculation service called", );
    // Todo Mocked data will be replaced in future stories
    console.log(cqmMeasure)
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
