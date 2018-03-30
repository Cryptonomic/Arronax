import * as React from 'react';
import { ConseilFilter } from '../Conseil';
import { ArronaxState, DataView } from '../types';
import { FilterPanel } from './FilterPanel';
import { DataPanel } from './DataPanel';

export interface ArronaxProps {
    state: ArronaxState;
    switchTab:  (dataView: DataView) => void;
    setFilter:  (filters: ConseilFilter) => void;
}

export const Arronax = (props: ArronaxProps) =>
    (
        <div id="arronax">
            <h1>Arronax</h1>
            <FilterPanel filters={props.state.filters} setFilter={props.setFilter} />
            <DataPanel filters={props.state.filters} dataView={props.state.dataView} switchTab={props.switchTab} />
        </div>
);
