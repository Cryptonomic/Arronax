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
        blockID:        (document.getElementsByName('blocks').item(0) as HTMLInputElement).value,
        accountID:      document.getElementsByName('accounts').item(0).getAttribute('value'),
        operationID:    document.getElementsByName('operations').item(0).getAttribute('value'),
    });
}

const FilterGroup = (props: FilterPanelProps) => {
    return (
        <div id="filtergroup">
            <form onSubmit={() => gatherFilters(props.setFilter)}>
                Blocks: <br/>
                <input type="text" name="blocks" placeholder={props.filters.blockID.toString()} /> <br/>
                Operations: <br/>
                <input type="text" name="operations" value={props.filters.operationID.toString()} /> <br/>
                Accounts: <br/>
                <input type="text" name="accounts" value={props.filters.accountID.toString()} /> <br/>
                <input type="text" name="poopmeister" />
                <input type="submit" value="Submit" />
            </form>
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
