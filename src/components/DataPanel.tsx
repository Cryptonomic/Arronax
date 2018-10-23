import * as React from 'react';
import styled from 'styled-components';
import { TezosFilter } from 'conseiljs';
import { DataView } from '../types';
import { Tab } from './Tab';

interface DataPanelProps {
  filters: TezosFilter;
  dataView: DataView;
  network: string;
  switchTab: (dataView: DataView) => void;
}

const Wrapper = styled.div`
  float: right;
  font-size: xx-small;
  overflow-x: scroll;
  width: 80%;
`;

export const DataPanel = (props: DataPanelProps): JSX.Element => {
  return (
    <Wrapper>
      <div>
        <button onClick={() => props.switchTab(DataView.Blocks)}>Blocks</button>
        <button onClick={() => props.switchTab(DataView.Operations)}>
          Operations
        </button>
        <button onClick={() => props.switchTab(DataView.Accounts)}>
          Accounts
        </button>
      </div>
      <div>
        <Tab
          dataView={DataView.Blocks}
          hidden={props.dataView !== DataView.Blocks}
          filters={props.filters}
          network={props.network}
        />
        <Tab
          dataView={DataView.Operations}
          hidden={props.dataView !== DataView.Operations}
          filters={props.filters}
          network={props.network}
        />
        <Tab
          dataView={DataView.Accounts}
          hidden={props.dataView !== DataView.Accounts}
          filters={props.filters}
          network={props.network}
        />
      </div>
    </Wrapper>
  );
};
