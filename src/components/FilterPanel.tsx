import * as React from 'react';
import { ConseilFilter } from '../Conseil';
import '../style.css';

interface FilterPanelProps {
    filters: ConseilFilter;
    setFilter:  (filters: ConseilFilter) => void;
}

export class FilterPanel extends React.Component<FilterPanelProps, ConseilFilter> {

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