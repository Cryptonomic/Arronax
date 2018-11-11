import * as React from 'react';
import styled from 'styled-components';

interface FilterHTMLProps {
    bordered?: boolean;
}

interface FilterControlProps extends FilterHTMLProps {
    ctrlType: string;
    ctrlLabel: string;
    ctrlControlIndex: number;
    ctrlBordered: boolean;
    ctrlValue: string;
    ctrlChange: (name: string, position: number, event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
}

const TextAreaFilter = styled.textarea`
  width: 100%;
  height: 3em;
  border: ${(props: FilterHTMLProps) => props.bordered ? '2px solid red' : 'none'};
`;

const InputFilter = styled.input.attrs({
    type: 'text'
})`
  width: 100%;
  border: ${(props: FilterHTMLProps) => props.bordered ? '2px solid red' : 'none'};
`;

const Label = styled.label`
  color: white;
`;

const filterPanelControl: React.SFC<FilterControlProps> = (props) => {
    if (props.ctrlType === 'limit') {
        return (
            <>
                <Label>{props.ctrlLabel}:</Label>
                <InputFilter
                    bordered={props.ctrlBordered}
                    value={props.ctrlValue}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        props.ctrlChange(props.ctrlType, props.ctrlControlIndex, event)
                    }
                />
            </>
        );
    } else {
        return (
            <>
                <Label>{props.ctrlLabel}:</Label>
                <TextAreaFilter
                    bordered={props.ctrlBordered}
                    value={props.ctrlValue}
                    onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
                        props.ctrlChange(props.ctrlType, props.ctrlControlIndex, event)
                    }
                />
            </>
        );
    }
};

export default filterPanelControl;
