import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import muiStyled from '@material-ui/styles/styled';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import { ConseilSortDirection, EntityDefinition } from 'conseiljs';
import {
  getSelectedConfig,
  getRows,
  getColumns,
  getEntity,
  getAttributesAll,
  getModalItem,
  getSort,
  getEntities,
  getAggregations
} from '../../reducers/app/selectors';
import { getItemByPrimaryKey, submitQuery } from '../../reducers/app/thunks';
import { setSortAction } from '../../reducers/app/actions';
import CustomTableRow from '../../components/CustomTableRow';
import CustomTableHeader from '../../components/TableHeader';
import CustomPaginator from '../../components/CustomPaginator';
import EntityModal from '../../components/EntityModal';
import { Sort, Config, Aggregation } from '../../types';

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
  selectedConfig: Config;
  selectedEntity: string;
  selectedModalItem: object;
  attributes: any;
  isLoading: boolean;
  selectedSort: Sort;
  entities: EntityDefinition[];
  isModalUrl?: boolean;
  aggregations: Aggregation[];
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

  componentDidMount() {
    const { selectedEntity, isModalUrl, selectedColumns, items } = this.props;
    if(isModalUrl) {
      const uniqueAttribute = selectedColumns.find(attribute => attribute.keyType === 'UniqueKey');
      if (uniqueAttribute) {
        const uniqueValue = items[0][uniqueAttribute.name];
        this.onOpenModal(selectedEntity, uniqueAttribute.name, uniqueValue);
      }
    }
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
      selectedConfig,
      selectedColumns,
      rowsPerPage,
      selectedEntity,
      selectedModalItem,
      attributes,
      selectedSort,
      isLoading,
      entities,
      aggregations,
      onExportCsv
    } = this.props;
    const { page, referenceEntity, isOpenedModal} = this.state;
    const rowCount = rowsPerPage !== null ? rowsPerPage : 10;
    const realRows = items.slice(
      page * rowCount,
      page * rowCount + rowCount
    );
    const selectedObjectEntity = entities.find(entity => entity.name === referenceEntity);
    const { network, platform } = selectedConfig;
    return (
      <React.Fragment>
        <Overflow>
          <TableContainer>
            <CustomTableHeader
              rows={selectedColumns}
              aggregations={aggregations}
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
                    aggregations={aggregations}
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
  selectedConfig: getSelectedConfig(state),
  selectedColumns: getColumns(state),
  selectedEntity: getEntity(state),
  selectedModalItem: getModalItem(state),
  attributes: getAttributesAll(state),
  selectedSort: getSort(state),
  entities: getEntities(state),
  aggregations: getAggregations(state)
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
