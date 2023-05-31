import * as Yup from "yup";
import { PopulationType } from "@madie/madie-models";

export const QDMPatientSchemaValidator = Yup.object().shape({
  description: Yup.string().max(
    250,
    "Test Case Description cannot be more than 250 characters."
  ),
  title: Yup.string()
    .required("Test Case Title is required.")
    .max(250, "Test Case Title cannot be more than 250 characters."),
  series: Yup.string(),
  // json: Yup.string().nullable(),
  id: Yup.string(),
  birthDate: Yup.string()
    .required("Birthdate is required")
    .nullable()
    .test("birthDate", "Birthdate is required", async (birthDate) => {
      return birthDate !== "Invalid Date";
    }),
});
