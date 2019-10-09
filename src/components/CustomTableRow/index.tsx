import React from 'react';
import styled from 'styled-components';

import 'moment-timezone';
import TableCell, { TableCellProps } from '@material-ui/core/TableCell';
import TableRow, { TableRowProps } from '@material-ui/core/TableRow';

import { formatValueForDisplay } from '../../utils/render';
import { Aggregation } from '../../types';

const TableRowWrapper = styled(TableRow)`
  &&& {
    &:nth-of-type(odd) {
      background-color: #ecedef;
    }
  }
` as React.ComponentType<TableRowProps>;

const StyledCell = styled(TableCell)`
  &&& {
    color: #4a4a4a;
    font-size: 16px;
    font-weight: 300;
    letter-spacing: -0.55px;
    border: none;
  }
` as React.ComponentType<TableCellProps>;

const SpanContainer = styled.span`
  display: flex;
  align-items: center;
`;

interface Props {
  item: any;
  selectedColumns: any[];
  network: string;
  platform: string;
  selectedEntity: string;
  aggregations: Aggregation[];
  onClickPrimaryKey: (entity: string, key: any, value: any) => void;
}

const CustomTableRow: React.FC<Props> = props => {
  const { selectedColumns, aggregations, item, network, platform, selectedEntity, onClickPrimaryKey } = props;
  return (
    <TableRowWrapper>
      {selectedColumns.map(column => {
        const selectedAggs = aggregations.filter(agg => agg.field === column.name);
        if (selectedAggs.length > 0) {
          return selectedAggs.map(agg => {
            const keyName = `${agg.function}_${agg.field}`;
            return (
              <StyledCell key={keyName}>
                <SpanContainer>
                  {formatValueForDisplay(platform, network, selectedEntity, item[keyName], column, onClickPrimaryKey, agg.function)}
                </SpanContainer>
              </StyledCell>
            );
          });

        } else {
          return (
            <StyledCell key={column.name}>
              <SpanContainer>
                {formatValueForDisplay(platform, network, selectedEntity, item[column.name], column, onClickPrimaryKey, undefined)}
              </SpanContainer>
            </StyledCell>
          );
        }
      })}
    </TableRowWrapper>
  );
};

export default CustomTableRow;
