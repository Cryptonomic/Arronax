import * as React from 'react';
import { ArronaxState, FilterGroup, DataView } from '../types/types';

export interface FilterPanelProps {
    filters: FilterGroup;
    setFilter:  (filters: FilterGroup) => void;
}

function gatherFilters(setFilter:  (filters: FilterGroup) => void) {
    setFilter( {
        blockID:        (document.getElementById('filter.blocks')       as HTMLInputElement).value,
        accountID:      (document.getElementById('filter.accounts')     as HTMLInputElement).value,
        operationID:    (document.getElementById('filter.operations')   as HTMLInputElement).value,
    });
}

const FilterPanel = (props: FilterPanelProps) => {
    return (
        <div id="filtergroup">
            Blocks: <br/>
            <input type="text" id="filter.blocks" placeholder={props.filters.blockID.toString()} /> <br/>
            Operations: <br/>
            <input type="text" id="filter.operations" placeholder={props.filters.operationID.toString()} /> <br/>
            Accounts: <br/>
            <input type="text" id="filter.accounts" placeholder={props.filters.accountID.toString()} /> <br/>
            <button onClick={() => gatherFilters(props.setFilter)}>Refresh</button>
        </div>
    );
};

export interface TabPops {
    dataView: DataView;
    hidden: boolean;
    filters: FilterGroup;
}

const Tab = (props: TabPops) => {
    return(
        <div id="blocksPanel" hidden={props.hidden}>
            <p>{props.dataView}</p>
        </div>
    );
};

export interface DataPanelProps {
    filters: FilterGroup;
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
    setFilter:  (filters: FilterGroup) => void;
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
