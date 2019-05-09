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
interface Props {
  item: any;
  selectedColumns: any[];
  network: string;
  platform: string;
}

export const formatValueForDisplay = (platform, network, value, attribute) => {
  const { name, entity, dataFormat, dataType} = attribute;
  if (dataType === 'DateTime') {
    return (
      <Moment parse={dataFormat}>
        {value}
      </Moment>
    )
  } else if (name === 'account_id' || name === 'manager') {
    let colors = Buffer.from(Buffer.from(value.substring(3, 6) + value.slice(-3), 'utf8').map(b => Math.floor((b - 48) * 255)/74)).toString('hex');
    return (
      <React.Fragment>
        <StyledCircle1 newcolor={`#${colors.substring(0, 6)}`} />
        <StyledCircle2 newcolor={`#${colors.slice(-6)}`} />
        {getShortColumn(value)}
        <ClipboardWrapper data-clipboard-text={value}>
          <CopyIcon />
        </ClipboardWrapper>
      </React.Fragment>
    );
  } else if (DefaultAttributeNames.includes(name)) {
    return (
      <React.Fragment>
        {getShortColumn(value)}
        <ClipboardWrapper data-clipboard-text={value}>
          <CopyIcon />
        </ClipboardWrapper>
      </React.Fragment>
    );
  } else {
    return value;
  }
};

const CustomTableRow: React.StatelessComponent<Props> = props => {
  const { selectedColumns, item, network, platform } = props;
  return (
    <TableRowWrapper>
      {selectedColumns.map((column, index) => {
        return (
          <StyledCell key={index}>
            <SpanContainer>
              {formatValueForDisplay(platform, network, item[column.name], column)}
            </SpanContainer>
          </StyledCell>
        );
      })}
    </TableRowWrapper>
  );
};

export default CustomTableRow;
