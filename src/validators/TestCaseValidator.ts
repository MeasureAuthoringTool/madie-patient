import * as Yup from "yup";
import { PopulationType } from "@madie/madie-models";

export const TestCaseValidator = Yup.object().shape({
  title: Yup.string()
    .required("Test Case Title is required.")
    .matches(/[a-zA-Z]/, "Test Case Title is required.")
    .max(250, "Test Case Title cannot be more than 250 characters."),
  description: Yup.string()
    .max(250, "Test Case Description cannot be more than 250 characters.")
    .nullable(),
  series: Yup.string().nullable(),
  groupPopulations: Yup.array()
    .of(
      Yup.object()
        .shape({
          populationBasis: Yup.string().nullable(),
          populationValues: Yup.mixed().when(
            ["populationBasis"],
            (populationBasis) => {
              return Yup.array()
                .of(
                  Yup.object()
                    .shape({
                      name: Yup.string().nullable(),
                      expected: Yup.mixed().test(
                        "testExpectedTypes",
                        "Expected value type must match population basis type",
                        // must use old school "function" instead of lambda to
                        // get access to "this" that is used to create error
                        function (value, population) {
                          const observations = [
                            PopulationType.MEASURE_POPULATION_OBSERVATION,
                            PopulationType.NUMERATOR_OBSERVATION,
                            PopulationType.DENOMINATOR_OBSERVATION,
                          ];
                          if (value === undefined || value === null) {
                            return true;
                          } else if (
                            populationBasis === "boolean" &&
                            typeof value === "boolean"
                          ) {
                            return true;
                          } else if (
                            populationBasis !== "boolean" ||
                            observations.includes(population.parent.name)
                          ) {
                            if (!isNaN(+value) && +value >= 0) {
                              if (
                                !observations.includes(
                                  population.parent.name
                                ) &&
                                (!Number.isInteger(+value) ||
                                  String(value).indexOf(".") > 0)
                              ) {
                                return this.createError({
                                  message:
                                    "Decimals values cannot be entered in the population expected values",
                                });
                              } else {
                                return true;
                              }
                            } else {
                              return this.createError({
                                message:
                                  "Only positive numeric values can be entered in the expected values",
                              });
                            }
                          }
                          return false;
                        }
                      ),
                    })
                    .nullable()
                )
                .nullable();
            }
          ),
        })
        .nullable()
    )
    .nullable(),
});
