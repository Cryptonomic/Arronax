export interface ToolbarProps {
  isCollapsed: boolean;
  selectedTool: string;
  filterCount: number;
  columnsCount: number;
  aggCount: number;
  onChangeTool: (tool: string) => void;
  onExportCsv: () => void;
  onShareReport: () => void;
}
