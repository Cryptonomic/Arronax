import { Config } from './types';

const configs: Config[] = [
  {
    platform: 'tezos',
    network: 'alphanet',
    displayName: 'Tezos Alphanet',
    url: 'https://host.com',
    apiKey: 'key'
  },
  {
    platform: 'tezos',
    network: 'mainnet',
    displayName: 'Tezos Mainnet',
    url: 'https://host.com',
    apiKey: 'key'
  }
]

export default configs;
