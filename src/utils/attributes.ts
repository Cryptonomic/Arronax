

export const getLocalAttributes = () => {
  const attributes = localStorage.getItem('attributes');
  if (attributes) {
    return JSON.parse(attributes);
  }

  return {
    blocks: [],
    operations: [],
    accounts: [],
  };
}

export const saveAttributes = (attributes, blockHead) => {
  localStorage.setItem('attributes', JSON.stringify(attributes));
  localStorage.setItem('blockHead', blockHead);
}

export const getBlockHeadFromLocal = () => {
  const blockHead = localStorage.getItem('blockHead');
  if (blockHead) {
    return Number(blockHead);
  }

  return 0;
}