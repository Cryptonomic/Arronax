import * as React from 'react';
import { TezosConseilQuery, TezosFilter } from 'conseiljs';
import { connect, Dispatch } from 'react-redux';
import { DataView } from '../types';
import { ExpandableGrid } from './ExpandableGrid';
import config from '../config';
import * as actions from '../actions';

interface TabProps {
    dataView: DataView;
    hidden: boolean;
    filters: TezosFilter;
    network: string;
    setError:  (error: string) => actions.SetError;
}

interface TabState {
    data: Object[];
}

class Tab extends React.Component<TabProps, TabState> {

    constructor(props: TabProps) {
        super(props);
        this.state = {data: []};
        this.refreshData = this.refreshData.bind(this);
        this.refreshData(props);
    }

    async refreshData(nextProps: TabProps) {
        if (!nextProps.hidden) {
            const { getAccounts, getOperations, getBlocks } = TezosConseilQuery;
            let results;
            const apiKey = config.key;
            const url = `${config.url}${this.props.network}`;
            if (this.props.dataView === DataView.Operations) {
                results = await getOperations(url, nextProps.filters, apiKey)
                .catch( (error) => {
                    console.log('-debug: Error in: getOperations:');
                    console.error(error);
                    nextProps.setError(error.message);
                    return [];
                });
            } else if (this.props.dataView === DataView.Accounts) {
                results = await getAccounts(url, nextProps.filters, apiKey)
                .catch( (error) => {
                    console.log('-debug: Error in: status.getAccounts:');
                    console.error(error);
                    nextProps.setError(error.message);
                    return [];
                });
            } else {
                results = await getBlocks(url, nextProps.filters, apiKey)
                .catch( (error) => {
                    console.log('-debug: Error in: getBlocks:');
                    console.error(error);
                    nextProps.setError(error.message);
                    return [];
                });
            }
            this.setState({data: results});
            
        }
    }

    componentWillReceiveProps(nextProps: TabProps) {
        this.refreshData(nextProps);
    }

    public render() {
        return (
            <div id="blocksPanel" hidden={this.props.hidden}>
                <ExpandableGrid
                    dataView={this.props.dataView}
                    network={this.props.network}
                    data={this.state.data}
                />
            </div>
        );
    }
}

function mapDispatchToProps(dispatch: Dispatch<actions.ArronaxAction>) {
    return {
        setError:  (error: string) => dispatch(actions.setError(error)),
    };
}

export default connect(mapDispatchToProps)(Tab);