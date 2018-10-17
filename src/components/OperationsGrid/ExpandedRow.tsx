import React from 'react';
import { Row, Col } from 'antd';
import DD from './DD';
import DL from './DL';
import DT from './DT';
import { TezosOperation } from '../../types';

interface Props {
  record: TezosOperation;
}

export default ({ record }: Props): JSX.Element => {
  return (
    <Row gutter={24}>
      <Col span={12}>
        <DL>
          <DT>Kind:</DT>
          <DD>{record.kind}</DD>
          <DT>Source:</DT>
          <DD>{record.source}</DD>
          <DT>Manager Pub Key:</DT>
          <DD>{record.manager_pub_key}</DD>
          <DT>Balance:</DT>
          <DD>{record.balance}</DD>
          <DT>Operation Group Hash:</DT>
          <DD>{record.operationGroupHash}</DD>
          <DT>Storage limit:</DT>
          <DD>{record.storageLimit}</DD>
          <DT>Block hash:</DT>
          <DD>{record.blockHash}</DD>
        </DL>
      </Col>
      <Col span={12}>
        <DL>
          <DT>Amount:</DT>
          <DD>{record.amount}</DD>
          <DT>Destination:</DT>
          <DD>{record.destination}</DD>
          <DT>Delegate:</DT>
          <DD>{record.delegate}</DD>
          <DT>Fee:</DT>
          <DD>{record.fee}</DD>
          <DT>OperationId:</DT>
          <DD>{record.operationId}</DD>
          <DT>Gas limit:</DT>
          <DD>{record.gasLimit}</DD>
          <DT>Block level:</DT>
          <DD>{record.blockLevel}</DD>
        </DL>
      </Col>
    </Row>
  );
};
