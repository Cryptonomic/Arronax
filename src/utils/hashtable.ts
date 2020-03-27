const modalRegistry: any = {
  'tezos/mainnet/operations': "operation_template",
  "tezos/carthagenet/operations": "operation_template",
  "tezos/mainnet/accounts": "account_template",
  "tezos/carthagenet/accounts": "account_template",
  "tezos/mainnet/blocks": "block_template",
  "tezos/carthagenet/blocks": "block_template"
};

export function getEntityModalName(platform: string, network: string, entity: string) {
  const key = `${platform}/${network}/${entity}`;
  return modalRegistry[key] || 'default';
}
