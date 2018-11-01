import * as React from 'react';
import { TezosFilter } from 'conseiljs';
import { Layout } from 'antd';
import { FilterPanel } from './FilterPanel';
import { DataPanel } from './DataPanel';
import { NetworkSelector } from './NetworkSelector';
/* tslint:disable no-import-side-effect */
import '../App.css';

const { Content, Sider } = Layout;

export interface ArronaxProps {
  filters: TezosFilter;
  network: string;
  setFilter(filters: TezosFilter): void;
  setNetwork(network: string): void;
}

export default (props): JSX.Element => (
  <Layout style={{ height: '100vh' }}>
    {/* <Header>Arronax</Header> */}
    <Sider>
      <NetworkSelector network={props.network} setNetwork={props.setNetwork} />
      <FilterPanel filters={props.filters} setFilter={props.setFilter} />
    </Sider>
    <Content style={{ padding: '50px' }}>
      <DataPanel
        filters={props.filters}
        network={props.network}
      />
    </Content>
  </Layout>
);
