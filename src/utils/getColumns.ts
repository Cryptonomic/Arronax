const getColumns = (category: string) => {
  switch (category) {
    case 'displayOptions':
      return [
        { title: 'Level', dataIndex: 'level', key: 'level' },
        { title: 'Time', dataIndex: 'timestamp', key: 'timestamp' },
        { title: 'Operations', dataIndex: 'operations', key: 'operations' },
        { title: 'Fees', dataIndex: 'fees', key: 'fees' },
        { title: 'Amount', dataIndex: 'amount', key: 'amount' },
        { title: 'Baker', dataIndex: 'baker', key: 'baker' },
        { title: 'Hash', dataIndex: 'hash', key: 'hash' },
        { title: 'Protocol Number', dataIndex: 'protocol', key: 'protocol' },
        { title: 'Chain ID', dataIndex: 'chain', key: 'chain' },
        { title: 'Fitness', dataIndex: 'fitness', key: 'fitness' },
      ];
    case 'blocks':
      return [
        { title: 'Level', dataIndex: 'level', key: 'level' },
        { title: 'Block hash', dataIndex: 'hash', key: 'blockHash' },
        { title: 'Timestamp', dataIndex: 'timestamp', key: 'timestamp' },
      ];
    case 'operations':
      return [
        { title: 'Block hash', dataIndex: 'blockHash', key: 'blockHash' },
        { title: 'Kind', dataIndex: 'kind', key: 'kind' },
        { title: 'Source', dataIndex: 'source', key: 'source' },
        { title: 'Destination', dataIndex: 'destination', key: 'destination' },
        { title: 'Balance', dataIndex: 'balance', key: 'balance' },
        { title: 'Timestamp', dataIndex: 'timestamp', key: 'timestamp' },
      ];
    case 'accounts':
      return [
        { title: 'Account ID', dataIndex: 'accountId', key: 'accountId' },
        { title: 'Manager', dataIndex: 'manager', key: 'manager' },
        { title: 'Block level', dataIndex: 'blockLevel', key: 'blockLevel' },
        { title: 'Balance', dataIndex: 'balance', key: 'balance' },
      ];
  }
};

export default getColumns;
