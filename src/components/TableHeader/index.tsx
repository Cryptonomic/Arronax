import React from 'react';
import { useTranslation } from 'react-i18next';
import muiStyled from '@material-ui/styles/styled';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Tooltip from '@material-ui/core/Tooltip';
import { Aggregation } from '../../types';

const TableCellWrapper = muiStyled(TableCell)({
  color: '#4a4a4a',
  fontSize: '16px',
  fontWeight: 400,
  letterSpacing: '1.95px',
  border: 'none'
});

const SortLabelWrapper = muiStyled(TableSortLabel)({
  textTransform: 'capitalize'
});

interface Props {
  order: 'asc' | 'desc';
  orderBy: string;
  rows: any[];
  aggregations: Aggregation[];
  createSortHandler(key: string): void;
}

const TableHeader: React.FC<Props> = props => {
  const { rows, aggregations, order, orderBy, createSortHandler } = props;
  const { t } = useTranslation();

  function getRealLabel(keyName: any, value: any, description: any) {
    if (description) {
      return (
        <Tooltip title={description}>
           <SortLabelWrapper
              active={orderBy === keyName}
              direction={order}
              onClick={() => createSortHandler(keyName)}
            >
              {value}
            </SortLabelWrapper>
        </Tooltip>
      );
    }

    return (
      <SortLabelWrapper
        active={orderBy === keyName}
        direction={order}
        onClick={() => createSortHandler(keyName)}
      >
        {value}
      </SortLabelWrapper>
    );
  }

  function getRealCell(keyName: any, value: any, description: any) {
    return (
      <TableCellWrapper
        key={keyName}
        sortDirection={orderBy === keyName ? order : false}
        align="left"
      >
        {getRealLabel(keyName, value, description)}
      </TableCellWrapper>
    )
  }

  return (
    <TableHead>
      <TableRow>
        {rows.map(row => {
          const selectedAggs = aggregations.filter(agg => agg.field === row.name);
          if (selectedAggs.length > 0) {
            return selectedAggs.map(agg=> {
              const keyName = `${agg.function}_${agg.field}`;
              const value = t(`aggFunctions.${agg.function}`) + ' ' + t(`attributes.${row.entity}.${row.name}`);
              return getRealCell(keyName, value, row.description);
            });
          } else {
            const value = t(`attributes.${row.entity}.${row.name}`);
            return getRealCell(row.name, value, row.description);
          }
        })}
      </TableRow>
    </TableHead>
  );
};

export default TableHeader;
