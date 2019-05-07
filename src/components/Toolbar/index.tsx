import * as React from 'react';
import styled from 'styled-components';
import ArronaxIcon from '../ArronaxIcon';
import { ToolType } from '../../types';

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 77px;
  padding: 25px 30px 0 30px;
`;

const ToolItem = styled.div`
  height: 52px;
  border: 1px solid rgb(220, 220, 220);
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 500;
  color: rgb(74, 74, 74);
  cursor: pointer;
  position: absolute;
  top: 25px;
  z-index: 1;
  &:hover {
    border-color: rgb(180, 231, 242);
    color: rgb(86, 194, 217);
    z-index: 4;
    span {
      color: rgb(86, 194, 217);
    }
  }
  &:after {
    content: '';
    width: 100%;
    height: 6px;
    background: transparent;
    position: absolute;
    bottom: 0;
    left: 0;
  }
`;

const FilterTool = styled(ToolItem)`
  width: 126px;
  border-radius: 5px 0px 0px 5px;
  padding-left: 13px;
  left: 30px;
  color: ${({ isactive }) => (isactive ? 'rgb(86, 194, 217)' : 'rgb(74, 74, 74)')};
  span {
    color: ${({ isactive }) => (isactive ? 'rgb(86, 194, 217)' : 'rgb(74, 74, 74)')};
  }
  &:after {
    background: ${({ isactive }) => (isactive ? 'rgb(166, 223, 226)' : 'transparent')};
  }
`;

const ColumnsTool = styled(ToolItem)`
  width: 153px;
  left: 155px;
  padding-left: 12px;
  color: ${({ isactive }) => (isactive ? 'rgb(86, 194, 217)' : 'rgb(74, 74, 74)')};
  span {
    color: ${({ isactive }) => (isactive ? 'rgb(86, 194, 217)' : 'rgb(74, 74, 74)')};
  }
  &:after {
    background: ${({ isactive }) => (isactive ? 'rgb(166, 223, 226)' : 'transparent')};
  }
`;

const ExportTool = styled(ToolItem)`
  width: 149px;
  border-radius: 0px 5px 5px 0px;
  left: 307px;
  padding-left: 18px;
  &:after {
    background: ${({ isactive }) => (isactive ? 'rgb(166, 223, 226)' : 'transparent')};
  }
`;

const FilterIcon = styled(ArronaxIcon)`
  display: inline-block;
  margin-right: 11px;
`;

const ExportIcon = styled(ArronaxIcon)`
  display: inline-block;
  margin-right: 6px;
`;

const ColumnIcon = styled(ArronaxIcon)`
  display: inline-block;
  margin-right: 8px;
`;


interface Props {
  isCollapsed: boolean;
  selectedTool: string;
  filterCount: number;
  columnsCount: number;
  onChangeTool: (tool: string) => void;
  onExportCsv: () => void;
}

const Toolbar: React.StatelessComponent<Props> = props => {
  const { isCollapsed, selectedTool, filterCount, columnsCount, onChangeTool, onExportCsv } = props;
  return (
    <Container>
      <FilterTool
        isactive={isCollapsed && selectedTool === ToolType.FILTER ? 1 : 0}
        onClick={() => onChangeTool(ToolType.FILTER)}
      >
        <FilterIcon size="20px" color="#4a4a4a" iconName="icon-filter" />
        Filter ({filterCount})
      </FilterTool>
      <ColumnsTool
        isactive={isCollapsed && selectedTool === ToolType.COLUMN ? 1 : 0}
        onClick={() => onChangeTool(ToolType.COLUMN)}
      >
        Columns ({columnsCount})
      </ColumnsTool>
      <ExportTool onClick={onExportCsv}>
        <ExportIcon size="20px" color="#4a4a4a" iconName="icon-export" />
        Export CSV
      </ExportTool>
    </Container>
  );
};

Toolbar.defaultProps = {
  filterCount: 0,
  columnsCount: 0,
  isCollapsed: false
};

export default Toolbar;
