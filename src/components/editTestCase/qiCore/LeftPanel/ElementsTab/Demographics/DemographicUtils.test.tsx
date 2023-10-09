import * as React from "react";

import { createExtension } from "./DemographicUtils";

describe("Demographics utils components", () => {
  it("Create extension works as expected", () => {
    const raceExtension = [
      { url: "raceOmb" },
      { url: "raceDetailed" },
      { url: "ethnicityOMB" },
      { url: "ethnicityDetailed" },
    ];
    const raceOMBResult = createExtension(
      "American Indian or Alaska Native",
      "raceOMB",
      raceExtension
    );
    const raceDetailedResult = createExtension(
      "Apache",
      "raceDetailed",
      raceExtension
    );
    const ethnicityOMBResult = createExtension(
      "Hispanic or Latino",
      "ethnicityOMB",
      raceExtension
    );
    const EthnicityDetailedResult = createExtension(
      "Spaniard",
      "ethnicityDetailed",
      raceExtension
    );

    expect(raceOMBResult).toStrictEqual({
      url: "ombCategory",
      valueCoding: {
        code: "1002-5",
        display: "American Indian or Alaska Native",
        system: "urn:oid:2.16.840.1.113883.6.238",
      },
    });
    expect(raceDetailedResult).toStrictEqual({
      url: "detailed",
      valueCoding: {
        code: "1010-8",
        display: "Apache",
        system: "urn:oid:2.16.840.1.113883.6.238",
      },
    });
    expect(ethnicityOMBResult).toStrictEqual({
      url: "ombCategory",
      valueCoding: {
        code: "2135-2",
        display: "Hispanic or Latino",
        system: "urn:oid:2.16.840.1.113883.6.238",
      },
    });
    expect(EthnicityDetailedResult).toStrictEqual({
      url: "detailed",
      valueCoding: {
        code: "2137-8",
        display: "Spaniard",
        system: "urn:oid:2.16.840.1.113883.6.238",
      },
    });
  });
});
