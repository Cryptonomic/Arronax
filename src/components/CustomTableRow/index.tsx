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
import { getShortColumn } from '../../utils/general';
import { AttributeDefinition } from '../../types';

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
  selectedEntity: string,
  onClickPrimaryKey: (entity: string, key: any, value: any) => void;
}

const formatValueForPrimary = (attribute: any, displayValue: string, value: any, onClickPrimaryKey: any) => {
  const {entity, name} = attribute;

  if (attribute.reference) {
    return <LinkDiv onClick={() => onClickPrimaryKey(attribute.reference.entity, attribute.reference.key, value)}>{displayValue}</LinkDiv>;
  }

  if (PrimaryKeyList[entity] && PrimaryKeyList[entity].includes(name)) {
    return <LinkDiv onClick={() => onClickPrimaryKey(entity, name, value)}>{displayValue}</LinkDiv>;
  }

  return displayValue;
}

const formatValueForDisplay = (
  platform: string,
  network: string,
  entity: string,
  value: any,
  attribute: AttributeDefinition,
  onClickPrimaryKey: (entity: string, key: string, value: string | number) => void
) => {
  if (value == null || value.length === 0) { return ''; }
  const {dataFormat, dataType} = attribute;
  if (dataType === 'Boolean') {
      const svalue = value.toString();
      return svalue.charAt(0).toUpperCase() + svalue.slice(1);
  } else if (dataType === 'DateTime') {
    if (!dataFormat) {
      return value;
    }
    return (
      <Moment format={dataFormat}>
        {value}
      </Moment>
    )
  } else if (dataType === 'AccountAddress') {
    if (value == null || value.length === 0) { return ''; }
    let colors = Buffer.from(Buffer.from(value.substring(3, 6) + value.slice(-3), 'utf8').map(b => Math.floor((b - 48) * 255)/74)).toString('hex');
    return (
      <React.Fragment>
        <StyledCircle1 newcolor={`#${colors.substring(0, 6)}`} />
        <StyledCircle2 newcolor={`#${colors.slice(-6)}`} />
        {formatValueForPrimary(attribute, getShortColumn(value), value, onClickPrimaryKey)}
        <ClipboardWrapper data-clipboard-text={value}>
          <CopyIcon />
        </ClipboardWrapper>
      </React.Fragment>
    );
} else if (dataType === 'Hash') {
    return (
      <React.Fragment>
        {formatValueForPrimary(attribute, getShortColumn(value), value, onClickPrimaryKey)}
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
  } else {
    return formatValueForPrimary(attribute, value, value, onClickPrimaryKey);
  }
};

const CustomTableRow: React.FC<Props> = props => {
  const { selectedColumns, item, network, platform, selectedEntity, onClickPrimaryKey } = props;
  return (
    <TableRowWrapper>
      {selectedColumns.map((column, index) => {
        return (
          <StyledCell key={index}>
            <SpanContainer>
              {formatValueForDisplay(platform, network, selectedEntity, item[column.name], column, onClickPrimaryKey)}
            </SpanContainer>
          </StyledCell>
        );
      })}
    </TableRowWrapper>
  );
};

export default CustomTableRow;
