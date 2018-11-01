import React from 'react';
import moment from 'moment';
import { TezosConseilQuery, TezosFilter } from 'conseiljs';
import { ColumnProps } from 'antd/lib/table';
import Table from './Table';
import ExpandedRow from './ExpandedRow';
import { TezosOperation } from '../../types';
import config from '../../config';

interface Props {
  filters: TezosFilter;
  network: string;
}

interface State {
  data: TezosOperation[];
}

export default class BlockGrid extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { data: [] };
    this.refreshData(props);
  }

  refreshData = async (nextProps: Props) => {
    const { getOperations } = TezosConseilQuery;
    const apiKey = config.key;
    const url = `${config.url}${this.props.network}`;
    const results = await getOperations(url, nextProps.filters, apiKey);
    this.setState({ data: results });
  }

  componentWillReceiveProps(nextProps: Props) {
    this.refreshData(nextProps);
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
        dataSource={this.state.data}
      />
    );
  }
}
