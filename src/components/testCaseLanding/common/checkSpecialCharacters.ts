import { TestCase } from "@madie/madie-models";
import { EXPORT_ERROR_CHARACTERS } from "../qdm/TestCaseList";
const checkSpecialCharacters = (testCases: TestCase[]): string[] => {
  const specialChars = /[`!@#$%^&*()_\+=\[\]{};':"\\|,.<>\/?~]/;
  let series, title;
  const failedTCs = [];
  testCases?.forEach((tc) => {
    series = specialChars.test(tc.series);
    title = specialChars.test(tc.title);
    if (series || title) {
      failedTCs.push(`${EXPORT_ERROR_CHARACTERS}${tc.series} ${tc.title}`);
    }
  });
  return failedTCs;
};
export default checkSpecialCharacters;
