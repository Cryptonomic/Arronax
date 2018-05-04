import * as React from 'react';
import * as Conseil from '../Conseil';
import { ConseilFilter } from '../Conseil';
import { DataView } from '../types';
import { ExpandableGrid } from './ExpandableGrid';

interface TabProps {
    dataView: DataView;
    hidden: boolean;
    filters: ConseilFilter;
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

    refreshData(nextProps: TabProps) {
        if (!nextProps.hidden) {
            let funcToCall = Conseil.getBlocks;
            if (this.props.dataView === DataView.Operations) {funcToCall = Conseil.getOperations; }
            if (this.props.dataView === DataView.Accounts) {funcToCall = Conseil.getAccounts; }
            funcToCall.apply(null, [this.props.network, nextProps.filters]).
            then((val) => this.setState({data: JSON.parse(decodeURI(val))}));
        }
    }

    componentWillReceiveProps(nextProps: TabProps) {
        this.refreshData(nextProps);
    }

    public render() {
        return (
            <div id="blocksPanel" hidden={this.props.hidden}>
                <ExpandableGrid dataView={this.props.dataView} data={this.state.data}/>
            </div>
        );
    }
}