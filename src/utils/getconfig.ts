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

export const saveConfigs = (configs: Config[]) => {
  const localConfigs = configs.filter(config => config.isLocal);
  localStorage.setItem('configs', JSON.stringify(localConfigs));
}

export const getLocalConfigs = () => {
  const configs = localStorage.getItem('configs');
  if (configs) {
      return JSON.parse(configs);
  }
  return [];
};

export function getConfigs() {
  const localConfigs = getLocalConfigs();
  try {
    const configs = require('../config');
    return [...configs, ...localConfigs];
  } catch (err) {
    if (localConfigs.length > 0) {
      return localConfigs;
    }
    return dumbConfigs;
  }
};
