interface Props {
  operator: string;
  selectedValues: string[];
  values: string[];
}

export interface ValueSelectProps extends Props {
  placeholder?: string;
  onChange: (value: string[]) => void;
}

export interface ValueSelectItemsProps extends Props {
  handleMultipleChange: (value: any) => void;
  handleChange: (value: any) => void;
}
