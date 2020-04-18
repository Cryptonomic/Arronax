import { Sort, Config, Aggregation } from '../../types';

export interface Props {
    items: any[];
    selectedColumns: any[];
    selectedConfig: Config;
    selectedEntity: string;
    isLoading: boolean;
    selectedSort: Sort;
    isModalUrl?: boolean;
    aggregations: Aggregation[];
    onExportCsv: () => void;
    onSubmitQuery: () => void;
    onSetSort: (entity: string, sorts: Sort[]) => void;
    onClickPrimaryKey: (entity: string, key: string, value: string | number) => void;
    updateRoute: (redirect?: boolean, entity?: string, id?: string | number) => void;
}

export interface State {
    tableDetails: any;
}
