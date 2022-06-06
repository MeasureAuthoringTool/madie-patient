import axios from "axios";
import { TerminologyServiceApi } from "./useTerminologyServiceApi";
import { officeVisitValueSet } from "./__mocks__/OfficeVisitValueSet";
import { officeVisitMeasureBundle } from "./__mocks__/OfficeVisitMeasureBundle";

jest.mock("axios");

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
        "404 Not Found from GET https://vsac.nlm.nih.gov/vsac/svs/RetrieveMultipleValueSets?id=2.16.840.1.113883.3.464.1003.101.12.10011&ticket=ST-106586-7gtyv4fwl3xjfcyy-cas&profile=eCQM%20Update%202022-05-05&includeDraft=true",
      validationErrors: {
        "/api":
          "404 Not Found from GET https://vsac.nlm.nih.gov/vsac/svs/RetrieveMultipleValueSets?id=2.16.840.1.113883.3.464.1003.101.12.10011&ticket=ST-106586-7gtyv4fwl3xjfcyy-cas&profile=eCQM%20Update%202022-05-05&includeDraft=true",
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
});
