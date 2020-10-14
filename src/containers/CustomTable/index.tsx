import React, { createRef } from 'react';
import { connect } from 'react-redux';
import TableBody from '@material-ui/core/TableBody';
import { ConseilSortDirection } from 'conseiljs';
import { getSelectedConfig, getColumns, getEntity, getSort, getAggregations } from '../../reducers/app/selectors';
import { submitQuery } from '../../reducers/app/thunks';
import { setSortAction } from '../../reducers/app/actions';
import CustomTableRow from '../../components/CustomTableRow';
import CustomTableHeader from '../../components/TableHeader';
import { TableContainer, Overflow } from './styles';

import { Sort } from '../../types';
import { Props, State } from './types';

class CustomTable extends React.Component<Props, State> {
    EntityModal: any = null;
    tableEl: React.RefObject<any>;
    rootEl: null | Element;
    tableAnchor = 0;
    constructor(props: Props) {
        super(props);
        this.state = {
            tableDetails: null,
        };
        this.tableEl = createRef();
        this.rootEl = null;
    }

    componentDidMount() {
        window.addEventListener('scroll', this.syncScroll, true);
        this.rootEl = document.getElementById('root');
        this.setState({
            tableDetails: this.tableEl.current.getBoundingClientRect(),
        });
        this.tableAnchor = this.tableEl.current.offsetTop;
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.syncScroll);
        this.rootEl = null;
    }

    syncScroll = (e: any) => {
        if (!this.tableEl.current) { return; }
        if (!this.rootEl) { console.log('null root'); return;}

        if (window.scrollY > this.tableAnchor && window.scrollY < this.tableEl.current.scrollHeight) { // scrolling inside
          this.tableEl.current.scrollTop = window.scrollY - this.tableAnchor
        } else if (window.scrollY < this.tableAnchor) { // scrolling above
            this.tableEl.current.scrollTop = 0;
        } else if (window.scrollY > this.tableEl.current.scrollHeight + this.tableAnchor) { // scrolling below
            this.tableEl.current.scrollTop = this.tableEl.current.scrollHeight - this.tableAnchor - window.scrollY
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

    render() {
        const { items, selectedConfig, selectedColumns, selectedEntity, selectedSort, aggregations, onClickPrimaryKey } = this.props;

        const { network, platform } = selectedConfig;
        const { tableDetails } = this.state;
        return (
            <React.Fragment>
                <Overflow
                    ref={this.tableEl}
                    style={{
                        position: tableDetails ? 'sticky' : 'relative',
                        maxHeight: tableDetails ? tableDetails.height : '',
                        height: tableDetails ? '100vh' : '',
                    }}
                >
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
                                        onClickPrimaryKey={onClickPrimaryKey}
                                    />
                                );
                            })}
                        </TableBody>
                    </TableContainer>
                </Overflow>
                <div
                    style={{
                        width: tableDetails ? tableDetails.width : '100%',
                        height: tableDetails ? tableDetails.height : '100%',
                        backgroundColor: 'transparent',
                    }}
                ></div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state: any) => ({
    selectedConfig: getSelectedConfig(state),
    selectedColumns: getColumns(state),
    selectedEntity: getEntity(state),
    selectedSort: getSort(state),
    aggregations: getAggregations(state),
});

const mapDispatchToProps = (dispatch: any) => ({
    onSubmitQuery: () => dispatch(submitQuery()),
    onSetSort: (entity: string, sorts: Sort[]) => dispatch(setSortAction(entity, sorts)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CustomTable);
