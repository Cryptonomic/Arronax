const betanet = {
    url : 'http://conseil-prod.cryptonomic-infra.tech/tezos/',
    key: 'hooman'
};
  
const zeronet = {
    url : 'https://conseil-staging.cryptonomic-infra.tech/tezos/',
    key: 'hooman'
};
  
const config = process.env.NODE_ENV === 'betanet'
? betanet
: zeronet;

export default config;
