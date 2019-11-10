import React from 'react';
import styled from 'styled-components';

import Moment from 'react-moment';
import 'moment-timezone';
import { SvgIconProps } from '@material-ui/core/SvgIcon';
import Circle from '@material-ui/icons/FiberManualRecord';
import ContentCopy from '@material-ui/icons/FileCopyOutlined';
import Clipboard from 'react-clipboard.js';

import { AttributeDefinition, AttrbuteDataType, ConseilFunction } from 'conseiljs';
import { truncateHash, formatNumber } from './general';

type StyledCircleProps = SvgIconProps & { newcolor: string };
const StyledCircle1 = styled(Circle)<{ newcolor: string }>`
  color: ${({ newcolor }) => newcolor};
` as React.ComponentType<StyledCircleProps>;

const StyledCircle2 = styled(Circle)<{ newcolor: string }>`
  color: ${({ newcolor }) => newcolor};
  margin-left: -4px;
  margin-right: 7px;
` as React.ComponentType<StyledCircleProps>;

const CopyIcon = styled(ContentCopy)`
  &&& {
    color: #a6dfe2;
    font-size: 20px;
  }
` as React.ComponentType<SvgIconProps>;

const ClipboardWrapper = styled(Clipboard)`
  border: none;
  background: transparent;
  outline: none !important;
  cursor: pointer;
`;

const LinkDiv = styled.div`
  color: #56c2d9;
  cursor: pointer;
  text-decoration: underline;
`;

const PrimaryKeyList: any = {
  blocks: ['hash', 'level'],
  accounts: ['account_id'],
  operations: ['operation_group_hash']
};

const formatReferenceValue = (attribute: any, displayValue: string, value: any, onClickPrimaryKey: any) => {
    const {entity, name} = attribute;
  
    if (attribute.reference) {
      return <LinkDiv onClick={() => onClickPrimaryKey(attribute.reference.entity, attribute.reference.key, value)}>{displayValue}</LinkDiv>;
    }
  
    if (PrimaryKeyList[entity] && PrimaryKeyList[entity].includes(name)) {
      return <LinkDiv onClick={() => onClickPrimaryKey(entity, name, value)}>{displayValue}</LinkDiv>;
    }
  
    return displayValue;
  }
  
  const formatAggregatedValue = (attribute: AttributeDefinition, value: any, aggregation: ConseilFunction) => {
      let aggregationAttribute = { ...attribute };
  
      switch (aggregation) {
          case ConseilFunction.count: 
              aggregationAttribute.dataType = AttrbuteDataType.INT;
              break;
          default:
              aggregationAttribute.dataType = attribute.dataType === AttrbuteDataType.CURRENCY ? AttrbuteDataType.CURRENCY : AttrbuteDataType.DECIMAL;
              break;
      }
  
      return formatNumber(Number(value), aggregationAttribute);
  }
  
  export const formatValueForDisplay = (platform: string, network: string, entity: string, value: any, attribute: AttributeDefinition, onClickPrimaryKey: (entity: string, key: string, value: string | number) => void, aggregation?: ConseilFunction, truncate: boolean = true) => {
      if (value == null || value.length === 0) { return ''; }
      const {dataFormat, dataType} = attribute;
  
      if (!!aggregation) { return formatAggregatedValue(attribute, value, aggregation); }
  
      if (dataType === AttrbuteDataType.BOOLEAN) {
          const svalue = value.toString();
          return svalue.charAt(0).toUpperCase() + svalue.slice(1);
      } else if (dataType === AttrbuteDataType.DATETIME) {
          if (!dataFormat) { return value; }
          return (
            <Moment format={dataFormat}>{value}</Moment>
          )
      } else if (dataType === AttrbuteDataType.ACCOUNT_ADDRESS) {
          const colors = Buffer.from(Buffer.from(value.substring(3, 6) + value.slice(-3), 'utf8').map(b => Math.floor((b - 48) * 255)/74)).toString('hex');
          const address = formatReferenceValue(attribute, (truncate ? truncateHash(value) : value), value, onClickPrimaryKey)
          return (
              <React.Fragment>
              <StyledCircle1 newcolor={`#${colors.substring(0, 6)}`} />
              <StyledCircle2 newcolor={`#${colors.slice(-6)}`} />
              {address}
              <ClipboardWrapper data-clipboard-text={value}>
                  <CopyIcon />
              </ClipboardWrapper>
              </React.Fragment>
          );
      } else if (dataType === AttrbuteDataType.HASH) {
          const hash = formatReferenceValue(attribute, (truncate ? truncateHash(value) : value), value, onClickPrimaryKey);
          return (
              <React.Fragment>
              {hash}
              <ClipboardWrapper data-clipboard-text={value}>
                  <CopyIcon />
              </ClipboardWrapper>
              </React.Fragment>
          );
      } else if (dataType === AttrbuteDataType.DECIMAL || dataType === AttrbuteDataType.INT || dataType === AttrbuteDataType.CURRENCY) {
        return formatNumber(Number(value), attribute, truncate);
      } else if (dataType === AttrbuteDataType.STRING && value.length > 100) {
          return (
              <React.Fragment>
              {value.substring(0, 100)}
              <ClipboardWrapper data-clipboard-text={value}>
                  <CopyIcon />
              </ClipboardWrapper>
              </React.Fragment>
          );
      } else if (dataType === AttrbuteDataType.STRING && value.length > 0 && attribute.cardinality && attribute.cardinality < 20) {
          return value.split('_').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
      } else {
          return formatReferenceValue(attribute, value, value, onClickPrimaryKey);
      }
  };