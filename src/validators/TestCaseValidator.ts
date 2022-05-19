import * as Yup from "yup";

export const TestCaseValidator = Yup.object().shape({
  title: Yup.string().max(
    250,
    "Test Case Title cannot be more than 250 characters."
  ),
  description: Yup.string().max(
    250,
    "Test Case Description cannot be more than 250 characters."
  ),
  series: Yup.string().nullable(),
});
