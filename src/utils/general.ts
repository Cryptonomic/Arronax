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