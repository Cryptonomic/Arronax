# Arronax

[![Build Status](https://travis-ci.org/Cryptonomic/Arronax.svg?branch=master)](https://travis-ci.org/Cryptonomic/Arronax)
[![dependencies](https://david-dm.org/Cryptonomic/Arronax/status.svg)](https://david-dm.org/Cryptonomic/Arronax)

Blockchain data analytics tool built with [ConseilJS](https://github.com/Cryptonomic/ConseilJS), powered by the [Conseil](https://github.com/Cryptonomic/Conseil) API. Beta deployment is [live](https://arronax-beta.cryptonomic.tech/#/).

## Building

```bash
git clone https://github.com/Cryptonomic/Arronax.git
cd Arronax
npm i
#Read instructions for configuration
npm run start
```

### Configuration Instructions

`config.tsx` is expected to be found in `/src`. It defines one or more Conseil end-points and data sources within. `initialState` inside `/src/reducers/app/reducers.ts` will reference the default connection to create once the application loads. The most basic config file will look like the following

```typescript
import { Config } from './types';

const configs: Config[] = [
  {
    platform: '', // eg tezos:
    network: '', // eg alphanet
    displayName: '', // eg Tezos Alphanet
    url: 'conseil.server',
    apiKey: 'SomeSecret'
  }
]

export default configs;
```

`platform` and `network` in that file become URL parameters that ConseilJS uses.

### Other Build Targets

Start the local server without forcing open a browser.
`yarn start:q`

Package (webpack) for distribution. Fully contained artifacts will appear in `/build` once this process is complete.
`yarn build`