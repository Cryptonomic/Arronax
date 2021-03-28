import account from './tezos/mainnet/account';
import baker from './tezos/mainnet/baker';
import block from './tezos/mainnet/block';
import contract from './tezos/mainnet/contract';
import operation from './tezos/mainnet/operation';
import defaultTemplate from './tezos/mainnet/default';

const templates: any = {
    "ethereum/mainnet/default": defaultTemplate,

    "tezos/mainnet/blocks": block,
    "tezos/mainnet/accounts": account,
    "tezos/mainnet/bakers": baker,
    "tezos/mainnet/contracts": contract,
    "tezos/mainnet/operations": operation,
    "tezos/mainnet/default": defaultTemplate,

    "tezos/edonet/blocks": block,
    "tezos/edonet/accounts": account,
    "tezos/edonet/bakers": baker,
    "tezos/edonet/contracts": contract,
    "tezos/edonet/operations": operation,
    "tezos/edonet/default": defaultTemplate,

    "tezos/delphinet/blocks": block,
    "tezos/delphinet/accounts": account,
    "tezos/delphinet/bakers": baker,
    "tezos/delphinet/contracts": contract,
    "tezos/delphinet/operations": operation,
    "tezos/delphinet/default": defaultTemplate
};

export default templates;
