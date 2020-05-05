import account from './tezos/mainnet/account';
import baker from './tezos/mainnet/baker';
import block from './tezos/mainnet/block';
import contract from './tezos/mainnet/contract';
import operation from './tezos/mainnet/operation';
import defaultTemplate from './tezos/mainnet/default';

const templates: any = {
    "tezos/mainnet/blocks": block,
    "tezos/mainnet/accounts": account,
    "tezos/mainnet/bakers": baker,
    "tezos/mainnet/contracts": contract,
    "tezos/mainnet/operations": operation,
    "tezos/mainnet/default": defaultTemplate,
    "tezos/carthagenet/blocks": block,
    "tezos/carthagenet/accounts": account,
    "tezos/carthagenet/bakers": baker,
    "tezos/carthagenet/contracts": contract,
    "tezos/carthagenet/operations": operation,
    "tezos/carthagenet/default": defaultTemplate,
};

export default templates;
