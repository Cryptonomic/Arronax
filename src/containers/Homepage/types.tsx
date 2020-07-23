export interface Props {
    
    classes: any;
    hourlytransactions: Transactions[];
    isError: boolean;
    message: string;
    loadHourlyTransactions: (date: number) => void;
    initMessage: () => void;
}

export interface States {
    
}

export interface Transactions {
    count_kind: string;
    timestamp: number;
}
