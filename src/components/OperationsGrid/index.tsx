import React from 'react';
import moment from 'moment';
import { ColumnProps } from 'antd/lib/table';
import { TezosFilter } from 'conseiljs';
import { TezosOperation } from 'types';
import ExpandedRow from './ExpandedRow';
import Table from './Table';

interface Props {
  filters: TezosFilter;
  operations: TezosOperation[];
  fetching: boolean;
  fetchOperations: () => void;
}

export default class BlockGrid extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.state = { data: [] };
    this.props.fetchOperations();
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.filters !== this.props.filters) {
      this.props.fetchOperations();
    }
  }

  getColumns = (): Array<ColumnProps<TezosOperation>> => ([
    { title: 'Block hash', dataIndex: 'blockHash', key: 'blockHash' },
    { title: 'Kind', dataIndex: 'kind', key: 'kind' },
    { title: 'Source', dataIndex: 'source', key: 'source' },
    { title: 'Destination', dataIndex: 'destination', key: 'destination' },
    { title: 'Balance', dataIndex: 'balance', key: 'balance' },
    { title: 'Timestamp', dataIndex: 'timestamp', key: 'timestamp', render: (value) =>  {
        return moment(value).format('dd MM YYYY h:mm:ss a');
      }
    }
  ])

  render() {
    const { operations, fetching } = this.props;
    return (
      <Table
        pagination={{
          pageSize: 15,
          simple: true
        }}
        rowClassName={() => 'block-grid'}
        rowKey="operationId"
        columns={this.getColumns()}
        expandedRowRender={(record: TezosOperation) => <ExpandedRow record={record} />}
        dataSource={operations}
        loading={fetching}
      />
    );
  }
}
