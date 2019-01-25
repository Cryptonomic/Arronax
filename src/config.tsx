type Config = {
  url: string;
  key: string;
  value: string;
  title: string;
};

const configs: Config[] = [
  {
    value: 'zeronet',
    title: 'Tezos Zeronet',
    url: 'https://conseil-staging2.cryptonomic-infra.tech/tezos/',
    key: 'hooman'
  },
  {
    value: 'mainnet',
    title: 'Tezos Mainnet',
    url: 'https://tezos-prod.cryptonomic-infra.tech/tezos/',
    key: 'galleon'
  }
]

export default configs;
