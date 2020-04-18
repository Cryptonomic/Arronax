import { WithTranslation } from 'react-i18next';

import { Config } from '../../types';

export interface DefaultProps extends WithTranslation {
    open: boolean;
    items: any[];
    attributes: any[];
    isLoading: boolean;
    title: string;
    selectedConfig: Config;
    onClose: () => void;
    onClickPrimaryKey: () => void;
}

export interface DefaultState {
    count: number;
}

export interface BlockProps extends WithTranslation {
    open: boolean;
    items: any[];
    subItems: any[];
    attributes: any[];
    opsAttributes: any[];
    isLoading: boolean;
    title: string;
    selectedConfig: Config;
    onClose: () => void;
    onClickPrimaryKey: () => void;
}

export interface BlockState {
    count: number;
    subItemsView: boolean;
}
