export interface TypeComponentProps {
  label?: string;
  disabled: boolean;
  value?: any;
  onChange?: (nextValue: any) => void;
  structureDefinition: any;
  fieldRequired: boolean;
}
