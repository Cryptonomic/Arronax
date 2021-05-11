import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

export default function TokensTable({ items }: { items: Record<string, string>[] }) {
  const classes = useStyles();
  const coinTotal = items.reduce((a, c) => { return Number(a) + (Number(c.coinBalance) || 0) }, 0);

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Token</TableCell>
            <TableCell align="right">Location</TableCell>
            <TableCell align="right">Tokens</TableCell>
            <TableCell align="right">XTZ</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((row) => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">{row.token}</TableCell>
              <TableCell align="right">{row.location}</TableCell>
              <TableCell align="right">{row.balance}</TableCell>
              <TableCell align="right">{row.coinBalance}</TableCell>
            </TableRow>
          ))}
          {coinTotal && (
              <TableRow key="xtzTotal">
                  <TableCell component="th" scope="row">Total</TableCell>
                  <TableCell align="right"></TableCell>
                  <TableCell align="right"></TableCell>
                  <TableCell align="right">{coinTotal}</TableCell>
              </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
