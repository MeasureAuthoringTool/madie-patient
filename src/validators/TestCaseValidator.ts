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
                        function (value) {
                          if (value === undefined || value === null) {
                            return true;
                          }
                          if (populationBasis === "Boolean") {
                            if (typeof value === "boolean") {
                              return true;
                            } else {
                              return this.createError({
                                message: "Must be of type boolean",
                              });
                            }
                          } else {
                            if (isNaN(+value)) {
                              return this.createError({
                                message:
                                  "Only numeric values can be entered in the expected values",
                              });
                            }
                          }
                          return true;
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
