import accountTemplate from './account';
import bakerTemplate from './baker';
import blockTemplate from './block';
import contractTemplate from './contract';
import operationTemplate from './operation';
import blockOperationsTemplate from './blockOperations';
import defautTemplate from './default';

const templates: any = {
    tezos: {
        mainnet: {
            accountTemplate,
            bakerTemplate,
            blockTemplate,
            contractTemplate,
            operationTemplate,
            blockOperationsTemplate,
            defautTemplate,
        },
        carthagenet: {
            accountTemplate,
            bakerTemplate,
            blockTemplate,
            contractTemplate,
            operationTemplate,
            blockOperationsTemplate,
            defautTemplate,
        },
    },
};

export default templates;
