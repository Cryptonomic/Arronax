const getColumns = (category: string) => {
  switch (category) {
    case 'blocks':
      return [
        { title: 'Level', dataIndex: 'level', key: 'level' },
        { title: 'Timestamp', dataIndex: 'timestamp', key: 'timestamp' },
        { title: 'Block Hash', dataIndex: 'hash', key: 'blockHash' },
        // {
        //   title: 'Predecessor Hash',
        //   dataIndex: 'predecessor',
        //   key: 'predecessor',
        // },
        // {
        //   title: 'Operations Hash',
        //   dataIndex: 'operationsHash',
        //   key: 'operationsHash',
        // },
        // {
        //   title: 'Protocol Hash',
        //   dataIndex: 'protocol',
        //   key: 'protocol',
        // },
        // { title: 'Proto', dataIndex: 'proto', key: 'proto' },
        // { title: 'Chain ID', dataIndex: 'chainId', key: 'chainId' },
        // {
        //   title: 'Validation Pass',
        //   dataIndex: 'validationPass',
        //   key: 'validationPass',
        // },
        // { title: 'Fitness', dataIndex: 'fitness', key: 'fitness' },
        // { title: 'Context', dataIndex: 'context', key: 'context' },
        // { title: 'Signature', dataIndex: 'signature', key: 'signature' },
      ];
    case 'operations':
      return [
        { title: 'Kind', dataIndex: 'kind', key: 'kind' },
        { title: 'Source', dataIndex: 'source', key: 'source' },
        { title: 'Destination', dataIndex: 'destination', key: 'destination' },
        { title: 'Amount', dataIndex: 'amount', key: 'amount' },
        { title: 'Fee', dataIndex: 'fee', key: 'fee' },
        { title: 'Balance', dataIndex: 'balance', key: 'balance' },
        { title: 'Delegate', dataIndex: 'delegate', key: 'delegate' },
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
        {
          title: 'Timestamp',
          dataIndex: 'timestamp',
          key: 'timestamp',
        },
      ];
    case 'accounts':
      return [
        { title: 'Account ID', dataIndex: 'accountId', key: 'accountId' },
        { title: 'Manager', dataIndex: 'manager', key: 'manager' },
        {
          title: 'Spendable',
          dataIndex: 'spendable',
          key: 'spendable',
          isIcon: true,
        },
        {
          title: 'Delegatable',
          dataIndex: 'delegateSetable',
          key: 'delegateSetable',
          isIcon: true,
        },
        {
          title: 'Delegate',
          dataIndex: 'delegate',
          key: 'delegateValue',
        },
        { title: 'Counter', dataIndex: 'counter', key: 'counter' },
        { title: 'Script', dataIndex: 'script', key: 'script' },
        { title: 'Balance', dataIndex: 'balance', key: 'balance' },
        { title: 'Block level', dataIndex: 'blockLevel', key: 'blockLevel' },
        { title: 'Block ID', dataIndex: 'blockId', key: 'blockId' },
      ];
  }
};

export default getColumns;
