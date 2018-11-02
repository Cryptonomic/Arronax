import React from 'react';
import { TezosFilter } from 'conseiljs';
import { ColumnProps } from 'antd/lib/table';
import Table from './Table';
import ExpandedRow from './ExpandedRow';
import { TezosAccount } from '../../types';

interface Props {
  filters: TezosFilter;
  accounts: TezosAccount[];
  fetching: boolean;
  error: string;
  fetchAccounts: () => void;
}

export default class BlockGrid extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.props.fetchAccounts();
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.filters !== this.props.filters) {
      this.props.fetchAccounts();
    }
  }

  getColumns = (): Array<ColumnProps<TezosAccount>> => ([
    { title: 'Account ID', dataIndex: 'accountId', key: 'accountId' },
    { title: 'Manager', dataIndex: 'manager', key: 'manager' },
    { title: 'Block level', dataIndex: 'blockLevel', key: 'blockLevel' },
    { title: 'Balance', dataIndex: 'balance', key: 'balance' }
  ])

  render() {
    const { fetching, accounts, error } = this.props;
    let accountsView = <p>{error}</p>;
    if (!error) {
        accountsView = (
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
                dataSource={accounts}
                loading={fetching}
            />);
    }
    return (accountsView);
  }
}
