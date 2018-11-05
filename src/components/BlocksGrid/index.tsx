import React from 'react';
import moment from 'moment';
import { ColumnProps } from 'antd/lib/table';
import { TezosFilter } from 'conseiljs';
import { TezosBlock } from 'types';
import Table from './Table';
import ExpandedRow from './ExpandedRow';

interface Props {
  blocks: TezosBlock[];
  fetching: boolean;
  error: string;
  fetchBlocks: () => void;
  filters: TezosFilter;
}

export default class BlockGrid extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.props.fetchBlocks();
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.filters !== this.props.filters) {
      this.props.fetchBlocks();
    }
  }

  getColumns = (): Array<ColumnProps<TezosBlock>> => [
    { title: 'Block hash', dataIndex: 'hash', key: 'blockHash' },
    { title: 'Level', dataIndex: 'level', key: 'level' },
    {
      title: 'Numer of operations',
      dataIndex: '',
      key: 'numberOfOperations',
      render: () => 'n/a'
    },
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: value => {
        return moment(value).format('dd MM YYYY h:mm:ss a');
      }
    }
  ]

  render() {
    const { blocks, fetching, error } = this.props;
    let blocksView = <p>{error}</p>;
    if (!error) {
      blocksView = (
        <Table
          pagination={{
              pageSize: 15,
              simple: true
          }}
          rowClassName={() => 'block-grid'}
          rowKey="hash"
          columns={this.getColumns()}
          expandedRowRender={(record: TezosBlock) => (
              <ExpandedRow record={record} />
          )}
          dataSource={blocks}
          loading={fetching}
        />
      );
    }
    return (blocksView);
  }
}
