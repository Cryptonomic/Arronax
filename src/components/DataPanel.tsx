import * as React from 'react';
import { TezosFilter } from 'conseiljs';
import { Tabs } from 'antd';
import BlockGrid from 'components/BlockGrid';
import OperationsGrid from 'components/OperationsGrid';
import AccountGrid from 'components/AccountGrid';

const TabPane = Tabs.TabPane;

interface DataPanelProps {
  filters: TezosFilter;
  network: string;
}

export const DataPanel = (props: DataPanelProps): JSX.Element => (
  <div className="card-container">
    <Tabs type="card">
      <TabPane tab="Blocks" key={'Blocks'}>
        <BlockGrid filters={props.filters} network={props.network} />
      </TabPane>
      <TabPane tab="Operations" key={'Operations'}>
        <OperationsGrid filters={props.filters} network={props.network} />
      </TabPane>
      <TabPane tab="Accounts" key={'Accounts'}>
        <AccountGrid filters={props.filters} network={props.network} />
      </TabPane>
    </Tabs>
  </div>
);

export default DataPanel;
