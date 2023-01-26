export const addValues = (testCase: any): any => {
  //create a clone of testCase
  const resultJson: any = testCase;
  //.map to return an array of just
  const nonCoverage: Array<any> = testCase.entry.filter((entry) => {
    if (entry.resource.resourceType != "Coverage") {
      return true;
    }
  });

  const coverage: Array<any> = [];
  const foundCoverage: any = testCase.entry.find((entry) => {
    if (entry.resource.resourceType == "Coverage") {
      entry.resource.status = "active";
      return entry;
    }
  });
  if (typeof foundCoverage !== "undefined") {
    coverage.push(foundCoverage);
  } else {
    //TODO  This isn't sufficient.  The Added Coverage needs a Payor with an Organization.. can modify this when we address the additional stories
    const defaultCoverage: any = JSON.parse(
      '{"fullUrl":"http://local/Coverage/1","resource":{"resourceType":"Coverage","id":"example","meta":{"profile":["http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-coverage"]},"text":{"status":"generated","div":""},"status":"active","type":{"coding":[{"system":"https://nahdo.org/sopt","code":"59","display":"OtherPrivateInsurance"}]},"beneficiary":{"reference":"Patient/example"},"payor":[{"reference":"Organization/example"}]}}'
    );
    coverage.push(defaultCoverage);
  }

  // [E1, E2, E3]

  // entries = [E1, E2, E3, C]

  // testCase.entry = entries ;
  // resultJson = {...testCase, entries};
  // resultJson = [resourceType, meta, entry]]

  // entry[]
  const entries = nonCoverage.concat(coverage);

  resultJson.entry = entries;
  return resultJson;
};
