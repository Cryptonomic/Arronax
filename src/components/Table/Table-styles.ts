import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import styled from 'styled-components';
import muiStyled from '@material-ui/styles/styled';

export const useOverflow  = () => styled.div`
  overflow-x: auto;
  height: 500px
`;

export const useTableBodyCellChild  = () => styled.div`
  display: flex
`;

export const useTableContainerStyles = () => muiStyled(Table)({
  width: '100%',
  background: '#fff',
  borderRadius: '4px'
});

export const useTableBodyRowStyles = () => styled(TableRow)`
  &&& {
    &:nth-of-type(odd) {
      background-color: #ecedef;
    }
  }
`;

export const useTableHeaderCellStyles = () => muiStyled(TableCell)({
  color: '#4a4a4a',
  fontSize: '16px',
  fontWeight: 400,
  letterSpacing: '1.95px',
  border: 'none'
});

export const useTableBodyCellStyles = () => styled(TableCell)`
  &&& {
    color: #4a4a4a;
    font-size: 16px;
    font-weight: 300;
    letter-spacing: -0.55px;
    border: none;
  }
`