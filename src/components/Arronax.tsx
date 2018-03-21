import * as React from 'react';
import * as Conseil from '../Conseil';
import { ConseilFilter } from '../Conseil';
import { ArronaxState, DataView } from '../types/types';

export interface FilterPanelProps {
    filters: ConseilFilter;
    setFilter:  (filters: ConseilFilter) => void;
}

function gatherFilters(setFilter:  (filters: ConseilFilter) => void) {
    setFilter( {
        blockIDs: (document.getElementById('filter.blockIDs') as HTMLInputElement).value.split(','),
        levels: (document.getElementById('filter.levels') as HTMLInputElement).value.split(',').map(Number),
        netIDs: (document.getElementById('filter.netIDs') as HTMLInputElement).value.split(','),
        protocols: (document.getElementById('filter.protocols') as HTMLInputElement).value.split(','),
        operationIDs: (document.getElementById('filter.operationIDs') as HTMLInputElement).value.split(','),
        operationSources: (document.getElementById('filter.operationSources') as HTMLInputElement).value.split(','),
        accountIDs: (document.getElementById('filter.accountIDs') as HTMLInputElement).value.split(','),
        accountManagers: (document.getElementById('filter.accountManagers') as HTMLInputElement).value.split(','),
        accountDelegates: (document.getElementById('filter.accountDelegates') as HTMLInputElement).value.split(','),
        limit: Number((document.getElementById('filter.limit') as HTMLInputElement).value),
    });
}

const FilterPanel = (props: FilterPanelProps) => {
    return (
        <div id="filtergroup">
            Blocks IDs: <br/>
            <input type="text" id="filter.blocksIDs" placeholder={props.filters.blockIDs.toString()} /> <br/>
            Block Levels: <br/>
            <input type="text" id="filter.levels" placeholder={props.filters.levels.toString()} /> <br/>
            Net IDs: <br/>
            <input type="text" id="filter.netIDs" placeholder={props.filters.netIDs.toString()} /> <br/>
            Protocols: <br/>
            <input type="text" id="filter.protocols" placeholder={props.filters.protocols.toString()} /> <br/>
            Operation IDs: <br/>
            <input type="text" id="filter.operationIDs" placeholder={props.filters.operationIDs.toString()} /> <br/>
            Operation Sources: <br/>
            <input type="text" id="filter.blocks" placeholder={props.filters.operationSources.toString()} /> <br/>
            Account IDs: <br/>
            <input type="text" id="filter.accounts" placeholder={props.filters.accountIDs.toString()} /> <br/>
            Account Managers: <br/>
            <input type="text" id="filter.blocks" placeholder={props.filters.accountManagers.toString()} /> <br/>
            Account Delegates: <br/>
            <input type="text" id="filter.blocks" placeholder={props.filters.accountDelegates.toString()} /> <br/>
            Limit: <br/>
            <input type="text" id="filter.blocks" placeholder={props.filters.limit.toString()} /> <br/>
            <button onClick={() => gatherFilters(props.setFilter)}>Refresh</button>

        </div>
    );
};

export interface TabPops {
    dataView: DataView;
    hidden: boolean;
    filters: ConseilFilter;
}

const Tab = (props: TabPops) => {
    Conseil.getBlockHead('alphanet').then((val) => document.getElementById('poop').innerText = val);
    return(
        <div id="blocksPanel" hidden={props.hidden}>
            <p>{props.dataView}</p>
        </div>
    );
};

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
            <p id="poop" />
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
            <h1>Conseil Test</h1>
            <FilterPanel filters={props.state.filters} setFilter={props.setFilter} />
            <DataPanel filters={props.state.filters} dataView={props.state.dataView} switchTab={props.switchTab} />
        </div>
);
