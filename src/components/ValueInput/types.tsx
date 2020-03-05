import { AttributeDefinition } from 'conseiljs';

export interface ValueInputProps {
  attribute: AttributeDefinition | undefined;
  operator: string;
  values: string[];
  onChange: (values: string[]) => void;
}
