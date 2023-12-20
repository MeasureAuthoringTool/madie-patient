import * as ucum from "@lhncbc/ucum-lhc";

export class ValidationResult {
  label?: string;
  helperText?: string;
  error: boolean;
}

export const validate = (code): ValidationResult => {
  const validationResult: ValidationResult = new ValidationResult();
  if (code) {
    var parseResp = ucum.UcumLhcUtils.getInstance().validateUnitString(
      code,
      true
    );
    if (parseResp.status === "valid") {
      validationResult.error = false;
      validationResult.label = parseResp.unit.name;
    } else {
      //create a message from
      if (parseResp?.suggestions) {
        let errorMsg: string = parseResp.suggestions[0]?.msg + ": ";

        parseResp.suggestions[0].units.forEach((value) => {
          errorMsg += value[0] + ", ";
        });
        validationResult.error = true;
        validationResult.helperText = errorMsg;
      } else {
        validationResult.error = true;
        validationResult.helperText = parseResp.msg[0];
      }
    }
  }
  return validationResult;
};
