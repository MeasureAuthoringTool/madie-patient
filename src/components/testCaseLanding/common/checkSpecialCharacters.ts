import { TestCase } from "@madie/madie-models";

export const EXPORT_ERROR_CHARACTERS_MESSAGE =
  "Test Cases can not be exported some titles or groups contain special characters.";
const checkSpecialCharacters = (testCases: TestCase[]): string[] => {
  const specialChars = /[`!@#$%^&*()_\+=\[\]{};':"\\|,.<>\/?~]/;
  let series, title;
  const failedTCs = [];
  testCases?.forEach((tc) => {
    series = specialChars.test(tc.series);
    title = specialChars.test(tc.title);
    if (series || title) {
      failedTCs.push(
        `${EXPORT_ERROR_CHARACTERS_MESSAGE}${tc.series} ${tc.title}`
      );
    }
  });
  return failedTCs;
};
export default checkSpecialCharacters;
