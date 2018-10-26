import React from 'react';

interface Props {
  children: JSX.Element[] | JSX.Element | string | number;
}

export default ({ children }: Props): JSX.Element => (
  <dd style={{ float: 'left', width: '60%', padding: 0, margin: 0 }}>
    {children}
  </dd>
);
