export interface TabsProps {
    full: string[];
    short: string[];
    selected: string;
    expanded: boolean;
    onChange: (value: string) => void;
}
