export interface TypeComponentProps {
  label?: string;
  canEdit: boolean;
  value?: any;
  onChange?: (nextValue: any) => void;
  structureDefinition: any;
  fieldRequired: boolean;
  unsignedInt?: boolean;
}
