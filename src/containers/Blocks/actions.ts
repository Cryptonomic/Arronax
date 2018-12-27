import { TezosBlock } from 'types';
import {FETCH_BLOCKS, FETCH_BLOCKS_FAILED, SET_BLOCKS} from './constants';

export interface FetchBlocks {
  type: FETCH_BLOCKS;
}

export interface SetBlocks {
  type: SET_BLOCKS;
  blocks: TezosBlock[];
}

export interface FetchBlocksFailed {
  type: FETCH_BLOCKS_FAILED;
  error: string;
}

export type BlocksAction = FetchBlocks | SetBlocks | FetchBlocksFailed;

export const fetchBlocks = (): FetchBlocks => ({
  type: FETCH_BLOCKS
});

export const setBlocks = (blocks: TezosBlock[]): SetBlocks => ({
  blocks,
  type: SET_BLOCKS
});

export  const fetchBlocksFailed = (error: string): FetchBlocksFailed => ({
    type: FETCH_BLOCKS_FAILED,
    error
});
