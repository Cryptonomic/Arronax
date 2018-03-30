import { ConseilFilter } from './Conseil';

export interface ArronaxState {
    filters: ConseilFilter;
    mode: Mode;
    dataView: DataView;
    network: string;
}

export enum Mode {Basic, Advanced}

export enum DataView {Blocks, Accounts, Operations}
