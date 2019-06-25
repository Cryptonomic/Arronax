import React from 'react';
import styled from 'styled-components';
import Moment from 'react-moment';
import 'moment-timezone';
import TableCell, { TableCellProps } from '@material-ui/core/TableCell';
import TableRow, { TableRowProps } from '@material-ui/core/TableRow';
import { SvgIconProps } from '@material-ui/core/SvgIcon';
import Circle from '@material-ui/icons/FiberManualRecord';
import ContentCopy from '@material-ui/icons/FileCopyOutlined';
import Clipboard from 'react-clipboard.js';
import { AttributeDefinition, AttrbuteDataType } from 'conseiljs';
import { truncateHash } from '../../utils/general';
import { Aggregation } from '../../types';

const TableRowWrapper = styled(TableRow)`
  &&& {
    &:nth-of-type(odd) {
      background-color: #ecedef;
    }
  }
` as React.ComponentType<TableRowProps>;

type StyledCircleProps = SvgIconProps & { newcolor: string };
const StyledCircle1 = styled(Circle)<{ newcolor: string }>`
  color: ${({ newcolor }) => newcolor};
` as React.ComponentType<StyledCircleProps>;

const StyledCircle2 = styled(Circle)<{ newcolor: string }>`
  color: ${({ newcolor }) => newcolor};
  margin-left: -4px;
  margin-right: 7px;
` as React.ComponentType<StyledCircleProps>;

const StyledCell = styled(TableCell)`
  &&& {
    color: #4a4a4a;
    font-size: 16px;
    font-weight: 300;
    letter-spacing: -0.55px;
    border: none;
  }
` as React.ComponentType<TableCellProps>;

const SpanContainer = styled.span`
  display: flex;
  align-items: center;
`;

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

interface Props {
  item: any;
  selectedColumns: any[];
  network: string;
  platform: string;
  selectedEntity: string;
  aggregations: Aggregation[];
  onClickPrimaryKey: (entity: string, key: any, value: any) => void;
}

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

const formatAggregatedValue = (attribute: AttributeDefinition, value: any) => {
    if (attribute.dataType === AttrbuteDataType.INT || attribute.dataType === AttrbuteDataType.DECIMAL) {
        if (attribute.scale && attribute.scale !== 0) {
            const n = Number(value);
            const d = n/Math.pow(10, attribute.scale);
            if (n < 10000) { return d.toFixed(4); }

            return d.toFixed(2);
        } else {
            return value;
        }
    } else {
        return Number(value).toFixed(0);
    }
}

const formatValueForDisplay = (platform: string, network: string, entity: string, value: any, attribute: AttributeDefinition, isAgg: boolean, onClickPrimaryKey: (entity: string, key: string, value: string | number) => void) => {
    if (value == null || value.length === 0) { return ''; }
    const {dataFormat, dataType} = attribute;

    if (isAgg) { return formatAggregatedValue(attribute, value); }

    if (dataType === 'Boolean') {
        const svalue = value.toString();
        return svalue.charAt(0).toUpperCase() + svalue.slice(1);
    } else if (dataType === AttrbuteDataType.DATETIME) {
        if (!dataFormat) { return value; }

        return (
            <Moment format={dataFormat}>
            {value}
            </Moment>
        )
    } else if (dataType === 'AccountAddress') {
        const colors = Buffer.from(Buffer.from(value.substring(3, 6) + value.slice(-3), 'utf8').map(b => Math.floor((b - 48) * 255)/74)).toString('hex');

        return (
            <React.Fragment>
            <StyledCircle1 newcolor={`#${colors.substring(0, 6)}`} />
            <StyledCircle2 newcolor={`#${colors.slice(-6)}`} />
            {formatReferenceValue(attribute, truncateHash(value), value, onClickPrimaryKey)}
            <ClipboardWrapper data-clipboard-text={value}>
                <CopyIcon />
            </ClipboardWrapper>
            </React.Fragment>
        );
    } else if (dataType === 'Hash') {
        return (
            <React.Fragment>
            {formatReferenceValue(attribute, truncateHash(value), value, onClickPrimaryKey)}
            <ClipboardWrapper data-clipboard-text={value}>
                <CopyIcon />
            </ClipboardWrapper>
            </React.Fragment>
        );
    } else if (dataType === 'Decimal') {
        if (attribute.scale && attribute.scale !== 0) {
            const n = Number(value);
            const d = n/Math.pow(10, attribute.scale);
            if (n < 10000) { return d.toFixed(4); }

            return d.toFixed(2);
        } else {
            return value;
        }
    } else if (dataType === 'String' && value.length > 100) {
        return (
            <React.Fragment>
            {value.substring(0, 100)}
            <ClipboardWrapper data-clipboard-text={value}>
                <CopyIcon />
            </ClipboardWrapper>
            </React.Fragment>
        );
    } else if (dataType === 'String' && value.length > 0 && attribute.cardinality && attribute.cardinality < 20) {
        return value.split('_').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
    } else {
        return formatReferenceValue(attribute, value, value, onClickPrimaryKey);
    }
};

const CustomTableRow: React.FC<Props> = props => {
  const { selectedColumns, aggregations, item, network, platform, selectedEntity, onClickPrimaryKey } = props;
  return (
    <TableRowWrapper>
      {selectedColumns.map(column => {
        const selectedAggs = aggregations.filter(agg => agg.field === column.name);
        if (selectedAggs.length > 0) {
          return selectedAggs.map(agg=> {
            const keyName = `${agg.function}_${agg.field}`;
            return (
              <StyledCell key={keyName}>
                <SpanContainer>
                  {formatValueForDisplay(platform, network, selectedEntity, item[keyName], column, true, onClickPrimaryKey)}
                </SpanContainer>
              </StyledCell>
            );
          });

        } else {
          return (
            <StyledCell key={column.name}>
              <SpanContainer>
                {formatValueForDisplay(platform, network, selectedEntity, item[column.name], column, false, onClickPrimaryKey)}
              </SpanContainer>
            </StyledCell>
          );
        }
      })}
    </TableRowWrapper>
  );
};

export default CustomTableRow;
