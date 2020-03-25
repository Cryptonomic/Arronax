import React from 'react';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
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

const Overflow = useOverflow();
const TableContainer = useTableContainerStyles();
const TableHeaderCell = useTableHeaderCellStyles();
const TableBodyRow = useTableBodyRowStyles();
const TableBodyCell = useTableBodyCellStyles();
const TableBodyCellChild = useTableBodyCellChild();

const TableView = (props: TableViewProps) => {
  const { cols, items } = props;
  return (
    <Overflow>
      <TableContainer stickyHeader>
            <TableHead>
              <TableRow>
                <TableHeaderCell>No</TableHeaderCell>
                {cols.map((col: any) => (
                  <TableHeaderCell key={col.name}>{col.displayName}</TableHeaderCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item: object, index: number) => (
                <TableBodyRow key={index}>
                  <TableBodyCell>{index + 1}</TableBodyCell>
                  {cols.map((col: any) => (
                    //@ts-ignore
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