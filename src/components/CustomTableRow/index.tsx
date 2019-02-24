import * as React from 'react';
import * as moment from 'moment';
import { connect } from 'react-redux';
import { getColumns, getNetwork } from '../../reducers/app/selectors';
import styled from 'styled-components';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Circle from '@material-ui/icons/FiberManualRecord';

const TableRowWrapper = styled(TableRow)`
  &&& {
    &:nth-of-type(odd) {
      background-color: #ecedef;
    }
  }
`;

const StyledCircle1 = styled(Circle)`
  color: rgb(255, 155, 213);
`;

const StyledCircle2 = styled(Circle)`
  color: rgb(215, 195, 113);
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
  entity: string;
  item: any;
  selectedColumns: any[];
  network: string;
}

export const displayType = (network, shortenedItem, item, name) => {
  if (name === 'account_id' || name === 'manager') {
    return (
      <React.Fragment>
        <StyledCircle1 />
        <StyledCircle2 />
        <ExplorerLink
          href={`https://${network}.tzscan.io/${item[name]}`}
          target="_blank"
        >
          {shortenedItem[name]}
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
          href={`https://${network}.tzscan.io/${item[name]}`}
          target="_blank"
        >
          {shortenedItem[name]}
        </ExplorerLink>
      </React.Fragment>
    );
  } else if (
    name === 'protocol' ||
    name === 'context' ||
    name === 'operations_hash' ||
    name === 'signature'
  ) {
    return shortenedItem[name];
  } else {
    return item[name];
  }
};

const CustomTableRow: React.StatelessComponent<Props> = props => {
  const { selectedColumns, item, network } = props;
  const shortenedItem = { ...item };
  let itemsArray = Object.keys(shortenedItem);
  itemsArray.forEach(hash => {
    if (item[hash] === null) {
      return;
    } else if (
      hash.toLowerCase().includes('hash') ||
      hash.toLowerCase().includes('predecessor') ||
      hash.toLowerCase().includes('account_id') ||
      hash.toLowerCase().includes('block_id') ||
      hash.toLowerCase() === 'manager' ||
      hash.toLowerCase().includes('protocol') ||
      hash.toLowerCase().includes('block_hash') ||
      hash.toLowerCase() === 'delegate' ||
      hash.toLowerCase().includes('operation_group_hash') ||
      hash.toLowerCase().includes('context') ||
      hash.toLowerCase().includes('signature')
    ) {
      const hashRepresentation = item[hash];
      const firstHalf = hashRepresentation.substring(0, 6);
      const secondHalf = hashRepresentation.substring(
        hashRepresentation.length - 6,
        hashRepresentation.length
      );
      const newHash = `${firstHalf}...${secondHalf}`;
      shortenedItem[hash] = newHash;
    }
    return shortenedItem[hash];
  });

  return (
    <TableRowWrapper>
      {selectedColumns.map((column, index) => {
        return (
          <StyledCell key={index}>
            {column.name === 'timestamp' ? (
              moment(item[column.name]).format('dd MM YYYY h:mm:ss a')
            ) : (
              <SpanContainer>
                {displayType(network, shortenedItem, item, column.name)}
              </SpanContainer>
            )}
          </StyledCell>
        );
      })}
    </TableRowWrapper>
  );
};

export default CustomTableRow;
