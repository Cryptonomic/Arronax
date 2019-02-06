import * as React from 'react';
import * as moment from 'moment';
import { connect } from 'react-redux';
import { getColumns } from '../../reducers/app/selectors';
import styled from 'styled-components';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

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
interface Props {
  category: string;
  item: any;
  selectedColumns: any[];
}

const linkCheck = item => {
  let itemsArray = Object.keys(item);
  itemsArray.forEach(item => {
    if (
      item.toLowerCase().includes('hash') ||
      item.toLowerCase().includes('predecessor') ||
      item.toLowerCase().includes('accountid') ||
      item.toLowerCase().includes('blockid') ||
      item.toLowerCase().includes('manager')
    ) {
      return true;
    } else {
      return false;
    }
  });
};

const CustomTableRow: React.StatelessComponent<Props> = props => {
  const { selectedColumns, item } = props;
  const newItem = { ...item };
  let itemsArray = Object.keys(item);
  itemsArray.forEach(hash => {
    if (
      hash.toLowerCase().includes('hash') ||
      hash.toLowerCase().includes('predecessor') ||
      hash.toLowerCase().includes('accountid') ||
      hash.toLowerCase().includes('blockid') ||
      hash.toLowerCase().includes('manager') ||
      hash.toLowerCase().includes('context') ||
      hash.toLowerCase().includes('signature') ||
      hash.toLowerCase().includes('protocol')
    ) {
      const hashRepresentation = item[hash];
      const firstHalf = hashRepresentation.substring(0, 5);
      const secondHalf = hashRepresentation.substring(
        hashRepresentation.length - 6,
        hashRepresentation.length
      );
      const newHash = `${firstHalf}...${secondHalf}`;
      item[hash] = newHash;
    }
    return item[hash];
  });

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
                {this.linkCheck(item.dataIndex) ? (
                  <a
                    href={`https://zeronet.tzscan.io/${
                      newItem[column.dataIndex]
                    }`}
                  >
                    {item[column.dataIndex]}
                  </a>
                ) : (
                  item[column.dataIndex]
                )}{' '}
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
