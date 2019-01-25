import * as React from 'react';
import * as moment from 'moment';
import styled from 'styled-components';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import getColumns from '../../utils/getColumns';

const TableRowWrapper = styled(TableRow)`
  &&& {
    &:nth-of-type(odd) {
      background-color: #ECEDEF;
    }
  }
`;
const StyledCell = styled(TableCell)`
  &&& {
    color: #4A4A4A;
    font-size: 16px;
    font-weight: 300;
    letter-spacing: -0.55px;
    border: none;
  }
`;
interface Props {
  category: string;
  item: any;
}

const CustomTableRow: React.StatelessComponent<Props> = (props) => {
  const {category, item} = props;
  const columns = getColumns(category);
  return (
    <TableRowWrapper>
      {columns.map(column => {
        return (
          <StyledCell key={column.key}>
            {column.dataIndex==='timestamp' ? moment(item[column.dataIndex]).format('dd MM YYYY h:mm:ss a') : item[column.dataIndex]}
          </StyledCell>)
      })}
    </TableRowWrapper>
  );
}

export default CustomTableRow;