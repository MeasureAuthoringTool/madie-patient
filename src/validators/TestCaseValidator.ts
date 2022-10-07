import * as Yup from "yup";

export const TestCaseValidator = Yup.object().shape({
  title: Yup.string()
    .required("Test Case Title is required.")
    .max(250, "Test Case Title cannot be more than 250 characters."),
  description: Yup.string().max(
    250,
    "Test Case Description cannot be more than 250 characters."
  ),
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
                          if (value === undefined || value === null) {
                            return true;
                          } else if (
                            populationBasis === "Boolean" &&
                            population.parent.name !== "measureObservation" &&
                            typeof value === "boolean"
                          ) {
                            return true;
                          } else if (
                            populationBasis !== "Boolean" ||
                            population.parent.name === "measureObservation"
                          ) {
                            if (isNaN(+value) || +value < 0) {
                              return this.createError({
                                message:
                                  "Only positive numeric values can be entered in the expected values",
                              });
                            } else {
                              return true;
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
