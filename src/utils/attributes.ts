export const getLocalAttributes = () => {
  const attributes = localStorage.getItem('attributes');
  if (attributes) {
    return JSON.parse(attributes);
  }
  return { };
};

export const saveAttributes = (attributes, timestamp) => {
  localStorage.setItem('attributes', JSON.stringify(attributes));
  localStorage.setItem('timestamp', timestamp);
};


export const getTimeStampFromLocal = () => {
  const timestamp = localStorage.getItem('timestamp');
  if (timestamp) {
    return Number(timestamp);
  }
  return 0;
};
