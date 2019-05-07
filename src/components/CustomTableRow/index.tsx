import * as React from 'react';
import * as moment from 'moment';
import styled from 'styled-components';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Circle from '@material-ui/icons/FiberManualRecord';
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
`;

const ExplorerLink = styled.a`
  text-decoration: none;
  color: #10ade4;
`;
interface Props {
  item: any;
  selectedColumns: any[];
  network: string;
}

export const displayType = (network, value, name) => {
  if (name === 'account_id' || name === 'manager') {
    let colors = Buffer.from(Buffer.from(name.substring(3, 6) + name.slice(-3), 'utf8').map(b => Math.floor((b - 48) * 255)/74)).toString('hex');
    return (
      <React.Fragment>
        <StyledCircle1 newcolor={`#${colors.substring(0, 6)}`} />
        <StyledCircle2 newcolor={`#${colors.slice(-6)}`} />
        <ExplorerLink
          href={`https://${network}.tzscan.io/${value}`}
          target="_blank"
        >
          {getShortColumn(value)}
        </ExplorerLink>
      </React.Fragment>
    );
  } else if (
    name === 'predecessor' ||
    name === 'hash' ||
    name === 'block_id' ||
    name === 'block_hash' ||
    name === 'operation_group_hash' ||
    name === 'delegate'
  ) {
    return (
      <React.Fragment>
        <ExplorerLink
          href={`https://${network}.tzscan.io/${value}`}
          target="_blank"
        >
          {getShortColumn(value)}
        </ExplorerLink>
      </React.Fragment>
    );
  } else if (
    name === 'protocol' ||
    name === 'context' ||
    name === 'operations_hash' ||
    name === 'signature'
  ) {
    return getShortColumn(value);
  } else {
    return value;
  }
};

const CustomTableRow: React.StatelessComponent<Props> = props => {
  const { selectedColumns, item, network } = props;
  return (
    <TableRowWrapper>
      {selectedColumns.map((column, index) => {
        return (
          <StyledCell key={index}>
            {column.name === 'timestamp' ? (
              moment(item[column.name]).format('dd MM YYYY h:mm:ss a')
            ) : (
              <SpanContainer>
                {displayType(network, item[column.name], column.name)}
              </SpanContainer>
            )}
          </StyledCell>
        );
      })}
    </TableRowWrapper>
  );
};

export default CustomTableRow;
