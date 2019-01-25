
import * as React from 'react';
import styled from 'styled-components';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';

const TableCellWrapper = styled(TableCell)`
  &&& {
    color: #4A4A4A;
    font-size: 16px;
    font-weight: 400;
    letter-spacing: 1.95px;
    border: none;
  }  
`;


interface Props {
  order: 'asc' | 'desc';
  orderBy: string;
  rows: any[];
  createSortHandler(key: string): void;
}

const TableHeader: React.StatelessComponent<Props> = (props) => {
  const {rows, order, orderBy, createSortHandler} = props;
  return (
    <TableHead>
      <TableRow>
        {rows.map(row => {
          return (
            <TableCellWrapper
              key={row.key}
              sortDirection={orderBy === row.dataIndex ? order : false}
              align='left'
            >
              <TableSortLabel
                active={orderBy === row.dataIndex}
                direction={order}
                onClick={() => createSortHandler(row.dataIndex)}
              >
                {row.title}
              </TableSortLabel>
            </TableCellWrapper>
          );
        })}
      </TableRow>
    </TableHead>
  );
}

export default TableHeader;