import React from 'react';
import { useTranslation } from 'react-i18next';
import Tooltip from '@material-ui/core/Tooltip';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { ToolType } from '../../types';

import {
  Container,
  FilterTool,
  ColumnsTool,
  AggTool,
  ShareTool,
  FilterIcon,
  ExportIcon,
  ColumnIcon,
  BadgeWrapper
} from './styles';

import { ToolbarProps } from './types';

const Toolbar: React.FC<ToolbarProps> = props => {
  const { isCollapsed, selectedTool, filterCount, aggCount, columnsCount, onChangeTool, onExportCsv, onShareReport } = props;
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { t } = useTranslation();
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

  function openShareMenu(event: any) {
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
        <BadgeWrapper color="secondary" badgeContent={filterCount}>
          {t('components.toolBar.filter')}
        </BadgeWrapper>
      </FilterTool>
      <ColumnsTool
        isactive={isCollapsed && selectedTool === ToolType.COLUMN}
        onClick={() => onChangeTool(ToolType.COLUMN)}
      >
        <ColumnIcon size="20px" color="#4a4a4a" iconName="icon-columns" />
        <BadgeWrapper color="secondary" badgeContent={columnsCount}>
          {t('components.toolBar.columns')}
        </BadgeWrapper>
      </ColumnsTool>
      <AggTool
        isactive={isCollapsed && selectedTool === ToolType.AGGREGATION}
        onClick={() => onChangeTool(ToolType.AGGREGATION)}
      >
        <ColumnIcon size="20px" color="#4a4a4a" iconName="icon-aggregate" />
        <BadgeWrapper color="secondary" badgeContent={aggCount}>
          {t('components.toolBar.aggregation')}
        </BadgeWrapper>
      </AggTool>
      <ShareTool aria-controls="share-menu" aria-haspopup="true" onClick={openShareMenu}>
        <ExportIcon size="20px" color="#4a4a4a" iconName="icon-export" />
        {t('components.toolBar.share')}
      </ShareTool>
      <Menu
        id="share-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={closeShareMenu}
      >
        <MenuItem onClick={exportCsv}>{t('components.toolBar.export_csv')}</MenuItem>
        <Tooltip title="Copied!" placement="right-start" open={open}>
          <MenuItem onClick={shareReport}>{t('components.toolBar.share_report')}</MenuItem>
        </Tooltip>
      </Menu>
    </Container>
  );
};

Toolbar.defaultProps = {
  filterCount: 0,
  columnsCount: 0,
  aggCount: 0,
  isCollapsed: false
};

export default Toolbar;
