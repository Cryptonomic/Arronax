import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import muiStyled from '@material-ui/styles/styled';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import { ConseilSortDirection, EntityDefinition } from 'conseiljs';
import {
  getNetwork,
  getRows,
  getColumns,
  getPlatform,
  getEntity,
  getAttributesAll,
  getModalItem,
  getSort,
  getEntities
} from '../../reducers/app/selectors';
import { getItemByPrimaryKey, submitQuery } from '../../reducers/app/thunks';
import { setSortAction } from '../../reducers/app/actions';
import CustomTableRow from '../../components/CustomTableRow';
import CustomTableHeader from '../../components/TableHeader';
import CustomPaginator from '../../components/CustomPaginator';
import EntityModal from '../../components/EntityModal';
import { Sort } from '../../types';

const TableContainer = muiStyled(Table)({
  width: '100%',
  background: '#fff',
  borderRadius: '4px'
});

const Overflow = styled.div`
  overflow-x: auto;
`;

interface Props {
  rowsPerPage: number;
  items: any[];
  selectedColumns: any[];
  network: string;
  platform: string;
  selectedEntity: string;
  selectedModalItem: object;
  attributes: any;
  isLoading: boolean;
  selectedSort: Sort;
  entities: EntityDefinition[];
  onExportCsv: () => void;
  getModalItemAction: (entity: string, key: string, value: string | number) => void;
  onSubmitQuery: () => void;
  onSetSort: (entity: string, sorts: Sort[]) => void;
}

interface State {
  page: number;
  isOpenedModal: boolean;
  selectedPrimaryKey: string;
  selectedPrimaryValue: string | number;
  referenceEntity: string;
}

class CustomTable extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      page: 0,
      isOpenedModal: false,
      selectedPrimaryKey: '',
      selectedPrimaryValue: '',
      referenceEntity: props.selectedEntity
    };
  }

  handleChangePage = (page: number) => {
    this.setState({ page });
  };

  handleRequestSort = async (orderBy: string) => {
    const { selectedSort, selectedEntity, onSetSort, onSubmitQuery } = this.props;
    let order = ConseilSortDirection.DESC;
    if (selectedSort.orderBy === orderBy && selectedSort.order === 'desc') {
      order = ConseilSortDirection.ASC;
    }
    const sorts: Sort[] = [{ orderBy, order }];
    await onSetSort(selectedEntity, sorts);
    onSubmitQuery();
  };

  onCloseModal = () => this.setState({isOpenedModal: false});

  onOpenModal = (entity: string, key: string, value: string | number) => {
    const { selectedPrimaryKey, selectedPrimaryValue } = this.state;
    const { getModalItemAction } = this.props;
    if (selectedPrimaryKey !== key || selectedPrimaryValue !== value) {
      getModalItemAction(entity, key, value);
      this.setState({referenceEntity: entity, selectedPrimaryKey: key, selectedPrimaryValue: value, isOpenedModal: true});
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
      selectedSort,
      isLoading,
      entities,
      onExportCsv
    } = this.props;
    const { page, referenceEntity, isOpenedModal} = this.state;
    const rowCount = rowsPerPage !== null ? rowsPerPage : 10;
    const realRows = items.slice(
      page * rowCount,
      page * rowCount + rowCount
    );
    const selectedObjectEntity = entities.find(entity => entity.name === referenceEntity);
    return (
      <React.Fragment>
        <Overflow>
          <TableContainer>
            <CustomTableHeader
              rows={selectedColumns}
              order={selectedSort.order}
              orderBy={selectedSort.orderBy}
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
          title={selectedObjectEntity.displayName}
          attributes={attributes[referenceEntity]}
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
  attributes: getAttributesAll(state),
  selectedSort: getSort(state),
  entities: getEntities(state)
});

const mapDispatchToProps = (dispatch: any) => ({
  getModalItemAction: (entity: string, key: string, value: string | number) => dispatch(getItemByPrimaryKey(entity, key, value)),
  onSubmitQuery: () => dispatch(submitQuery()),
  onSetSort: (entity: string, sorts: Sort[]) => dispatch(setSortAction(entity, sorts))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomTable);
