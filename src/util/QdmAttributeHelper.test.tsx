import { stringifyValue } from "./QdmAttributeHelpers";
import cqmModels from "cqm-models";

describe("StringifyValue", () => {
  test("stringify value stringifies null value", () => {
    expect(stringifyValue(null)).toBe("null");
  });
  test("stringify value stringifies Code  value", () => {
    const code = new cqmModels.CQL.Code("code", "system", "version");
    expect(stringifyValue(code)).toBe(`${code.system} : ${code.code}`);
  });
  test("stringify value stringifies dates that are DateTime", () => {
    expect(stringifyValue("2012-04-05T08:15:00.000Z")).toBe(
      "03/04/2012 8:15 AM"
    );
  });
});
