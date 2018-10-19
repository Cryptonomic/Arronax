import React from 'react';
import { Row, Col, Icon } from 'antd';
import DD from './DD';
import DL from './DL';
import DT from './DT';
import { TezosAccount } from '../../types';

interface Props {
  record: TezosAccount;
}

export default ({ record }: Props): JSX.Element => (
  <Row gutter={24}>
    <Col span={12}>
      <DL>
        <DT>Account Id:</DT>
        <DD>{record.accountId}</DD>
        <DT>Delegate setable:</DT>
        <DD>
          {record.delegateSetable ? (
            <Icon type="check-circle" theme="outlined" />
          ) : (
            <Icon type="close-circle" theme="outlined" />
          )}
        </DD>
        <DT>Spendable:</DT>
        <DD>
          {record.spendable ? (
            <Icon type="check-circle" theme="outlined" />
          ) : (
            <Icon type="close-circle" theme="outlined" />
          )}
        </DD>
        <DT>Counter:</DT>
        <DD>{record.counter}</DD>
        <DT>Manager:</DT>
        <DD>{record.manager}</DD>
      </DL>
    </Col>
    <Col span={12}>
      <DL>
        <DT>Block Id:</DT>
        <DD>{record.blockId}</DD>
        <DT>Delegate value:</DT>
        <DD>{record.delegateValue}</DD>
        <DT>Balance:</DT>
        <DD>{record.balance}</DD>
      </DL>
    </Col>
  </Row>
);
