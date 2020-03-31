import React, { createRef } from 'react';
import { connect } from 'react-redux';
import TableBody from '@material-ui/core/TableBody';
import { ConseilSortDirection } from 'conseiljs';
import ReactDynamicImport from 'react-dynamic-import';
import {
  getSelectedConfig,
  getColumns,
  getEntity,
  getAttributesAll,
  getModalItem,
  getModalSubItem,
  getSort,
  getEntities,
  getAggregations
} from '../../reducers/app/selectors';
import { getItemByPrimaryKey, submitQuery } from '../../reducers/app/thunks';
import { setSortAction } from '../../reducers/app/actions';
import CustomTableRow from '../../components/CustomTableRow';
import CustomTableHeader from '../../components/TableHeader';
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
  tableEl: React.RefObject<any>;
  rootEl: null | Element;
  constructor(props: Props) {
    super(props);
    this.state = {
      isOpenedModal: false,
      selectedPrimaryKey: '',
      selectedPrimaryValue: '',
      referenceEntity: props.selectedEntity,
      tableDetails: null
    };
    this.tableEl = createRef();
    this.rootEl = null;
  }

  componentDidMount() {
    window.addEventListener('scroll', this.syncScroll, true);
    this.rootEl = document.getElementById('root');
    const { selectedEntity, isModalUrl, selectedColumns, items } = this.props;
    if(isModalUrl) {
      const uniqueAttribute = selectedColumns.find(attribute => attribute.keyType === 'UniqueKey');
      if (uniqueAttribute) {
        const uniqueValue = items[0][uniqueAttribute.name];
        this.onOpenModal(selectedEntity, uniqueAttribute.name, uniqueValue);
      }
    }
    this.setState({
      tableDetails: this.tableEl.current.getBoundingClientRect()
    });
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.syncScroll);
    this.rootEl = null;
  }

  syncScroll = (e: any) => {
    if (!this.tableEl.current || e.target !== this.rootEl) { return; }

    if ((this.tableEl.current.getBoundingClientRect()).top === 0) {
      const tableOffset = this.tableEl.current.scrollHeight - this.tableEl.current.clientHeight;
      const bodyOffset = e.target.scrollHeight - e.target.clientHeight;
      this.tableEl.current.scrollTop = (tableOffset * e.target.scrollTop / bodyOffset);
      return;
    }
  }

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
      selectedEntity,
      selectedModalItem,
      selectedModalSubItem,
      attributes,
      selectedSort,
      isLoading,
      entities,
      aggregations,
    } = this.props;

    const { referenceEntity, isOpenedModal} = this.state;
    const selectedObjectEntity: any = entities.find(entity => entity.name === referenceEntity);
    const { network, platform } = selectedConfig;
    const { tableDetails } = this.state;
    return (
      <React.Fragment>
        <Overflow ref={this.tableEl} style={{ 
            position: tableDetails ? 'sticky' : 'relative', 
            maxHeight: tableDetails ? tableDetails.height : '',
            height: tableDetails ? '100vh' : ''
          }}>
          <TableContainer stickyHeader>
            <CustomTableHeader
              rows={selectedColumns}
              aggregations={aggregations}
              order={selectedSort.order}
              orderBy={selectedSort.orderBy}
              createSortHandler={this.handleRequestSort}
            />
            <TableBody>
              {items.map((row, index) => {
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
        <div style={{ 
          width: tableDetails ? tableDetails.width : '100%', 
          height: tableDetails ? tableDetails.height : '100%',
          backgroundColor: 'transparent' 
          }}></div>
        {isOpenedModal && 
          <EntityModal
            attributes={attributes[referenceEntity]}
            isLoading={isLoading}
            items={selectedModalItem}
            open={isOpenedModal}
            opsAttributes={attributes.operations}
            selectedConfig={selectedConfig}
            subItems={selectedModalSubItem}
            title={selectedObjectEntity.displayName}
            onClickPrimaryKey={this.onOpenModal}
            onClose={this.onCloseModal}
          />
        }
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state: any) => ({
  selectedConfig: getSelectedConfig(state),
  selectedColumns: getColumns(state),
  selectedEntity: getEntity(state),
  selectedModalItem: getModalItem(state),
  selectedModalSubItem: getModalSubItem(state),
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
