import { Config } from './types';

const configs: Config[] = [
    {
        platform: 'tezos',
        network: 'mainnet',
        displayName: 'Mainnet',
        url: 'https://conseil-prod.cryptonomic-infra.tech:443',
        apiKey: 'galleon',
        entities: ['blocks', 'operations', 'accounts', 'delegates']
    }, {
        platform: 'tezos',
        network: 'babylonnet',
        displayName: 'Babylonnet',
        url: 'https://conseil-dev.cryptonomic-infra.tech:443',
        apiKey: 'hooman',
        entities: ['blocks', 'operations', 'accounts', 'delegates']
    }, {
        platform: 'tezos',
        network: 'carthagenet',
        displayName: 'Carthagenet',
        url: 'https://conseil-staging2.cryptonomic-infra.tech:443',
        apiKey: 'galleon',
        entities: ['blocks', 'operations', 'accounts', 'delegates']
    }, {
        platform: 'tezos',
        network: 'staging',
        displayName: 'Staging Mainnet',
        url: 'https://conseil-staging.cryptonomic-infra.tech:443',
        apiKey: 'galleon',
        entities: ['blocks', 'operations', 'accounts', 'delegates']
    }
]

export default configs;
