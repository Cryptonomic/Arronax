export interface ArronaxState {
    filters: FilterGroup;
    mode: Mode;
    dataView: DataView;
}

export enum Mode {Basic, Advanced}

export enum DataView {Blocks, Accounts, Operations}

export interface FilterGroup {
    blockID: String;
    accountID: String;
    operationID: String;
}
