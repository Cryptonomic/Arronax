export interface TabsProps {
  tabs: string[];
  selected: string;
  expanded: boolean;
  onChange: (value: string) => void;
}

export interface TabsWrapperProps {
  variant: string;
}
