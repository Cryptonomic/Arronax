import * as React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import {
  getNetwork,
  getRows,
  getColumns,
  getPlatform,
  getEntity,
  getAttributes,
  getModalItem
} from '../../reducers/app/selectors';
import { getItemByPrimaryKey } from '../../reducers/app/thunks';
import CustomTableRow from '../../components/CustomTableRow';
import CustomTableHeader from '../../components/TableHeader';
import CustomPaginator from '../../components/CustomPaginator';
import EntityModal from 'components/EntityModal';

const TableContainer = styled(Table)`
  width: 100%;
  background: #fff;
  border-radius: 4px;
`;

const Overflow = styled.div`
  overflow-x: auto;
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
    const order = cmp(b[0], a[0]);
    if (order !== 0) return order;
    return b[1] - a[1];
  });
  return stabilizedThis.map(el => el[0]);
};

const getSorting = (order, orderBy) => {
  return order === 'desc'
    ? (a, b) => desc(a, b, orderBy)
    : (a, b) => -desc(a, b, orderBy);
};

interface Props {
  rowsPerPage: number;
  items: any[];
  selectedColumns: any[];
  network: string;
  platform: string;
  selectedEntity: string;
  selectedModalItem: object;
  attributes: any[];
  isLoading: boolean;
  onExportCsv: () => void;
  getModalItemAction: (key: string, value: string | number) => void;
}

interface State {
  page: number;
  order: 'asc' | 'desc';
  orderBy: string;
  isOpenedModal: boolean;
  selectedPrimaryKey: string;
  selectedPrimaryValue: string | number;
}

class CustomTable extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      page: 0,
      order: 'asc',
      orderBy: 'level',
      isOpenedModal: false,
      selectedPrimaryKey: '',
      selectedPrimaryValue: ''
    };
  }

  handleChangePage = page => {
    this.setState({ page });
  };

  handleRequestSort = (property: string) => {
    const orderBy = property;
    let order: 'asc' | 'desc' = 'desc';
    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }
    this.setState({ order, orderBy });
  };

  onCloseModal = () => this.setState({isOpenedModal: false});

  onOpenModal = (key, value) => {
    const { selectedPrimaryKey, selectedPrimaryValue } = this.state;
    const { getModalItemAction } = this.props;
    if (selectedPrimaryKey !== key || selectedPrimaryValue !== value) {
      getModalItemAction(key, value);
      this.setState({selectedPrimaryKey: key, selectedPrimaryValue: value, isOpenedModal: true});
    }
    this.setState({isOpenedModal: true});
  }

  render() {
    const {
      items,
      network,
      selectedColumns,
      rowsPerPage,
      platform,
      selectedEntity,
      selectedModalItem,
      attributes,
      isLoading,
      onExportCsv
    } = this.props;
    const { page, order, orderBy, isOpenedModal} = this.state;
    const rowCount = rowsPerPage !== null ? rowsPerPage : 10;
    const realRows = stableSort(items, getSorting(order, orderBy)).slice(
      page * rowCount,
      page * rowCount + rowCount
    );
    return (
      <React.Fragment>
        <Overflow>
          <TableContainer>
            <CustomTableHeader
              rows={selectedColumns}
              order={order}
              orderBy={orderBy}
              createSortHandler={this.handleRequestSort}
            />
            <TableBody>
              {realRows.map((row, index) => {
                return (
                  <CustomTableRow
                    network={network}
                    selectedColumns={selectedColumns}
                    key={index}
                    item={row}
                    platform={platform}
                    selectedEntity={selectedEntity}
                    onClickPrimaryKey={this.onOpenModal}
                  />
                );
              })}
            </TableBody>
          </TableContainer>
        </Overflow>
        <CustomPaginator
          rowsPerPage={rowCount}
          page={page}
          totalNumber={items.length}
          onChangePage={this.handleChangePage}
          onExportCsv={onExportCsv}
        />
        <EntityModal
          open={isOpenedModal}
          selectedEntity={selectedEntity}
          attributes={attributes}
          item={selectedModalItem}
          isLoading={isLoading}
          onClose={this.onCloseModal}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state: any) => ({
  rowsPerPage: getRows(state),
  network: getNetwork(state),
  selectedColumns: getColumns(state),
  platform: getPlatform(state),
  selectedEntity: getEntity(state),
  selectedModalItem: getModalItem(state),
  attributes: getAttributes(state),
});

const mapDispatchToProps = dispatch => ({
  getModalItemAction: (key, value) => dispatch(getItemByPrimaryKey(key, value))
});


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomTable);
