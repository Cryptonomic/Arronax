import * as React from 'react';
import { TezosFilter } from 'conseiljs';
import { Tabs } from 'antd';
import BlocksGrid from 'containers/Blocks';
import AccountsGrid from 'containers/Accounts';
import OperationsGrid from 'containers/Operations';
import { DataView } from '../types';

const TabPane = Tabs.TabPane;

interface DataPanelProps {
  filters: TezosFilter;
  network: string;
}

export const DataPanel = (props: DataPanelProps): JSX.Element => (
  <div className="card-container">
    <Tabs type="card">
      <TabPane tab="Blocks" key={DataView.Blocks}>
        <BlocksGrid filters={props.filters} network={props.network} />
      </TabPane>
      <TabPane tab="Operations" key={DataView.Operations}>
        <OperationsGrid filters={props.filters} network={props.network} />
      </TabPane>
      <TabPane tab="Accounts" key={DataView.Accounts}>
        <AccountsGrid filters={props.filters} network={props.network} />
      </TabPane>
    </Tabs>
  </div>
);
