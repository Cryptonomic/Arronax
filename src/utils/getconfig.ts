import { Config } from '../types';
const dumbConfigs: Config[] = [
  {
    displayName: 'Missing Configuration',
    url: '',
    apiKey: '',
    network: ''
  },
];

const getConfigs = () => {
  try {
    const configs = require('../config');
    return configs.default;
  } catch (err) {
    return dumbConfigs;
  }
};

export default getConfigs;
