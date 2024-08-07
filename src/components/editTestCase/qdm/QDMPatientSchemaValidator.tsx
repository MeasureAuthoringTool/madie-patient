import * as Yup from "yup";
import { PopulationType } from "@madie/madie-models";
import * as ucum from "@lhncbc/ucum-lhc";

export const QDMPatientSchemaValidator = Yup.object().shape({
  description: Yup.string().max(
    250,
    "Test Case Description cannot be more than 250 characters."
  ),
  title: Yup.string()
    .required("Test Case Title is required.")
    .matches(/[a-zA-Z]/, "Test Case Title is required.")
    .max(250, "Test Case Title cannot be more than 250 characters."),
  series: Yup.string(),
  // json: Yup.string().nullable(),
  id: Yup.string(),
  birthDate: Yup.string()
    .nullable()
    .test("birthDate", "Birthdate is required", async (birthDate) => {
      return birthDate !== "Invalid Date";
    }),
});
