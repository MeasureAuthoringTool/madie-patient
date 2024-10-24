import axios from "./axios-instance";
import { TerminologyServiceApi } from "./useTerminologyServiceApi";
import { officeVisitValueSet } from "./__mocks__/OfficeVisitValueSet";
import { officeVisitMeasureBundle } from "./__mocks__/OfficeVisitMeasureBundle";
import { cqm_measure_basic } from "../mockdata/qdm/CMS108/cqm_measure_basic";
import { cqm_measure_basic_valueset } from "../mockdata/qdm/CMS108/cqm_measure_basic_valueset";
import { Measure as CqmMeasure, ValueSet } from "cqm-models";
import * as _ from "lodash";
import { ManifestExpansion } from "@madie/madie-models";
import { Simulate } from "react-dom/test-utils";
import error = Simulate.error;

jest.mock("./axios-instance");

jest.mock("@madie/madie-util", () => ({
  getOidFromString: (oid) => oid.split("urn:oid:")[1],
}));

const testCqmMeasure: CqmMeasure = new CqmMeasure();

const testManifestExpansion: ManifestExpansion = {
  fullUrl: "https://cts.nlm.nih.gov/fhir/Library/mu2-update-2015-05-01",
  id: "mu2-update-2015-05-01",
};

describe("TerminologyServiceApi Tests", () => {
  let terminologyService: TerminologyServiceApi;
  beforeEach(() => {
    const getAccessToken = jest.fn();
    terminologyService = new TerminologyServiceApi("test.url", getAccessToken);
  });
  it("gives no ValueSets when no bundle provided", () => {
    terminologyService.getValueSetsExpansion(null).then((data) => {
      expect(data).toBeNull();
    });
  });

  it("gives expanded ValueSets for ValueSets in measure bundle", () => {
    axios.put = jest
      .fn()
      .mockResolvedValueOnce({ data: [officeVisitValueSet] });

    terminologyService
      .getValueSetsExpansion(officeVisitMeasureBundle)
      .then((data) => {
        expect(data.length).toEqual(1);
        expect(data[0].name).toEqual("Office Visit");
        expect(data[0].name).toEqual("Office Visit");
        expect(data[0].id).toEqual("2.16.840.1.113883.3.464.1003.101.12.1001");
        expect(data[0].compose.include[0].concept.length).toEqual(5);
      });
  });

  it("throws an error if ValueSets not found in VSAC", async () => {
    const response = {
      timestamp: "2022-06-02T21:36:46.592+00:00",
      status: 404,
      error: "Not Found",
      message:
        "404 Not Found from GET https://vsac.nlm.nih.gov/vsac/svs/RetrieveMultipleValueSets?id=2.16.840.1.113883.3.464.1003.101.12.10011&ticket=ST-106586-7gtyv4fwl3xjfcyy-cas&profile=eCQM%20Update%202022-05-05&includeDraft=yes",
      validationErrors: {
        "/api":
          "404 Not Found from GET https://vsac.nlm.nih.gov/vsac/svs/RetrieveMultipleValueSets?id=2.16.840.1.113883.3.464.1003.101.12.10011&ticket=ST-106586-7gtyv4fwl3xjfcyy-cas&profile=eCQM%20Update%202022-05-05&includeDraft=yes",
      },
    };

    axios.put = jest
      .fn()
      .mockRejectedValue({ response: { status: 404, data: response } });
    try {
      await terminologyService.getValueSetsExpansion(officeVisitMeasureBundle);
    } catch (error) {
      expect(error.message).toEqual(
        "An error exists with the measure CQL, please review the CQL Editor tab."
      );
    }
  });

  it("gives no ValueSets when no cqm measure provided", () => {
    terminologyService
      .getQdmValueSetsExpansion(null, testManifestExpansion, false)
      .then((data) => {
        expect(data).toBeNull();
      });
  });

  it("Should call Terminology Service URL to fetch value set expansions when manifest Expansion feature flag is true", () => {
    axios.put = jest
      .fn()
      .mockResolvedValue({ data: cqm_measure_basic_valueset });
    const result = terminologyService.getQdmValueSetsExpansion(
      cqm_measure_basic,
      testManifestExpansion,
      true
    );
    expect(axios.put).toBeCalledWith(
      "test.url/terminology/value-sets/expansion/qdm",
      {
        includeDraft: "yes",
        manifestExpansion: {
          fullUrl: "https://cts.nlm.nih.gov/fhir/Library/mu2-update-2015-05-01",
          id: "mu2-update-2015-05-01",
        },
        profile: "",
        valueSetParams: [
          { oid: "2.16.840.1.113883.3.666.5.307" },
          { oid: "2.16.840.1.113883.3.464.1003.103.12.1001" },
        ],
      },
      { headers: { Authorization: "Bearer undefined" }, signal: true }
    );
  });

  it("gives expanded ValueSets for ValueSets in cqm measure", () => {
    axios.put = jest
      .fn()
      .mockResolvedValueOnce({ data: cqm_measure_basic_valueset });

    terminologyService
      .getQdmValueSetsExpansion(cqm_measure_basic, testManifestExpansion, false)
      .then((data: ValueSet[]) => {
        expect(axios.put).toBeCalledWith(
          "test.url/terminology/value-sets/expansion/qdm",
          {
            includeDraft: "yes",
            manifestExpansion: {
              fullUrl:
                "https://cts.nlm.nih.gov/fhir/Library/mu2-update-2015-05-01",
              id: "mu2-update-2015-05-01",
            },
            profile: "",
            valueSetParams: [
              { oid: "2.16.840.1.113883.3.666.5.307" },
              { oid: "2.16.840.1.113883.3.464.1003.103.12.1001" },
            ],
          },
          { headers: { Authorization: "Bearer undefined" }, signal: false }
        );
        expect(data.length).toEqual(2);
        expect(data[0].display_name).toEqual("Encounter Inpatient");
        expect(data[0].oid).toEqual("2.16.840.1.113883.3.666.5.307");
        expect(data[0].concepts.length).toEqual(3);
      });
  });

  it("throws an error if ValueSets not found in VSAC for cqm measure", async () => {
    const response = {
      timestamp: "2024-06-13T16:20:58.424+00:00",
      status: 404,
      error: "Not Found",
      message: "No message available",
      diagnostic:
        "Requested resource was not found. Either the resource doesn't exist, or you don't have the permission to view it.",
      valueSet: "2.16.840.1.113762.1.4.1147.82",
    };
    axios.put = jest
      .fn()
      .mockRejectedValue({ response: { status: 404, data: response } });
    try {
      await terminologyService.getQdmValueSetsExpansion(
        cqm_measure_basic,
        testManifestExpansion,
        false
      );
    } catch (error) {
      expect(error.message).toContain(response.valueSet);
      expect(error.message).toContain("Latest");
      expect(error.message).not.toContain("Manifest");
      expect(error.message).toContain(`Per VSAC, \"${response.diagnostic}\"`);
    }
  });

  it("throws an error if ValueSets not found in VSAC for cqm measure", async () => {
    const response = {
      timestamp: "2024-06-13T16:20:58.424+00:00",
      status: 404,
      error: "Not Found",
      message: "No message available",
      diagnostic:
        "Requested resource was not found. Either the resource doesn't exist, or you don't have the permission to view it.",
      valueSet: "2.16.840.1.113762.1.4.1147.82",
    };

    const error = new Error("Request canceled");
    error.code = "ERR_CANCELED";
    error.response = { status: 404, data: response };

    axios.put = jest.fn().mockRejectedValue(error);

    try {
      await terminologyService.getQdmValueSetsExpansion(
        cqm_measure_basic,
        testManifestExpansion,
        false
      );
    } catch (error) {
      expect(error.code).toBe("ERR_CANCELED");
    }
  });

  test("throws an error when VSAC throws an error during expansion with manifest", async () => {
    const response = {
      timestamp: "2024-06-13T16:34:55.931+00:00",
      status: 400,
      error: "Bad Request",
      message: "No message available",
      diagnostic:
        "Content returned as invalid against the specification. Either the specification contains invalid elements, or the server failed to process due to internal errors.",
      valueSet: "2.16.840.1.114222.4.11.837",
      manifest: "mu2-update-2015-05-01",
    };
    axios.put = jest
      .fn()
      .mockRejectedValue({ response: { status: 400, data: response } });
    try {
      await terminologyService.getQdmValueSetsExpansion(
        cqm_measure_basic,
        testManifestExpansion,
        true
      );
    } catch (error) {
      expect(error.message).toContain(response.valueSet);
      expect(error.message).not.toContain("Latest");
      expect(error.message).toContain("Manifest");
      expect(error.message).toContain(response.manifest);
      expect(error.message).toContain(`Per VSAC, \"${response.diagnostic}\"`);
    }
  });

  it("test getQdmValueSetsExpansion no search param", () => {
    const result = terminologyService.getQdmValueSetsExpansion(
      testCqmMeasure,
      testManifestExpansion,
      true
    );
    expect(_.isEmpty(result)).toBe(true);
  });

  it("test getOidFromString no match", () => {
    const result = terminologyService.getOidFromString("test");
    expect(result).toBeNull();
  });

  it("test getValueSetsOIdsFromBundle empty", () => {
    const bundle: fhir4.Bundle = {
      resourceType: "Bundle",
    } as fhir4.Bundle;
    const result = terminologyService.getValueSetsOIdsFromBundle(bundle);
    expect(_.isEmpty(result)).toBe(true);
  });

  it("test getCqlCodesForDRCs", () => {
    const result = terminologyService.getCqlCodesForDRCs(cqm_measure_basic);
    expect(result.length).toBe(3);

    expect(result[0].cqlCode.code).toBe("drc-bdb8b89536181a411ad034378b7ceef6");
    expect(result[0].cqlCode.system).toBe("LOINC");
    expect(result[0].cqlCode.display).toBe("Housing status");
    expect(result[0].codeSystemOid).toBe("2.16.840.1.113883.6.1");
    expect(result[1].cqlCode.code).toBe("160734000");
    expect(result[1].cqlCode.system).toBe("SNOMEDCT");
    expect(result[1].cqlCode.display).toBe("Lives in a nursing home (finding)");
    expect(result[1].codeSystemOid).toBe("2.16.840.1.113883.6.96");
    expect(result[2].cqlCode.code).toBe("98181-1");
    expect(result[2].cqlCode.system).toBe("LOINC");
    expect(result[2].cqlCode.display).toBe("Medical equipment used");
    expect(result[2].codeSystemOid).toBe("2.16.840.1.113883.6.1");
  });

  it("test getCqlCodesForDRCs no codes", () => {
    const result = terminologyService.getCqlCodesForDRCs(testCqmMeasure);
    expect(_.isEmpty(result)).toBe(true);
  });

  it("test getDrcOid", () => {
    const result = terminologyService.getDrcOid(
      cqm_measure_basic,
      "drc-bdb8b89536181a411ad034378b7ceef6"
    );
    expect(result).toBe("drc-bdb8b89536181a411ad034378b7ceef6");
  });

  it("test getValueSetsForDRCs", () => {
    const result: ValueSet[] =
      terminologyService.getValueSetsForDRCs(cqm_measure_basic);

    expect(result.length).toBe(3);

    expect(result[0].oid).toBe("drc-bdb8b89536181a411ad034378b7ceef6");
    expect(result[0].concepts[0].code).toBe(
      "drc-bdb8b89536181a411ad034378b7ceef6"
    );
    expect(result[0].concepts[0].code_system_name).toBe("LOINC");
    expect(result[0].concepts[0].display_name).toBe("Housing status");
    expect(result[0].concepts[0].code_system_oid).toBe("2.16.840.1.113883.6.1");

    expect(result[1].oid).not.toBe("drc-bdb8b89536181a411ad034378b7ceef6");
    expect(result[1].oid).toContain("drc-");
  });

  it("test getValueSetsForDRCs no value sets", () => {
    const result = terminologyService.getValueSetsForDRCs(testCqmMeasure);
    expect(_.isEmpty(result)).toBe(true);
  });
});
