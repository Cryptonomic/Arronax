import React from 'react';
import { connect } from 'react-redux';
import TableBody from '@material-ui/core/TableBody';
import { ConseilSortDirection } from 'conseiljs';
import ReactDynamicImport from 'react-dynamic-import';
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
import { getEntityModalName } from '../../utils/hashtable';
import {
  TableContainer,
  Overflow
} from './styles';

import { Sort } from '../../types';
import { Props, State } from './types';

const entityloader = (f: any) => import(`../Entities/${f}`);

class CustomTable extends React.Component<Props, State> {
  EntityModal: any = null;
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

  onCloseModal = () => {
    const { updateRoute } = this.props;
    this.setState({isOpenedModal: false});
    updateRoute(true);
  };

  onOpenModal = (entity: string, key: string, value: string | number) => {
    const { selectedPrimaryKey, selectedPrimaryValue } = this.state;
    const { getModalItemAction, selectedConfig, updateRoute } = this.props;
    if (selectedPrimaryKey !== key || selectedPrimaryValue !== value) {
      const { platform, network } = selectedConfig;
      const modalName = getEntityModalName(platform, network, entity);
      this.EntityModal = ReactDynamicImport({ name: modalName, loader: entityloader });
      getModalItemAction(entity, key, value);
      this.setState({referenceEntity: entity, selectedPrimaryKey: key, selectedPrimaryValue: value, isOpenedModal: true});
      updateRoute(true, '', value);
    }
    this.setState({isOpenedModal: true});
  }

  render() {
    const { EntityModal } = this;
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
    const selectedObjectEntity: any = entities.find(entity => entity.name === referenceEntity);
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
        {isOpenedModal && 
          <EntityModal
            open={isOpenedModal}
            title={selectedObjectEntity.displayName}
            attributes={attributes[referenceEntity]}
            items={selectedModalItem}
            isLoading={isLoading}
            onClose={this.onCloseModal}
            onClickPrimaryKey={this.onOpenModal}
          />
        }
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
