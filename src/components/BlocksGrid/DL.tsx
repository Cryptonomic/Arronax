import React from 'react';

interface Props {
  children: JSX.Element[] | JSX.Element;
}

export default ({ children }: Props): JSX.Element => (
  <dl style={{ width: '100%', overflow: 'hidden', padding: 0, margin: 0 }}>
    {children}
  </dl>
);
