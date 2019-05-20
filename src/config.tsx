import { Config } from './types';

const configs: Config[] = [
  {
    network: 'alphanet',
    displayName: 'Tezos Alphanet',
    url: 'https://conseil-dev.cryptonomic-infra.tech:443',
    apiKey: 'hooman'
  },
  {
    network: 'mainnet',
    displayName: 'Tezos Mainnet',
    url: 'https://conseil-prod.cryptonomic-infra.tech:443',
    apiKey: 'galleon'
  }
]

export default configs;
