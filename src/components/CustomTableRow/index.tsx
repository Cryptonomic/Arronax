import * as React from 'react';
import styled from 'styled-components';
import Moment from 'react-moment';
import 'moment-timezone';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
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
`;

const StyledCircle1 = styled(Circle)`
  color: ${({ newcolor }) => newcolor};
`;

const StyledCircle2 = styled(Circle)`
  color: ${({ newcolor }) => newcolor};
  margin-left: -4px;
  margin-right: 7px;
`;

const StyledCell = styled(TableCell)`
  &&& {
    color: #4a4a4a;
    font-size: 16px;
    font-weight: 300;
    letter-spacing: -0.55px;
    border: none;
  }
`;

const SpanContainer = styled.span`
  display: flex;
  align-items: center;
`;

const CopyIcon = styled(ContentCopy)`
  &&& {
    color: #a6dfe2;
    font-size: 20px;
  }
`;

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

const PrimaryKeyList = {
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
  onClickPrimaryKey: (key, value) => void;
}

const formatValueForPrimary = (entity, name, shortValue, value, onClickPrimaryKey) => {
  if (PrimaryKeyList[entity] && PrimaryKeyList[entity].includes(name)) {
    return <LinkDiv onClick={() => onClickPrimaryKey(name, value)}>{shortValue}</LinkDiv>;
  } else if (entity === 'accounts' && name === 'manager') { // TODO: resolve via metadata
    return <LinkDiv onClick={() => onClickPrimaryKey('account_id', value)}>{shortValue}</LinkDiv>;  
  } else if (entity === 'blocks' && name === 'predecessor') { // TODO: resolve via metadata
    return <LinkDiv onClick={() => onClickPrimaryKey('hash', value)}>{shortValue}</LinkDiv>;  
  }
  return shortValue;
}

const formatValueForDisplay = (
  platform: string,
  network: string,
  entity: string,
  value: any,
  attribute: AttributeDefinition,
  onClickPrimaryKey: (key, value) => void
) => {
  const {name, dataFormat, dataType} = attribute;
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
  } else if (dataType === 'AccountAddress'
    || ( // TODO: remove once dataType is set properly
      (entity === 'accounts' && (name === 'account_id' || name === 'manager' || name === 'delegate_value'))
      || (entity === 'operations' && (name === 'source' || name === 'destination'))
      || (entity === 'blocks' && name === 'baker')
    )
  ) {
    if (!value || value.length === 0) { return ''; }
    let colors = Buffer.from(Buffer.from(value.substring(3, 6) + value.slice(-3), 'utf8').map(b => Math.floor((b - 48) * 255)/74)).toString('hex');
    return (
      <React.Fragment>
        <StyledCircle1 newcolor={`#${colors.substring(0, 6)}`} />
        <StyledCircle2 newcolor={`#${colors.slice(-6)}`} />
        {formatValueForPrimary(entity, name, getShortColumn(value), value, onClickPrimaryKey)}
        <ClipboardWrapper data-clipboard-text={value}>
          <CopyIcon />
        </ClipboardWrapper>
      </React.Fragment>
    );
} else if (dataType === 'Hash'
  || ( // TODO: remove once dataType is set properly
      (entity === 'blocks' && (name === 'hash' || name === 'predecessor' || 'operations_hash'))
      || (entity === 'accounts' && name === 'block_id')
      || (entity === 'rolls' && name === 'block_id')
      || (entity === 'ballots' && name === 'block_id')
  )
) {
    if (!value || value.length === 0) { return ''; }
    return (
      <React.Fragment>
        {formatValueForPrimary(entity, name, getShortColumn(value), value, onClickPrimaryKey)}
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
    return formatValueForPrimary(entity, name, value, value, onClickPrimaryKey);
  }
};

const CustomTableRow: React.StatelessComponent<Props> = props => {
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
