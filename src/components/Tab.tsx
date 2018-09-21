import * as React from 'react';
import { TezosConseilQuery, TezosFilter } from 'conseiljs';
import { DataView } from '../types';
import { ExpandableGrid } from './ExpandableGrid';
import config from '../config';

interface TabProps {
    dataView: DataView;
    filters: TezosFilter;
    network: string;
}

interface TabState {
    data: Object[];
}

export class Tab extends React.Component<TabProps, TabState> {

    constructor(props: TabProps) {
        super(props);
        this.state = {data: []};
        this.refreshData = this.refreshData.bind(this);
        this.refreshData(props);
    }

    async refreshData(nextProps: TabProps) {
        const { getAccounts, getOperations, getBlocks } = TezosConseilQuery;
        let results;
        const apiKey = config.key;
        const url = `${config.url}${this.props.network}`;
        if (this.props.dataView === DataView.Operations) {
            results = await getOperations(url, nextProps.filters, apiKey);
        } else if (this.props.dataView === DataView.Accounts) {
            results = await getAccounts(url, nextProps.filters, apiKey);
        } else {
            results = await getBlocks(url, nextProps.filters, apiKey);
        }
        this.setState({data: results});
    }

    componentDidUpdate(prevProps: TabProps, prevState: TabState) {
        if (prevProps.network !== this.props.network || prevProps.dataView !== this.props.dataView) {
            this.setState({data: []});
            this.refreshData(this.props);
        }
    }

    public render() {
        return (
            <div id="blocksPanel">
                <ExpandableGrid
                    dataView={this.props.dataView}
                    network={this.props.network}
                    data={this.state.data}
                />
            </div>
        );
    }
}