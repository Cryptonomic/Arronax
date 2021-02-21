import { Config } from '../../types';
import { RouteComponentProps } from 'react-router-dom';

export interface OwnProps {
    
    classes: any;
    hourlytransactions: Transactions[];
    isError: boolean;
    message: string;
    topAccounts: Accounts[];
    topBakers: Bakers[];
    isTransactionsLoading: boolean;
    isTopAccountsLoading: boolean;
    isTopBakersLoading: boolean;
    selectedConfig: Config;
    configs: Config[];
    selectedEntity: string;
    hourlytransactionsUrl: string,
    topAccountsUrl: string,
    topBakersUrl: string,
    loadHourlyTransactions: (date: number) => void;
    initMessage: () => void;
    fetchTopAccounts: (limit: number) => void;
    fetchTopBakers: (date: number, limit: number) => void;
    removeConfig: (index: number) => void;
    searchById: (id: string | number) => any;
}

export interface States {
    showLogo: boolean,
    isOpenConfigModal: boolean
}

export type Props = OwnProps & RouteComponentProps;

export interface Transactions {
    count_kind: string;
    timestamp: number;
}

export interface Accounts {
    account_id: string;
    balance: number;
}

export interface Bakers {
    count_hash: string,
    baker: string,
}

