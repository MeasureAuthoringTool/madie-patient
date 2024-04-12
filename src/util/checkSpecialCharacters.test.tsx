import checkSpecialCharacters, {
  checkSpecialCharactersForExport,
  SPECIAL_CHARACTERS_ERROR_TITLE,
  SPECIAL_CHARACTERS_ERROR_SERIES,
  specialChars,
} from "./checkSpecialCharacters";
import { TestCase } from "@madie/madie-models";
const allSpecialChars = [
  "[",
  "]",
  "~",
  "!",
  "@",
  "$",
  "#",
  "^",
  "&",
  "*",
  "(",
  ")",
  "_",
  "+",
  "=",
  ";",
  ":",
  "'",
  "|",
  ",",
  "<",
  ">",
  "?",
  "?",
  ".",
  "\\",
];
describe("checks all special chars", () => {
  const testCases = allSpecialChars.map((c) => ({
    title: c,
    series: c,
  })) as TestCase[];
  it("triggers all available special chars", () => {
    expect(checkSpecialCharactersForExport(testCases).length).toBe(
      allSpecialChars.length
    );
  });

  it("Should return error for title", () => {
    const testCase: TestCase = {
      title: "[",
      series: "test series",
    } as TestCase;
    const error = checkSpecialCharacters(testCase);
    expect(error).toBe(
      SPECIAL_CHARACTERS_ERROR_TITLE +
        " These are special characters that are invalid: " +
        specialChars
    );
  });

  it("Should return error for group", () => {
    const testCase: TestCase = {
      title: "test title",
      series: " test series \\",
    } as TestCase;
    const error = checkSpecialCharacters(testCase);
    expect(error).toBe(
      SPECIAL_CHARACTERS_ERROR_SERIES +
        " These are special characters that are invalid: " +
        specialChars
    );
  });

  it("Should not return error", () => {
    const testCase: TestCase = {
      title: "test title",
      series: " test series",
    } as TestCase;
    const error = checkSpecialCharacters(testCase);
    expect(error).toBe("");
  });
});
