export enum Mode {Basic, Advanced}

export enum DataView {Blocks, Accounts, Operations}

export interface Filter {
    blockID: String,
    accountID: String,
    operationID: String
}

export interface ArronaxState {
    filters: Filter,
    mode: Mode,
    dataView: DataView
}
