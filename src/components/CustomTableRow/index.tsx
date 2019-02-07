import * as React from 'react';
import * as moment from 'moment';
import { connect } from 'react-redux';
import { getColumns } from '../../reducers/app/selectors';
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

const styles = {
  linkUnderline: {
    textDecoration: 'none',
  },
};

interface Props {
  category: string;
  item: object;
  selectedColumns: any[];
}

export const displayType = (item, dataIndex) => {
  if (dataIndex === 'accountId' || dataIndex === 'manager') {
    const hashRepresentation = item[dataIndex];
    const firstHalf = hashRepresentation.substring(0, 6);
    const secondHalf = hashRepresentation.substring(
      hashRepresentation.length - 6,
      hashRepresentation.length
    );
    const newHash = `${firstHalf}...${secondHalf}`;
    item[dataIndex] = newHash;
    return (
      <>
        <Circle /> <Circle />
        <a
          href={`https://zeronet.tzscan.io/${item[dataIndex]}`}
          style={styles.linkUnderline}
        >
          {newHash}
        </a>
      </>
    );
  } else if (
    dataIndex === 'predecessor' ||
    dataIndex === 'hash' ||
    dataIndex === 'operationsHash' ||
    dataIndex === 'blockId' ||
    dataIndex === 'blockHash' ||
    dataIndex === 'operationGroupHash'
  ) {
    const hashRepresentation = item[dataIndex];
    const firstHalf = hashRepresentation.substring(0, 6);
    const secondHalf = hashRepresentation.substring(
      hashRepresentation.length - 6,
      hashRepresentation.length
    );
    const newHash = `${firstHalf}...${secondHalf}`;
    item[dataIndex] = newHash;
    return (
      <>
        <a
          href={`https://zeronet.tzscan.io/${item[dataIndex]}`}
          style={styles.linkUnderline}
        >
          {newHash}
        </a>
      </>
    );
  } else {
    return item[dataIndex];
  }
};

const CustomTableRow: React.StatelessComponent<Props> = props => {
  const { selectedColumns, item } = props;
  const itemBeforeShortening = { ...item };
  // let itemsArray = Object.keys(item);
  // itemsArray.forEach(hash => {
  //   if (
  //     hash.toLowerCase().includes('hash') ||
  //     hash.toLowerCase().includes('predecessor') ||
  //     hash.toLowerCase().includes('accountid') ||
  //     hash.toLowerCase().includes('blockid') ||
  //     hash.toLowerCase().includes('manager')
  //   ) {
  //     const hashRepresentation = item[hash];
  //     const firstHalf = hashRepresentation.substring(0, 6);
  //     const secondHalf = hashRepresentation.substring(
  //       hashRepresentation.length - 6,
  //       hashRepresentation.length
  //     );
  //     const newHash = `${firstHalf}...${secondHalf}`;
  //     item[hash] = newHash;
  //   }
  //   return item[hash];
  // });

  return (
    <TableRowWrapper>
      {selectedColumns.map(column => {
        return (
          <StyledCell key={column.key}>
            {column.dataIndex === 'timestamp' ? (
              moment(item[column.dataIndex]).format('dd MM YYYY h:mm:ss a')
            ) : (
              // NOTE: SpanContainer necessary to avoid error (for passing isIcon: boolean):
              // Warning: Failed prop type: Invalid prop children supplied to TableCell, expected a ReactNode.
              <SpanContainer>
                {displayType(item, column.dataIndex)}
              </SpanContainer>
            )}
          </StyledCell>
        );
      })}
    </TableRowWrapper>
  );
};

const mapStateToProps = (state: any) => ({
  selectedColumns: getColumns(state),
});

export default connect(
  mapStateToProps,
  null
)(CustomTableRow);
