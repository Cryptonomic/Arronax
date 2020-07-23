export interface Props {
    
    classes: any;
    loadHourlyTransactions: (date: number) => void;
    hourlytransactions: Transactions[]
}

export interface States {
    
}

export interface Transactions {
    count_kind: string;
    timestamp: number;
}
