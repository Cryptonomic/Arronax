export interface TabsProps {
    full: string[];
    short: string[];
    selected: string;
    onChange: (value: string) => void;
}
