import * as React from 'react';
import * as Conseil from '../Conseil';
import { ConseilFilter } from '../Conseil';
import { ArronaxState, DataView } from '../types/types';
import * as JsonToTable from 'ts-react-json-table';

export interface FilterPanelProps {
    filters: ConseilFilter;
    setFilter:  (filters: ConseilFilter) => void;
}

class FilterPanel extends React.Component<FilterPanelProps, ConseilFilter> {

    constructor(props: FilterPanelProps) {
        super(props);
        this.state = props.filters;
        this.handleBlockIDs = this.handleBlockIDs.bind(this);
        this.handleLevels = this.handleLevels.bind(this);
        this.handleNetIDs = this.handleNetIDs.bind(this);
        this.handleProtocols = this.handleProtocols.bind(this);
        this.handleOperationIDs = this.handleOperationIDs.bind(this);
        this.handleAccountIDs = this.handleAccountIDs.bind(this);
        this.handleAccountManagers = this.handleAccountManagers.bind(this);
        this.handleAccountDelegates = this.handleAccountDelegates.bind(this);
        this.handleLimit = this.handleLimit.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleBlockIDs(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({'block_id': event.target.value.split(',')});
    }

    handleLevels(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({'block_level': event.target.value.split(',').map(Number)});
    }

    handleNetIDs(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({'block_netid': event.target.value.split(',')});
    }

    handleProtocols(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({'block_protocol': event.target.value.split(',')});
    }

    handleOperationIDs(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({'operation_id': event.target.value.split(',')});
    }

    handleOperationSources(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({'operation_source': event.target.value.split(',')});
    }

    handleAccountIDs(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({'account_id': event.target.value.split(',')});
    }

    handleAccountManagers(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({'account_manager': event.target.value.split(',')});
    }

    handleAccountDelegates(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({'account_delegate': event.target.value.split(',')});
    }

    handleLimit(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({'limit': Number(event.target.value)});
    }

    handleSubmit(event: React.MouseEvent<HTMLButtonElement>) {
        this.props.setFilter(this.state);
    }

    public render() {
        return (
            <div id="filtergroup">
                Blocks IDs: <br/>
                <input
                    type="text"
                    id="blocksIDs"
                    value={this.state.block_id.toString()}
                    onChange={this.handleBlockIDs}
                /> <br/>
                Block Levels: <br/>
                <input
                    type="text"
                    id="levels"
                    value={this.state.block_level.toString()}
                    onChange={this.handleLevels}
                /> <br/>
                Net IDs: <br/>
                <input
                    type="text"
                    id="netIDs"
                    value={this.state.block_netid.toString()}
                    onChange={this.handleNetIDs}
                /> <br/>
                Protocols: <br/>
                <input
                    type="text"
                    id="protocols"
                    value={this.state.block_protocol.toString()}
                    onChange={this.handleProtocols}
                /> <br/>
                Operation IDs: <br/>
                <input
                    type="text"
                    id="operationIDs"
                    value={this.state.operation_id.toString()}
                    onChange={this.handleOperationIDs}
                /> <br/>
                Operation Sources: <br/>
                <input
                    type="text"
                    id="operationSources"
                    value={this.state.operation_source.toString()}
                    onChange={this.handleOperationSources}
                /> <br/>
                Account IDs: <br/>
                <input
                    type="text"
                    id="accounts"
                    value={this.state.account_id.toString()}
                    onChange={this.handleAccountIDs}
                /> <br/>
                Account Managers: <br/>
                <input
                    type="text"
                    id="blocks"
                    value={this.state.account_manager.toString()}
                    onChange={this.handleAccountManagers}
                /> <br/>
                Account Delegates: <br/>
                <input
                    type="text"
                    id="accountDelegates"
                    value={this.state.account_delegate.toString()}
                    onChange={this.handleAccountDelegates}
                /> <br/>
                Limit: <br/>
                <input
                    type="text"
                    id="limit"
                    value={this.state.limit.toString()}
                    onChange={this.handleLimit}
                /> <br/>
                <button onClick={this.handleSubmit}>Refresh</button>
            </div>
        );
    }
}

export interface TabProps {
    dataView: DataView;
    hidden: boolean;
    filters: ConseilFilter;
}

interface TabState {
    data: Object;
}

class Tab extends React.Component<TabProps, TabState> {

    constructor(props: TabProps) {
        super(props);
        this.state = {data: [{'hello': 'world'}]};
        this.refreshData = this.refreshData.bind(this);
        this.refreshData(props);
    }

    refreshData(nextProps: TabProps) {
        if (!nextProps.hidden) {
            Conseil.getBlocks('alphanet', nextProps.filters).
            then((val) => this.setState({data: JSON.parse(decodeURI(val))}));
        }
    }

    componentWillReceiveProps(nextProps: TabProps) {
        this.refreshData(nextProps);
    }

    public render() {
        return (
            <div id="blocksPanel" hidden={this.props.hidden}>
                <p>{this.props.dataView}</p>
                <JsonToTable rows={this.state.data} />
            </div>
        );
    }
}

export interface DataPanelProps {
    filters: ConseilFilter;
    dataView: DataView;
    switchTab:  (dataView: DataView) => void;
}

const DataPanel = (props: DataPanelProps) => {
    return(
        <div id="data">
            <div id="data_tabs">
                <button onClick={() => props.switchTab(DataView.Blocks)}>Blocks</button>
                <button onClick={() => props.switchTab(DataView.Operations)}>Operations</button>
                <button onClick={() => props.switchTab(DataView.Accounts)}>Accounts</button>
            </div>
            <div id="data_content">
                <Tab
                    dataView={DataView.Blocks}
                    hidden={props.dataView !== DataView.Blocks}
                    filters={props.filters}
                />
                <Tab
                    dataView={DataView.Operations}
                    hidden={props.dataView !== DataView.Operations}
                    filters={props.filters}
                />
                <Tab
                    dataView={DataView.Accounts}
                    hidden={props.dataView !== DataView.Accounts}
                    filters={props.filters}
                />
            </div>
        </div>
    );
};

export interface ArronaxProps {
    state: ArronaxState;
    switchMode: () => void;
    switchTab:  (dataView: DataView) => void;
    setFilter:  (filters: ConseilFilter) => void;
    resetAll:   () => void;
}

export const Arronax = (props: ArronaxProps) =>
    (
        <div id="arronax">
            <h1>Arronax</h1>
            <FilterPanel filters={props.state.filters} setFilter={props.setFilter} />
            <DataPanel filters={props.state.filters} dataView={props.state.dataView} switchTab={props.switchTab} />
        </div>
);
