
import * as _ from "lodash";

export const addValues = (testCase: any): any => {
  //create a clone of testCase
  const resultJson: any = _.clone(testCase);
  //.map to return an array of just
  const nonCoverage: Array<any> = resultJson.entry.filter((entry) => {
    if (entry.resource?.resourceType !== "Coverage") {

      return true;
    }
  });


  let coverage: Array<any> = [];
  const foundCoverage: Array<any> = testCase.entry?.filter((entry) => {
    if (entry.resource?.resourceType === "Coverage") {

      entry.resource.status = "active";
      return entry;
    }
  });



  if (foundCoverage) {
    coverage = [...coverage, ...foundCoverage];

  } else {
    //TODO  This isn't sufficient.  The Added Coverage needs a Payor with an Organization.. can modify this when we address the additional stories
    const defaultCoverage: any = JSON.parse(
      '{"fullUrl":"http://local/Coverage/1","resource":{"resourceType":"Coverage","id":"example","meta":{"profile":["http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-coverage"]},"text":{"status":"generated","div":""},"status":"active","type":{"coding":[{"system":"https://nahdo.org/sopt","code":"59","display":"OtherPrivateInsurance"}]},"beneficiary":{"reference":"Patient/example"},"payor":[{"reference":"Organization/example"}]}}'
    );
    coverage.push(defaultCoverage);
  }

  const entries = nonCoverage.concat(coverage);

  resultJson.entry = entries;
  return resultJson;
};
