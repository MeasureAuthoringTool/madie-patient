import * as Yup from "yup";
import { PopulationType } from "@madie/madie-models";
import * as ucum from "@lhncbc/ucum-lhc";

export const QDMPatientSchemaValidator = Yup.object().shape({
  // json: Yup.object().test("test-compare a few values", function (value) {

  //   const elements:Array<any> = value?.dataElements ? value?.dataElements : [];

  //   elements.forEach((element) => {

  //     if (element.result) {
  //       console.log("###### Result",element?.result?.unit);
  //       const unit = element?.result?.unit;
  //       var parseResp = ucum.UcumLhcUtils.getInstance().validateUnitString(unit, true);
  //       if (!unit || (unit && parseResp.status === "valid")) {
  //         return true;
  //       } else {
  //         //create a message from
  //         console.error("There was an error", parseResp);
  //         if (parseResp?.suggestions) {
  //           let errorMsg: string = parseResp.suggestions[0]?.msg + ": ";

  //           parseResp.suggestions[0].units.forEach((value) => {
  //             errorMsg += value[0] + ", ";
  //           });
  //           return this.createError({
  //             message: errorMsg,
  //             path: "scoringUnit.value", // Fieldname
  //           });
  //         } else {
  //           return this.createError({
  //             message: parseResp.msg[0],
  //             path: "scoringUnit.value", // Fieldname
  //           });
  //         }
  //       }
  //     }

  //   });
  //   return true;
  // }),
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
    .nullable()
    .test("birthDate", "Birthdate is required", async (birthDate) => {
      return birthDate !== "Invalid Date";
    }),
});
