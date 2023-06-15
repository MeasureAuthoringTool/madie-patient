import LibraryElm from "../../mockdata/qdm/libraryElm.json";
import GlobalCommonFunctions from "../../mockdata/qdm/GlobalCommonFunctions.json";
import { ElmDependencyFinder } from "./ElmDependencyFinder";
import * as _ from "lodash";

describe("ElmDependencyFinder", () => {
  const elmDependencyFinder = new ElmDependencyFinder();

  it("should generate statement dependencies using library elms", async () => {
    const elms: Array<string> = [
      JSON.stringify(LibraryElm),
      JSON.stringify(GlobalCommonFunctions),
    ];
    const elmDepsMap = await elmDependencyFinder.findDependencies(
      elms,
      "TestQDMMeasureRohit"
    );
    expect(_.size(elmDepsMap)).toEqual(2);

    expect(_.has(elmDepsMap, "TestQDMMeasureRohit")).toBeTruthy();
    expect(_.size(elmDepsMap["TestQDMMeasureRohit"])).toBe(8);

    // Verifying if all statement references are returned (external and internal)
    expect(
      _.has(
        elmDepsMap["TestQDMMeasureRohit"],
        "Non Elective Inpatient Encounter"
      )
    ).toBeTruthy();
    expect(
      _.has(elmDepsMap["TestQDMMeasureRohit"], "Global Malnutrition Encounter")
    ).toBeTruthy();
    expect(
      _.has(
        elmDepsMap["TestQDMMeasureRohit"],
        "Encounter with Malnutrition Diagnosis"
      )
    ).toBeTruthy();
    expect(
      _.has(elmDepsMap["TestQDMMeasureRohit"], "SDE Ethnicity")
    ).toBeTruthy();

    // this definition has a reference to external function in MATGlobalCommonFunctions
    expect(
      _.size(
        elmDepsMap["TestQDMMeasureRohit"]["Non Elective Inpatient Encounter"]
      )
    ).toBe(1);
    expect(
      elmDepsMap["TestQDMMeasureRohit"]["Non Elective Inpatient Encounter"][0][
        "library_name"
      ]
    ).toBe("MATGlobalCommonFunctions");
    expect(
      elmDepsMap["TestQDMMeasureRohit"]["Non Elective Inpatient Encounter"][0][
        "statement_name"
      ]
    ).toBe("LengthInDays");

    // Verifying if the used statements in external library are returned
    expect(_.has(elmDepsMap, "MATGlobalCommonFunctions")).toBeTruthy();
    expect(_.size(elmDepsMap["MATGlobalCommonFunctions"])).toBe(2);
    expect(
      _.has(elmDepsMap["MATGlobalCommonFunctions"], "LengthInDays")
    ).toBeTruthy();
    expect(
      _.has(
        elmDepsMap["MATGlobalCommonFunctions"],
        "HospitalizationWithObservation"
      )
    ).toBeTruthy();
  });

  it("should throw error if a library is reference but the elm is not found", async () => {
    const elms: Array<string> = [JSON.stringify(LibraryElm)];

    try {
      await elmDependencyFinder.findDependencies(elms, "TestQDMMeasureRohit");
    } catch (e) {
      expect(e.message).toBe(
        "Elm library MATGlobalCommonFunctions referenced but not found."
      );
    }
  });

  it("should throw error if a statement is reference in external library but the reference is not found", async () => {
    const MATGlobalCommonFunctions =
      '{"library":{"annotation":{},"identifier":{"id":"MATGlobalCommonFunctions","version":"7.0.000"},"statements":{}}}';
    const elms: Array<string> = [
      JSON.stringify(LibraryElm),
      MATGlobalCommonFunctions,
    ];

    try {
      await elmDependencyFinder.findDependencies(elms, "TestQDMMeasureRohit");
    } catch (e) {
      expect(e.message).toBe(
        "Elm statement 'LengthInDays' referenced but not found in library 'MATGlobalCommonFunctions'."
      );
    }
  });
});
