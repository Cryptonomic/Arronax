import { Config } from '../types';

const defaultConfig: Config[] = [{
    displayName: 'Missing Configuration',
    url: '',
    apiKey: '',
    network: '',
    platform: ''
}];

export const saveConfigs = (configs: Config[]) => {
    const localConfigs = configs.filter(config => config.isLocal);
    localStorage.setItem('configs', JSON.stringify(localConfigs));
}

export function getConfigs() {
    const localConfigs = getLocalConfigs();
    try {
        const configs = require('../config');
        return [...configs, ...localConfigs];
    } catch (err) {
        return (localConfigs.length > 0) ? localConfigs : defaultConfig;
    }
};

function getLocalConfigs() {
    const configs = localStorage.getItem('configs');
    return configs ? JSON.parse(configs) : [];
}