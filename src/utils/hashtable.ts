const modalRegistry = {
  'tezos/mainnet/operations': "operation_template",
  "tezos/babylonnet/operations": "operation_template",
  "tezos/mainnet/accounts": "account_template",
  "tezos/babylonnet/accounts": "account_template",
  //"tezos/mainnet/blocks": "block_template",
  //"tezos/babylonnet/blocks": "block_template"
};

export function getEntityModalName(platform: string, network: string, entity: string) {
  const key = `${platform}/${network}/${entity}`;
  return modalRegistry[key] || 'default';
}
