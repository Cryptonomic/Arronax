# Arronax

[![Build Status](https://travis-ci.org/Cryptonomic/Arronax.svg?branch=master)](https://travis-ci.org/Cryptonomic/Arronax)
[![dependencies](https://david-dm.org/Cryptonomic/Arronax/status.svg)](https://david-dm.org/Cryptonomic/Arronax)

Blockchain data analytics tool built with [ConseilJS](https://github.com/Cryptonomic/ConseilJS), powered by the [Conseil](https://github.com/Cryptonomic/Conseil) API. Beta deployment is [live](https://arronax.io).

## Building

```bash
git clone https://github.com/Cryptonomic/Arronax.git
cd Arronax
npm install
#Read instructions for configuration
npm start
```

### Configuration Instructions

`config.tsx` is expected to be found in `/src`. It defines one or more Conseil end-points and data sources within. `initialState` inside `/src/reducers/app/reducers.ts` will reference the default connection to create once the application loads. The most basic config file will look like the following:

```typescript
import { Config } from './types';

const configs: Config[] = [
  {
    platform: '',
    network: '',
    displayName: '',
    url: 'conseil.server',
    apiKey: 'SomeSecret',
    nodeUrl: 'tezos.server',
    entities: ['blocks', 'operations', 'accounts', 'bakers', 'governance'],
    hiddenEntities: ['originated_account_maps', 'big_maps', 'big_map_contents']
  }
]

export default configs;
```

`platform` ('tezos') and `network` ('mainnet') in that file become URL parameters that ConseilJS uses. `displayName` is used in the UI network selector. `url` and `apiKey` are Conseil service parameters. Cryptonomic provides a turn-key Tezos infrastructure service – [nautilus.cloud](https://nautilus.cloud). Conseil and Tezos endpoints are provided by that service. `nodeUrl` is a Tezos RPC endpoint. `entities` and `hiddenEntities` provide priority sorting for entity display and hide entities from display respectively.

### Other Build Targets

Start the local server without forcing open a browser.
`npm run serve`

Package (webpack) for distribution. Fully contained artifacts will appear in `/build` once this process is complete.
`npm run build`

Package into docker

```bash
docker build -t arronaxcontainer .
docker run -d -p 3080:80 arronaxcontainer
```
