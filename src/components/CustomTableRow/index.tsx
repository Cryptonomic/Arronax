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

const DefaultAttributeNames = [
  'predecessor',
  'hash',
  'block_id',
  'block_hash',
  'operation_group_hash',
  'delegate',
  'protocol',
  'context',
  'operations_hash',
  'signature'
];

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
  if (PrimaryKeyList[entity].includes(name)) {
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
  const { name, dataFormat, dataType} = attribute;
  if (dataType === 'DateTime') {
    if (!dataFormat) {
      return value;
    }
    return (
      <Moment format={dataFormat}>
        {value}
      </Moment>
    )
  } else if (name === 'account_id' || name === 'manager') {
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
  } else if (DefaultAttributeNames.includes(name)) {
    return (
      <React.Fragment>
        {formatValueForPrimary(entity, name, getShortColumn(value), value, onClickPrimaryKey)}
        <ClipboardWrapper data-clipboard-text={value}>
          <CopyIcon />
        </ClipboardWrapper>
      </React.Fragment>
    );
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
