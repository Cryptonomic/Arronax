import account from './tezos/mainnet/account';
import bakerTemplate from './tezos/mainnet/baker';
import blockTemplate from './tezos/mainnet/block';
import contractTemplate from './tezos/mainnet/contract';
import operationTemplate from './tezos/mainnet/operation';
import blockOperationsTemplate from './tezos/mainnet/blockOperations';
import defautTemplate from './tezos/mainnet/default';

const templates: any = {
    "tezos/mainnet/blocks": blockTemplate,
    "tezos/mainnet/accounts": account,
    "tezos/mainnet/bakers": bakerTemplate,
    "tezos/mainnet/contracts": contractTemplate,
    "tezos/mainnet/operations": operationTemplate,
    "tezos/mainnet/block_operations": blockOperationsTemplate,
    "tezos/mainnet/default": defautTemplate,
    "tezos/carthagenet/blocks": blockTemplate,
    "tezos/carthagenet/accounts": account,
    "tezos/carthagenet/bakers": bakerTemplate,
    "tezos/carthagenet/contracts": contractTemplate,
    "tezos/carthagenet/operations": operationTemplate,
    "tezos/carthagenet/block_operations": blockOperationsTemplate,
    "tezos/carthagenet/default": defautTemplate,
};

export default templates;
