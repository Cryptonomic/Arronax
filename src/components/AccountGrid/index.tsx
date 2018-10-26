import React from 'react';
import { TezosConseilQuery, TezosFilter } from 'conseiljs';
import { ColumnProps } from 'antd/lib/table';
import Table from './Table';
import ExpandedRow from './ExpandedRow';
import { TezosAccount } from '../../types';
import config from '../../config';

interface Props {
  filters: TezosFilter;
  network: string;
}

interface State {
  data: TezosAccount[];
}

export default class BlockGrid extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { data: [] };
    this.refreshData(props);
  }

  refreshData = async (nextProps: Props) => {
    const { getAccounts } = TezosConseilQuery;
    const apiKey = config.key;
    const url = `${config.url}${this.props.network}`;
    const results = await getAccounts(url, nextProps.filters, apiKey);
    this.setState({ data: results });
  }

  componentWillReceiveProps(nextProps: Props) {
    this.refreshData(nextProps);
  }

  getColumns = (): Array<ColumnProps<TezosAccount>> => ([
    { title: 'Account ID', dataIndex: 'accountId', key: 'accountId' },
    { title: 'Manager', dataIndex: 'manager', key: 'manager' },
    { title: 'Block level', dataIndex: 'blockLevel', key: 'blockLevel' },
    { title: 'Balance', dataIndex: 'balance', key: 'balance' }
  ])

  render() {
    return (
      <Table
        pagination={{
          pageSize: 15,
          simple: true
        }}
        rowClassName={() => 'block-grid'}
        rowKey="accountId"
        columns={this.getColumns()}
        expandedRowRender={(record: TezosAccount) => (
          <ExpandedRow record={record} />
        )}
        dataSource={this.state.data}
      />
    );
  }
}
