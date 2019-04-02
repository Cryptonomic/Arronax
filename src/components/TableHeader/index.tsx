import * as React from 'react';
import styled from 'styled-components';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';

const TableCellWrapper = styled(TableCell)`
  &&& {
    color: #4a4a4a;
    font-size: 16px;
    font-weight: 400;
    letter-spacing: 1.95px;
    border: none;
  }
`;

interface Props {
  // order: 'asc' | 'desc';
  // orderBy: string;
  rows: any[];
  createSortHandler(key: string): void;
}

const TableHeader: React.StatelessComponent<Props> = props => {
  const { rows, createSortHandler } = props;
  return (
    <TableHead>
      <TableRow>
        {rows.map((row, index) => {
          return (
            <TableCellWrapper
              key={index}
              // sortDirection={orderBy === row.name ? order : false}
              align="left"
            >
              <TableSortLabel
                // active={orderBy === row.name}
                // direction={order}
                onClick={() => createSortHandler(row.name)}
              >
                {row.displayName}
              </TableSortLabel>
            </TableCellWrapper>
          );
        })}
      </TableRow>
    </TableHead>
  );
};

export default TableHeader;
