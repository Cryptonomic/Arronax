const dumbConfigs = [
  {
    value: 'alphanet',
    title: '',
    url: '',
    key: '',
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
