type Config = {
  url: string;
  key: string;
  value: string;
  title: string;
};

 const configs: Config[] = [
  {
    value: 'alphanet',
    title: 'Tezos Alphanet',
    url: 'https://conseil-dev.cryptonomic-infra.tech:443',
    key: 'hooman',
  }
];

 export default configs;
