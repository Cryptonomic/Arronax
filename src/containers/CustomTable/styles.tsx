import styled from 'styled-components';
import muiStyled from '@material-ui/styles/styled';
import Table from '@material-ui/core/Table'

export const TableContainer = muiStyled(Table)({
  width: '100%',
  background: '#fff',
  borderRadius: '4px'
});

export const Overflow = styled.div`
  overflow-x: auto;
  max-height: 64vh;
`;