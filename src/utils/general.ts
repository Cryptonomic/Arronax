export const convertValue = (value) => {
  if (value) {
    return value.replace(/(^|_)./g, s =>
      s
        .split('_')
        .map(s => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' ')
    );
  } else {
    return 'Null';
  }
};

export const getShortColumn = (value) => {
  if (!value) {
    return null;
  }
  const firstHalf = value.substring(0, 6);
  const secondHalf = value.substring(
    value.length - 6,
    value.length
  );
  return `${firstHalf}...${secondHalf}`;
}