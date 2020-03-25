import React from 'react';
import { useTranslation } from 'react-i18next';

import { ToolType } from '../../types';

import {
  Container,
  FilterTool,
  ColumnsTool,
  AggTool,
  ShareTool,
  ExportTool,
  FilterIcon,
  ExportIcon,
  ColumnIcon,
  BadgeWrapper,
  TooltipWrapper
} from './styles';

import { ToolbarProps } from './types';

const Toolbar: React.FC<ToolbarProps> = props => {
  const { isCollapsed, selectedTool, filterCount, aggCount, columnsCount, onChangeTool, onExportCsv, onShareReport } = props;
  const [open, setOpen] = React.useState(false);
  const { t } = useTranslation();
  
  const shareReport = () => {
    setOpen(true);
    setTimeout(() => {
      onShareReport();
    });
    setTimeout(() => {
      setOpen(false);
    }, 2000);
  }

  const onClose = () => setOpen(false);

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
      <ExportTool aria-controls="share-menu" aria-haspopup="true" onClick={onExportCsv}>
        <ExportIcon size="20px" color="#4a4a4a" iconName="icon-download" />
        {t('components.toolBar.export')}
      </ExportTool>
      <TooltipWrapper PopperProps={{
            disablePortal: true
          }}
          onClose={onClose}
          open={open}
          disableFocusListener
          disableHoverListener
          disableTouchListener
          title="Copied!">
        <ShareTool aria-controls="share-menu" aria-haspopup="true" onClick={shareReport}>
          <ExportIcon size="20px" color="#4a4a4a" iconName="icon-share" />
          {t('components.toolBar.share')}
        </ShareTool>
      </TooltipWrapper>
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
