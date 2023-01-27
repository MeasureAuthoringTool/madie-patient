export interface ScanValidationDto {
  fileName: string;
  valid: boolean;
  error: ObjectError;
}

export interface ObjectError {
  codes?: string[];
  defaultMessage: string;
  objectName?: string;
  code?: string;
}
