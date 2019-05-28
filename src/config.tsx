import { Config } from './types';

const configs: Config[] = [
  {
    platform: 'tezos',
    network: 'alphanet',
    displayName: 'Tezos Alphanet',
    url: 'https://conseil-dev.cryptonomic-infra.tech:443',
    apiKey: 'hooman'
  },
  {
    platform: 'tezos',
    network: 'mainnet',
    displayName: 'Tezos Mainnet',
    url: 'https://conseil-prod2.cryptonomic-infra.tech:443',
    apiKey: 'galleon'
  }
]

export default configs;