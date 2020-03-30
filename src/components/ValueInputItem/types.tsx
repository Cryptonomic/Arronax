import { AttributeDefinition } from 'conseiljs';
import { WithTranslation } from 'react-i18next';

export interface DatePickerInputProps {
    className?: string;
    value?: string;
    placeholder?: string;
    onClick?: () => void;
}

export interface Props extends WithTranslation {
    attribute: AttributeDefinition;
    value: string;
    disabled?: boolean;
    onChange: (value: string) => void;
    fetchValues: (attribute: string, value: string) => any;
    classes: any;
}

export interface State {
    prevValue: string;
    stateVal: string;
    suggestions: any[];
    searchedVal: string;
    availableValues: string[];
    suggestionSelected: string;
}
