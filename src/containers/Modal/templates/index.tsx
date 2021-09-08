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

    "tezos/granadanet/blocks": block,
    "tezos/granadanet/accounts": account,
    "tezos/granadanet/bakers": baker,
    "tezos/granadanet/contracts": contract,
    "tezos/granadanet/operations": operation,
    "tezos/granadanet/default": defaultTemplate
};

export default templates;
