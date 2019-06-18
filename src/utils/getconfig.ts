import { Config } from '../types';
const dumbConfigs: Config[] = [
  {
    displayName: 'Missing Configuration',
    url: '',
    apiKey: '',
    network: '',
    platform: ''
  },
];

export function getConfigs() {
  try {
    const configs = require('../config');
    return configs;
  } catch (err) {
    return dumbConfigs;
  }
};
