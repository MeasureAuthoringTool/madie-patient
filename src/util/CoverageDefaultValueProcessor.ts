import { Coverage, Organization, Reference } from "fhir/r4";
import _ from "lodash";

/**
 * Apply Default Values to Coverage Resources, or add a Default Coverage
 * Resource if none present.
 *
 * For existing Coverage Resources:
 *  Set Coverage.status to 'active'.
 *  Set Coverage.beneficiary to the Patient Reference.
 *  Add Coverage.payor Reference to the Default Organization Reference.
 *  Add Organization Resource.
 */
const addCoverageValues = (testCaseJson: any, patientRef: Reference) => {
  const hasCoverageResource = _.find(
    testCaseJson.entry,
    (e) => e.resource.resourceType === "Coverage"
  );

  if (hasCoverageResource) {
    // set status -> active and payor ref on existing Coverages
    testCaseJson.entry?.forEach((entry) => {
      if (entry.resource?.resourceType === "Coverage") {
        const coverage: Coverage = entry.resource;
        coverage.status = "active";
        coverage.beneficiary = patientRef;
        coverage.payor.push({
          reference: "Organization/123456",
        });
      }
    });
  } else {
    testCaseJson.entry.push({
      fullUrl: "http://coverage/1",
      resource: { ...defaultCoverage, beneficiary: patientRef },
    });
  }

  // add default Organization
  // ignoring existing Organization Resources
  testCaseJson.entry.push({
    fullUrl: "http://Organization/123456",
    resource: { ...defaultOrganization },
  });
};
export default addCoverageValues;

const defaultCoverage: Coverage = {
  resourceType: "Coverage",
  beneficiary: undefined,
  id: "1",
  meta: {
    profile: [
      "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-coverage",
    ],
  },
  payor: [{ reference: "Organization/123456" }],
  status: "active",
};
const defaultOrganization: Organization = {
  resourceType: "Organization",
  active: true,
  address: [
    {
      use: "billing",
      type: "postal",
      line: ["P.O. Box 660044"],
      city: "Dallas",
      state: "TX",
      postalCode: "75266-0044",
      country: "USA",
    },
  ],
  id: "123456",
  identifier: [
    {
      use: "temp",
      system: "urn:oid:2.16.840.1.113883.4.4",
      value: "21-3259825",
    },
  ],
  meta: {
    profile: [
      "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-organization",
    ],
  },
  name: "Blue Cross Blue Shield of Texas",
  telecom: [{ system: "phone", value: "(+1) 972-766-6900" }],
  type: [
    {
      coding: [
        {
          system: "http://terminology.hl7.org/CodeSystem/organization-type",
          code: "pay",
          display: "Payer",
        },
      ],
    },
  ],
};
