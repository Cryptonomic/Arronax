const getColumns = (category: string) => {
  switch(category) {
    case 'blocks':
      return [
        { title: 'Level', dataIndex: 'level', key: 'level' },
        { title: 'Block hash', dataIndex: 'hash', key: 'blockHash' },
        { title: 'Timestamp', dataIndex: 'timestamp', key: 'timestamp' }
      ];
    case 'operations':
      return [
        { title: 'Block hash', dataIndex: 'blockHash', key: 'blockHash' },
        { title: 'Kind', dataIndex: 'kind', key: 'kind' },
        { title: 'Source', dataIndex: 'source', key: 'source' },
        { title: 'Destination', dataIndex: 'destination', key: 'destination' },
        { title: 'Balance', dataIndex: 'balance', key: 'balance' },
        { title: 'Timestamp', dataIndex: 'timestamp', key: 'timestamp' }
      ];
    case 'accounts':
      return [
        { title: 'Account ID', dataIndex: 'accountId', key: 'accountId' },
        { title: 'Manager', dataIndex: 'manager', key: 'manager' },
        { title: 'Block level', dataIndex: 'blockLevel', key: 'blockLevel' },
        { title: 'Balance', dataIndex: 'balance', key: 'balance' }
      ];
  }
}

export default getColumns;
