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
  if (Number(value)) { return value; }
  if (!value || value.length < 6) { return ''; }

  const firstHalf = value.substring(0, 6);
  const secondHalf = value.slice(-6);
  return `${firstHalf}...${secondHalf}`;
}

export const getOperatorType = (dataType: string) => {
  if (dataType === 'Int' || dataType === 'Decimal') {
    return 'numeric';
  }
  if (dataType === 'String' || dataType === 'AccountAddress' || dataType === 'Hash') {
    return 'string';
  }
  if (dataType === 'Boolean') {
    return 'boolean';
  }
  return 'dateTime';
}