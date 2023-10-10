import axios from "axios";
import { TerminologyServiceApi } from "./useTerminologyServiceApi";
import { officeVisitValueSet } from "./__mocks__/OfficeVisitValueSet";
import { officeVisitMeasureBundle } from "./__mocks__/OfficeVisitMeasureBundle";
import { cqm_measure_basic } from "../mockdata/qdm/CMS108/cqm_measure_basic";
import { cqm_measure_basic_valueset } from "../mockdata/qdm/CMS108/cqm_measure_basic_valueset";
import { Measure as CqmMeasure } from "cqm-models";
import * as _ from "lodash";

jest.mock("axios");

jest.mock("@madie/madie-util", () => ({
  getOidFromString: (oid) => oid.split("urn:oid:")[1],
}));

const testCqmMeasure: CqmMeasure = new CqmMeasure();

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
    terminologyService.getQdmValueSetsExpansion(null).then((data) => {
      expect(data).toBeNull();
    });
  });

  it("gives expanded ValueSets for ValueSets in cqm measure", () => {
    axios.put = jest
      .fn()
      .mockResolvedValueOnce({ data: cqm_measure_basic_valueset });

    terminologyService
      .getQdmValueSetsExpansion(cqm_measure_basic)
      .then((data) => {
        expect(data.length).toEqual(2);
        expect(data[0].display_name).toEqual("Encounter Inpatient");
        expect(data[0].oid).toEqual("2.16.840.1.113883.3.666.5.307");
        expect(data[0].concepts.length).toEqual(3);
      });
  });

  it("throws an error if ValueSets not found in VSAC for cqm measure", async () => {
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
      await terminologyService.getQdmValueSetsExpansion(cqm_measure_basic);
    } catch (error) {
      expect(error.message).toEqual(
        "An error exists with the measure CQL, please review the CQL Editor tab."
      );
    }
  });

  it("test getQdmValueSetsExpansion no search param", () => {
    const result = terminologyService.getQdmValueSetsExpansion(testCqmMeasure);
    expect(_.isEmpty(result)).toBe(true);
  });

  it("test getOidFromString no match", () => {
    const result = terminologyService.getOidFromString("test");
    expect(result).toBeNull();
  });

  it("test getCqlCodesForDRCs", () => {
    const result = terminologyService.getCqlCodesForDRCs(cqm_measure_basic);
    expect(result.length).toBe(3);

    expect(result[0].code).toBe("71802-3");
    expect(result[0].system).toBe("LOINC");
    expect(result[0].display).toBe("Housing status");
    expect(result[1].code).toBe("160734000");
    expect(result[1].system).toBe("SNOMEDCT");
    expect(result[1].display).toBe("Lives in a nursing home (finding)");
    expect(result[2].code).toBe("98181-1");
    expect(result[2].system).toBe("LOINC");
    expect(result[2].display).toBe("Medical equipment used");
  });

  it("test getCqlCodesForDRCs no codes", () => {
    const result = terminologyService.getCqlCodesForDRCs(testCqmMeasure);
    expect(_.isEmpty(result)).toBe(true);
  });

  it("test getValueSetsForDRCs", () => {
    const result = terminologyService.getValueSetsForDRCs(cqm_measure_basic);

    expect(result.length).toBe(3);
    expect(result[0].oid).toBe("71802-3");
    expect(result[0].concepts[0].code).toBe("71802-3");
    expect(result[0].concepts[0].code_system_name).toBe("LOINC");
    expect(result[0].concepts[0].display_name).toBe("Housing status");
    expect(result[1].oid).toBe("160734000");
    expect(result[1].concepts[0].code).toBe("160734000");
    expect(result[1].concepts[0].code_system_name).toBe("SNOMEDCT");
    expect(result[1].concepts[0].display_name).toBe(
      "Lives in a nursing home (finding)"
    );
    expect(result[2].oid).toBe("98181-1");
    expect(result[2].concepts[0].code).toBe("98181-1");
    expect(result[2].concepts[0].code_system_name).toBe("LOINC");
    expect(result[2].concepts[0].display_name).toBe("Medical equipment used");
  });

  it("test getValueSetsForDRCs no value sets", () => {
    const result = terminologyService.getValueSetsForDRCs(testCqmMeasure);
    expect(_.isEmpty(result)).toBe(true);
  });
});
