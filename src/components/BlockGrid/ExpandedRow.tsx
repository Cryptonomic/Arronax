import React from 'react';
import { Row, Col } from 'antd';
import DD from './DD';
import DL from './DL';
import DT from './DT';
import { TezosBlock } from '../../types';

interface Props {
  record: TezosBlock;
}

export default ({ record }: Props): JSX.Element => (
  <Row gutter={24}>
    <Col span={12}>
      <DL>
        <DT>Predecessor:</DT>
        <DD>{record.predecessor}</DD>
        <DT>Validation Pass:</DT>
        <DD>{record.validationPass}</DD>
        <DT>Fitness</DT>
        <DD>{record.fitness}</DD>
      </DL>
    </Col>
    <Col span={12}>
      <DL>
        <DT>Operations Hash:</DT>
        <DD>{record.operationsHash}</DD>
        <DT>Data:</DT>
        <DD>n/a</DD>
      </DL>
    </Col>
  </Row>
);
