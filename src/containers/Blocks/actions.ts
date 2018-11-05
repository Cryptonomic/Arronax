import { TezosBlock } from 'types';
import { FETCH_BLOCKS, SET_BLOCKS } from './constants';

export interface FetchBlocks {
  type: FETCH_BLOCKS;
}

export interface SetBlocks {
  type: SET_BLOCKS;
  blocks: TezosBlock[];
}

export type BlocksAction = FetchBlocks | SetBlocks;

export const fetchBlocks = (): FetchBlocks => ({
  type: FETCH_BLOCKS
});

export const setBlocks = (blocks: TezosBlock[]): SetBlocks => ({
  blocks,
  type: SET_BLOCKS
});
