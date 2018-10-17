import * as React from 'react';
import { TezosFilter } from 'conseiljs';
import { Tabs } from 'antd';
import { DataView } from '../types';
import BlockGrid from './BlockGrid';
import OperationsGrid from './OperationsGrid';
import AccountGrid from './AccountGrid';

const TabPane = Tabs.TabPane;

interface DataPanelProps {
  filters: TezosFilter;
  network: string;
}

export const DataPanel = (props: DataPanelProps): JSX.Element => (
  <div className="card-container">
    <Tabs type="card">
      <TabPane tab="Blocks" key={DataView.Blocks}>
        <BlockGrid filters={props.filters} network={props.network} />
      </TabPane>
      <TabPane tab="Operations" key={DataView.Operations}>
        <OperationsGrid filters={props.filters} network={props.network} />
      </TabPane>
      <TabPane tab="Accounts" key={DataView.Accounts}>
        <AccountGrid filters={props.filters} network={props.network} />
      </TabPane>
    </Tabs>
  </div>
);
