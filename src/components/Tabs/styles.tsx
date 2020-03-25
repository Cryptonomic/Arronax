import { withStyles } from '@material-ui/core/styles';
import styled from 'styled-components';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

export const TabsWrapper = withStyles({
    root: {
        width: '100%',
        borderBottom: 'none',
        padding: '0px 30px'
    },
    flexContainer: {
        borderBottom: '5px solid #f9fafc',
        width: 'max-content',
    },
    scrollButtons: {
        color: '#2e3b6c',
    },
    indicator: {
        backgroundColor: '#a6dfe2',
        height: '5px',
    },
})(Tabs);

export const TabWrapper = withStyles({
    root: {
        textTransform: 'capitalize',
        padding: 0,
        minWidth: '50px',
        fontWeight: 300,
        color: '#2e3b6c',
        fontSize: '24px',
        letterSpacing: '3px',
        maxWidth: '500px',
        marginRight: '50px',
        '&$selected': {
            fontWeight: 'normal',
        },
        '&:last-child': {
            marginRight: '0px',
        },
    },
    selected: {},
})(Tab);

export const IconWrapper = styled.div`
    display: flex;
    align-items: center;
`;
