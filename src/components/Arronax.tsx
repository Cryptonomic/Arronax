import * as React from 'react';
import { TezosFilter } from 'conseiljs';
import { DataView } from '../types';
import { FilterPanel } from './FilterPanel';
import { DataPanel } from './DataPanel';
import { NetworkSelector } from './NetworkSelector';

export interface ArronaxProps {
  filters: TezosFilter;
  dataView: DataView;
  network: string;
  switchTab(dataView: DataView): void;
  setFilter(filters: TezosFilter): void;
  setNetwork(network: string): void;
}

export const Arronax = (props: ArronaxProps) => (
  <div id="arronax">
    <h1>Arronax</h1>
    <NetworkSelector network={props.network} setNetwork={props.setNetwork} />
    <FilterPanel filters={props.filters} setFilter={props.setFilter} />
    <DataPanel
      filters={props.filters}
      dataView={props.dataView}
      network={props.network}
      switchTab={props.switchTab}
    />
  </div>
);
