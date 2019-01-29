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
interface Props {
  category: string;
  item: any;
  selectedColumns: any[];
}

const CustomTableRow: React.StatelessComponent<Props> = props => {
  const { selectedColumns, item } = props;
  return (
    <TableRowWrapper>
      {selectedColumns.map(column => {
        return (
          <StyledCell key={column.key}>
            {column.dataIndex === 'timestamp'
              ? moment(item[column.dataIndex]).format('dd MM YYYY h:mm:ss a')
              : item[column.dataIndex]}
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
