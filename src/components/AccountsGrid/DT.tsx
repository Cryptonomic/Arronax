import React from 'react';

interface Props {
  children: JSX.Element[] | JSX.Element | string | number;
}

export default ({ children }: Props): JSX.Element => (
  <dt
    style={{
      float: 'left',
      width: '40%',
      fontWeight: 'bold',
      padding: 0,
      margin: 0
    }}
  >
    {children}
  </dt>
);
