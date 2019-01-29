import * as React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { getColumns } from '../../reducers/app/selectors';
import CustomTableRow from '../CustomTableRow';
import CustomTableHeader from '../TableHeader';
import CustomPaginator from '../CustomPaginator';

const TableContainer = styled(Table)`
  width: 100%;
  background: #fff;
  border-radius: 4px;
`;

const desc = (a, b, orderBy) => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
};

const stableSort = (array, cmp) => {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
};

const getSorting = (order, orderBy) => {
  return order === 'desc'
    ? (a, b) => desc(a, b, orderBy)
    : (a, b) => -desc(a, b, orderBy);
};

interface Props {
  category: string;
  items: any[];
  getColumns: any[];
}

interface State {
  page: number;
  rowsPerPage: number;
  order: 'asc' | 'desc';
  orderBy: string;
}

class CustomTable extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      page: 0,
      rowsPerPage: 10,
      order: 'asc',
      orderBy: 'level',
    };
  }

  handleChangePage = page => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  handleRequestSort = (property: string) => {
    const orderBy = property;
    let order: 'asc' | 'desc' = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({ order, orderBy });
  };

  render() {
    const { items, category, getColumns } = this.props;
    const { page, rowsPerPage, order, orderBy } = this.state;
    const emptyRows =
      rowsPerPage - Math.min(rowsPerPage, items.length - page * rowsPerPage);
    const realRows = stableSort(items, getSorting(order, orderBy)).slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
    const columns = getColumns;
    console.log('COLUMNS', columns);
    const newColumns = columns.map(column => column.key);
    console.log('NEW COLUMNS', newColumns);
    console.log('ITEMS', items);
    // needing to trim down the ITEMS to match only the selected columns
    return (
      <React.Fragment>
        <TableContainer>
          <CustomTableHeader
            rows={columns}
            order={order}
            orderBy={orderBy}
            createSortHandler={this.handleRequestSort}
          />
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
        </TableContainer>
        <CustomPaginator
          page={page}
          totalNumber={items.length}
          onChangePage={this.handleChangePage}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state: any) => ({
  getColumns: getColumns(state),
});

export default connect(
  mapStateToProps,
  null
)(CustomTable);
