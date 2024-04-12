import { TestCase } from "@madie/madie-models";

export const specialChars = /[`!@#$%^&*()_\+=\[\]{};':"\\|,.<>\/?~]/;

export const EXPORT_ERROR_CHARACTERS_MESSAGE =
  "Test Cases can not be exported some titles or groups contain special characters.";
export const SPECIAL_CHARACTERS_ERROR_TITLE = `Test Case Title can not contain special characters: ${specialChars}`;
export const SPECIAL_CHARACTERS_ERROR_SERIES = `Test Case Group can not contain special characters: ${specialChars}`;

export const checkSpecialCharactersForExport = (
  testCases: TestCase[]
): string[] => {
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

const checkSpecialCharacters = (testCase: TestCase): string => {
  let series, title;
  let errorMsg = "";

  series = specialChars.test(testCase.series);
  title = specialChars.test(testCase.title);
  if (title) {
    errorMsg = SPECIAL_CHARACTERS_ERROR_TITLE;
  } else if (series) {
    errorMsg = SPECIAL_CHARACTERS_ERROR_SERIES;
  }
  return errorMsg;
};

export default checkSpecialCharacters;
