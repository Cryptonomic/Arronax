import * as React from 'react';
import { TezosFilter } from 'conseiljs';
import { Layout } from 'antd';
import { FilterPanel } from './FilterPanel/FilterPanel';
import { DataPanel } from './DataPanel';
/* tslint:disable no-import-side-effect */
import '../App.css';

const { Content, Sider } = Layout;

export interface ArronaxProps {
  filters: TezosFilter;
  network: string;
  setFilter(filters: TezosFilter, network: string): void;
}

export default (props: ArronaxProps): JSX.Element => (
  <Layout style={{ height: '100%' }}>
    {/* <Header>Arronax</Header> */}
    <Sider>
      <FilterPanel filters={props.filters} setFilter={props.setFilter} network={props.network} />
    </Sider>
    <Content style={{ padding: '50px' }}>
      <DataPanel
        filters={props.filters}
        network={props.network}
      />
    </Content>
  </Layout>
);
