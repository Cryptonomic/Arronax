export interface Props {
    
    classes: any;
    hourlytransactions: Transactions[];
    isError: boolean;
    message: string;
    topAccounts: Accounts[];
    topBakers: Bakers[];
    isTransactionsLoading: boolean;
    isTopAccountsLoading: boolean;
    isTopBakersLoading: boolean;
    loadHourlyTransactions: (date: number) => void;
    initMessage: () => void;
    fetchTopAccounts: (limit: number) => void;
    fetchTopBakers: (date: number, limit: number) => void;
}

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

