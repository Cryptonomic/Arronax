import * as React from 'react';
import { TezosFilter } from 'conseiljs';
import Snackbar from '@material-ui/core/Snackbar';
import { DataView } from '../types';
import { FilterPanel } from './FilterPanel';
import { DataPanel } from './DataPanel';
import { NetworkSelector } from './NetworkSelector';

export interface ArronaxProps {
    filters: TezosFilter;
    dataView: DataView;
    network: string;
    error: string;
    switchTab:  (dataView: DataView) => void;
    setFilter:  (filters: TezosFilter) => void;
    setNetwork: (network: string) => void;
    clearError: () => void;
}

export const Arronax = (props: ArronaxProps) =>
    (
        <div id="arronax">
            <h1>Arronax</h1>
            <NetworkSelector network={props.network} setNetwork={props.setNetwork}/>
            <FilterPanel filters={props.filters} setFilter={props.setFilter} />
            <DataPanel
                filters={props.filters}
                dataView={props.dataView}
                network={props.network}
                switchTab={props.switchTab}
            />
            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                open={!!props.error}
                onClose={props.clearError}
                ContentProps={{
                    'aria-describedby': 'message-id',
                }}
                message={<div id="message-id">{props.error}</div>}
            />
        </div>
);
