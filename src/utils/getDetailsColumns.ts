const getDetailsColumns = (category: string) => {
  switch (category) {
    case 'blocks':
      return [
        { title: 'Level', dataIndex: 'level', key: 'level' },
        { title: 'Time', dataIndex: 'time', key: 'time' },
        { title: 'Block Hash', dataIndex: 'blockhash', key: 'blockhash' },
        {
          title: 'Predecessor Hash',
          dataIndex: 'predecessor',
          key: 'predecessor',
        },
        {
          title: 'Operations Hash',
          dataIndex: 'operationsHash',
          key: 'operationsHash',
        },
        {
          title: 'Protocol Hash',
          dataIndex: 'protocolHash',
          key: 'protocolHash',
        },
        { title: 'Proto', dataIndex: 'protocol', key: 'protocol' },
        { title: 'Chain ID', dataIndex: 'chainid', key: 'chainid' },
        {
          title: 'Validation Pass',
          dataIndex: 'validationPass',
          key: 'validationPass',
        },
        { title: 'Fitness', dataIndex: 'fitness', key: 'fitness' },
        { title: 'Context', dataIndex: 'context', key: 'context' },
        { title: 'Signature', dataIndex: 'signature', key: 'signature' },
      ];
    case 'operations':
      return [
        { title: 'Kind', dataIndex: 'kind', key: 'kind' },
        { title: 'Amount', dataIndex: 'amount', key: 'amount' },
        { title: 'Source', dataIndex: 'source', key: 'source' },
        { title: 'Destination', dataIndex: 'destination', key: 'destination' },
        {
          title: 'Manager Pub Key',
          dataIndex: 'manager_pub_key',
          key: 'manager_pub_key',
        },
        { title: 'Delegate', dataIndex: 'delegate', key: 'delegate' },
        { title: 'Balance', dataIndex: 'balance', key: 'balance' },
        { title: 'Fee', dataIndex: 'fee', key: 'fee' },
        {
          title: 'Operation Group Hash',
          dataIndex: 'operationGroupHash',
          key: 'operationGroupHash',
        },
        { title: 'OperationId', dataIndex: 'operationId', key: 'operationId' },
        {
          title: 'Storage limit',
          dataIndex: 'storageLimit',
          key: 'storageLimit',
        },
        { title: 'Gas limit', dataIndex: 'gasLimit', key: 'gasLimit' },
        { title: 'Block hash', dataIndex: 'blockHash', key: 'blockHash' },
        { title: 'Block level', dataIndex: 'blockLevel', key: 'blockLevel' },
      ];
    case 'accounts':
      return [
        { title: 'Account ID', dataIndex: 'accountId', key: 'accountId' },
        { title: 'Block Id', dataIndex: 'blockId', key: 'blockId' },
        {
          title: 'Delegate setable',
          dataIndex: 'delegateSetable',
          key: 'delegateSetable',
          isIcon: true,
        },
        {
          title: 'Delegate value',
          dataIndex: 'delegateValue',
          key: 'delegateValue',
        },
        {
          title: 'Spendable',
          dataIndex: 'spendable',
          key: 'spendable',
          isIcon: true,
        },
        { title: 'Balance', dataIndex: 'balance', key: 'balance' },
        { title: 'Counter', dataIndex: 'counter', key: 'counter' },
        { title: 'Manager', dataIndex: 'manager', key: 'manager' },
      ];
  }
};

export default getDetailsColumns;
