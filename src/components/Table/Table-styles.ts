import styled from 'styled-components';
import muiStyled from '@material-ui/styles/styled';

export const useOverflow  = () => styled.div`
  overflow-x: auto;
  height: 500px
`;

export const useTableBodyCellChild  = () => styled.div`
  display: flex
`;

export const useTableContainerStyles = (Component) => muiStyled(Component)({
  width: '100%',
  background: '#fff',
  borderRadius: '4px'
});

export const useTableBodyRowStyles = (Component) => styled(Component)`
  &&& {
    &:nth-of-type(odd) {
      background-color: #ecedef;
    }
  }
`;

export const useTableHeaderCellStyles = (Component) => muiStyled(Component)({
  color: '#4a4a4a',
  fontSize: '16px',
  fontWeight: 400,
  letterSpacing: '1.95px',
  border: 'none'
});

export const useTableBodyCellStyles = (Component) => styled(Component)`
  &&& {
    color: #4a4a4a;
    font-size: 16px;
    font-weight: 300;
    letter-spacing: -0.55px;
    border: none;
  }
`