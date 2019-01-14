import * as React from 'react';
import styled from 'styled-components';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import getColumns from '../../utils/getColumns';
import CustomTableRow from '../CustomTableRow';

const TableContainer = styled(Table)`
  width: 100%;
  background: #fff;
  border-radius: 4px;
`;

const StyledCell = styled(TableCell)`
  &&& {
    padding: 0;
    font-weight: 300;
    color:rgba(0, 0, 0, 0.54);
  }
`;

const StyledHeadCell = styled(TableCell)`
  &&& {
    padding: 0;
    font-weight: bold;
    color: rgba(0, 0, 0, 0.9);
  }
`;

const TableHeaderWrapper = styled(TableHead)`
  &&& {
    background: rgb(250, 250, 250);
    font-weight: bold;
  }
`;


interface Props {
  category: string;
  items: any[];
}

interface State {
  page: number;
  rowsPerPage: number;
}

class CustomTable extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      page: 0,
      rowsPerPage: 10
    };
  }
  
  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  render() {
    const {items, category} = this.props;
    const {page, rowsPerPage} = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, items.length - page * rowsPerPage);
    const realRows = items.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    const columns = getColumns(category);
    return (
      <TableContainer>
        <TableHeaderWrapper>
          <TableRow>
            <StyledCell padding='checkbox'></StyledCell>
            {columns.map(column => {
              return (<StyledHeadCell key={column.key}>{column.title}</StyledHeadCell>)
            })}
          </TableRow>
        </TableHeaderWrapper>
        <TableBody>
          {realRows.map((row, index) => {
            return (
              <CustomTableRow key={index} category={category} item={row} />
            );
          })}
          {emptyRows > 0 && (
            <TableRow style={{ height: 48 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[10, 15, 20]}
              colSpan={3}
              count={items.length}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                native: true,
              }}
              onChangePage={this.handleChangePage}
              onChangeRowsPerPage={this.handleChangeRowsPerPage}
            />
          </TableRow>
        </TableFooter>
      </TableContainer>    
    );
  }
};

export default CustomTable;
