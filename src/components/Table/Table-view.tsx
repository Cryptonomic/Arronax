import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import {
  useOverflow,
  useTableBodyCellChild,
  useTableContainerStyles,
  useTableHeaderCellStyles,
  useTableBodyRowStyles,
  useTableBodyCellStyles,
} from './Table-styles';

import { TableViewProps } from './Table-types'

const TableView = (props: TableViewProps) => {
  const { cols, items } = props;

  const Overflow = useOverflow();
  const TableContainer = useTableContainerStyles(Table);
  const TableHeaderCell = useTableHeaderCellStyles(TableCell);
  const TableBodyRow = useTableBodyRowStyles(TableRow);
  const TableBodyCell = useTableBodyCellStyles(TableCell);
  const TableBodyCellChild = useTableBodyCellChild();

  return (
    <Overflow>
      <TableContainer stickyHeader>
            <TableHead>
              <TableRow>
                <TableHeaderCell>No</TableHeaderCell>
                {cols.map((col: Record<string, string>) => (
                  <TableHeaderCell key={col.name}>{col.displayName}</TableHeaderCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item: object, index: number) => (
                <TableBodyRow key={index}>
                  <TableBodyCell>{index + 1}</TableBodyCell>
                  {cols.map((col: Record<string, string>) => (
                    <TableBodyCell key={col.name}><TableBodyCellChild>{item[col.name]}</TableBodyCellChild></TableBodyCell>
                  ))}
                </TableBodyRow>
              ))}
            </TableBody>
        </TableContainer>
    </Overflow>
  )
}

export default TableView;