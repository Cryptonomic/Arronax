import * as React from 'react';
import styled from 'styled-components';
import ArronaxIcon from '../ArronaxIcon';
import ColumnsDisplay from '../ColumnsDisplay';

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
`;

const FilterTool = styled(ToolItem)`
  width: 126px;
  border-radius: 5px 0px 0px 5px;
  padding-left: 13px;
  left: 30px;
`;

const ExportTool = styled(ToolItem)`
  width: 149px;
  border-radius: 0px 5px 5px 0px;
  left: 307px;
  padding-left: 18px;
`;

const FilterIcon = styled(ArronaxIcon)`
  display: inline-block;
  margin-right: 11px;
`;

const ExportIcon = styled(ArronaxIcon)`
  display: inline-block;
  margin-right: 6px;
`;


interface Props {
  filterCount: number;
  onFilterCollapse: () => void;
  onExportCsv: () => void;
}

const Toolbar: React.StatelessComponent<Props> = props => {
  const { filterCount, onFilterCollapse, onExportCsv } = props;
  return (
    <Container>
      <FilterTool onClick={onFilterCollapse}>
        <FilterIcon size="20px" color="#4a4a4a" iconName="icon-filter" />
        Filter ({filterCount})
      </FilterTool>
      <ColumnsDisplay />
      <ExportTool onClick={onExportCsv}>
        <ExportIcon size="20px" color="#4a4a4a" iconName="icon-export" />
        Export CSV
      </ExportTool>
    </Container>
  );
};

Toolbar.defaultProps = {
  filterCount: 0,
};

export default Toolbar;
