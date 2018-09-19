type Config = {
  url: string;
  key: string;
};

const betanet: Config = {
  url: 'http://conseil-prod.cryptonomic-infra.tech/tezos/',
  key: 'hooman'
};

const zeronet: Config = {
  url: 'https://conseil-staging.cryptonomic-infra.tech/tezos/',
  key: 'hooman'
};

export default (process.env.NODE_ENV === 'betanet' ? betanet : zeronet);
