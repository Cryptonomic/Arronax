const modalRegistry = {
  "tezos/mainnet/operations": "operation_template",
  "tezos/alphanet/operations": "operation_template"
};

export function getEntityModalName(platform: string, network: string, entity: string) {
  const key = `${platform}/${network}/${entity}`;
  return modalRegistry[key] || 'default';
}
