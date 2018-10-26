import React from 'react';
import moment from 'moment';
import { TezosConseilQuery, TezosFilter } from 'conseiljs';
import { ColumnProps } from 'antd/lib/table';
import Table from './Table';
import ExpandedRow from './ExpandedRow';
import { TezosBlock } from '../../types';
import config from '../../config';

interface Props {
  filters: TezosFilter;
  network: string;
}

interface State {
  data: TezosBlock[];
}

export default class BlockGrid extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { data: [] };
    this.refreshData(props);
  }

  refreshData = async (nextProps: Props) => {
    const { getBlocks } = TezosConseilQuery;
    const apiKey = config.key;
    const url = `${config.url}${this.props.network}`;
    const results: TezosBlock[] = await getBlocks(url, nextProps.filters, apiKey);
    this.setState({ data: results });
  }

  componentWillReceiveProps(nextProps: Props) {
    this.refreshData(nextProps);
  }

  getColumns = (): Array<ColumnProps<TezosBlock>> => ([
    { title: 'Block hash', dataIndex: 'hash', key: 'blockHash' },
    { title: 'Level', dataIndex: 'level', key: 'level' },
    { title: 'Numer of operations', dataIndex: '', key: 'numberOfOperations', render: () => 'n/a' },
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
        rowKey="hash"
        columns={this.getColumns()}
        expandedRowRender={(record: TezosBlock) => <ExpandedRow record={record} />}
        dataSource={this.state.data}
      />
    );
  }
}
