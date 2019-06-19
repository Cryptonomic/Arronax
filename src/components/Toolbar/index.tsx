import React from 'react';
import styled from 'styled-components';
import Tooltip from '@material-ui/core/Tooltip';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { ArronaxIcon } from '../ArronaxIcon';
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

const FilterTool = styled(ToolItem)<{isactive: boolean}>`
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

const ColumnsTool = styled(ToolItem)<{isactive: boolean}>`
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

const ShareTool = styled(ToolItem)`
  width: 120px;
  left: 307px;
  padding-left: 18px;
  border-radius: 0px 5px 5px 0px;
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
  onShareReport: () => void;
}

const Toolbar: React.FC<Props> = props => {
  const { isCollapsed, selectedTool, filterCount, columnsCount, onChangeTool, onExportCsv, onShareReport } = props;
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  function shareReport() {
    setOpen(true);
    setAnchorEl(null);
    setTimeout(() => {
      onShareReport();
    });
    setTimeout(() => {
      setOpen(false);
    }, 2000);
  }

  function openShareMenu(event) {
    setAnchorEl(event.currentTarget);
  }
  function closeShareMenu() {
    setAnchorEl(null);
  }
  function exportCsv() {
    setAnchorEl(null);
    onExportCsv();
  }
  return (
    <Container>
      <FilterTool
        isactive={isCollapsed && selectedTool === ToolType.FILTER}
        onClick={() => onChangeTool(ToolType.FILTER)}
      >
        <FilterIcon size="20px" color="#4a4a4a" iconName="icon-filter" />
        Filter {filterCount > 0 ? "(" + filterCount + ")" : "" }
      </FilterTool>
      <ColumnsTool
        isactive={isCollapsed && selectedTool === ToolType.COLUMN}
        onClick={() => onChangeTool(ToolType.COLUMN)}
      >
        <ColumnIcon size="20px" color="#4a4a4a" iconName="icon-columns" />
        Columns ({columnsCount})
      </ColumnsTool>
      <ShareTool aria-controls="share-menu" aria-haspopup="true" onClick={openShareMenu}>
        <ExportIcon size="20px" color="#4a4a4a" iconName="icon-export" />
        Share
      </ShareTool>
      <Menu
        id="share-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={closeShareMenu}
      >
        <MenuItem onClick={exportCsv}>Export CSV</MenuItem>
        <Tooltip title="Copied!" placement="right-start" open={open}>
          <MenuItem onClick={shareReport}>Share Report</MenuItem>
        </Tooltip>
      </Menu>
    </Container>
  );
};

Toolbar.defaultProps = {
  filterCount: 0,
  columnsCount: 0,
  isCollapsed: false
};

export default Toolbar;
