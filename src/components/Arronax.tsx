import * as React from 'react';
import { ArronaxState, FilterGroup } from '../types/types';

export interface ArronaxProps {
    state: ArronaxState;
    switchMode: () => void;
    switchTab:  () => void;
    setFilter:  (filters: FilterGroup) => void;
    resetAll:   () => void;
}

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

const FilterGroup = (props: FilterPanelProps) => {
    return (
        <div id="filtergroup">
            Blocks: <br/>
            <input type="text" id="filter.blocks" placeholder={props.filters.blockID.toString()} /> <br/>
            Operations: <br/>
            <input type="text" id="filter.operations" value={props.filters.operationID.toString()} /> <br/>
            Accounts: <br/>
            <input type="text" id="filter.accounts" value={props.filters.accountID.toString()} /> <br/>
            <button onClick={() => gatherFilters(props.setFilter)}>Click me!</button>
        </div>
    );
};

export const Arronax = (props: ArronaxProps) =>
    (
        <div id="arronax">
            <button onClick={props.switchMode}>I am in {props.state.mode} mode!</button>
            <FilterGroup filters={props.state.filters} setFilter={props.setFilter} />
        </div>
);
