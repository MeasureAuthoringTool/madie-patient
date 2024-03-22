import checkSpecialCharacters from "./checkSpecialCharacters";
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
    expect(checkSpecialCharacters(testCases).length).toBe(
      allSpecialChars.length
    );
  });
});
