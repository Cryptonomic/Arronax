import * as React from 'react';
import { ConseilFilter } from '../Conseil';
import { ArronaxState, DataView } from '../types';
import { FilterPanel } from './FilterPanel';
import { DataPanel } from './DataPanel';
import { NetworkSelector } from './NetworkSelector';

export interface ArronaxProps {
    state: ArronaxState;
    switchTab:  (dataView: DataView) => void;
    setFilter:  (filters: ConseilFilter) => void;
    setNetwork: (network: string) => void;
}

export const Arronax = (props: ArronaxProps) =>
    (
        <div id="arronax">
            <h1>Arronax</h1>
            <NetworkSelector network={props.state.network} setNetwork={props.setNetwork}/>
            <FilterPanel filters={props.state.filters} setFilter={props.setFilter} />
            <DataPanel
                filters={props.state.filters}
                dataView={props.state.dataView}
                network={props.state.network}
                switchTab={props.switchTab}
            />
        </div>
);
