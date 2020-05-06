import styled from 'styled-components';

import DatePickerInput from './DatePickerInput';

export const Container = styled.div<{ isLong: boolean }>`
    width: ${({ isLong }) => (isLong ? '350px' : '200px')};
    height: 52px;
    display: flex;
    align-items: center;
    flex: 1;
`;

export const DatePickerWrapper = styled(DatePickerInput)`
    border-radius: 0 5px 5px 0;
    border: none;
    color: #4a4a4a;
    font-size: 18px;
    font-family: 'Roboto', sans-serif;
    font-weight: 500;
    height: 52px;
    letter-spacing: 0;
    padding: 0 18px;
    line-height: 17px;
    width: 100%;
    outline: none;
`;

export const styles: any = {
    root: {
        height: 250,
        flexGrow: 1,
    },
    container: {
        position: 'relative',
        minWidth: '100%',
    },
    suggestionsContainerOpen: {
        position: 'absolute',
        zIndex: 1,
        left: 0,
        right: 0,
        maxHeight: 200,
        overflow: 'auto',
        paddingBottom: 3,
        borderRadius: 3,
        width: 'fit-content',
        minWidth: '100%',
    },
    suggestion: {
        display: 'block',
    },
    suggestionsList: {
        margin: 0,
        padding: 0,
        listStyleType: 'none',
    },
    input: {
        color: '#4A4A4A',
        fontSize: '18px',
        width: '100%',
        letterSpacing: 0,
        lineHeight: '17px',
        height: '52px',
        paddingLeft: '10px',
        flex: 1,
    },
};
