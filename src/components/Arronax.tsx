import * as React from 'react';
import { ArronaxState } from '../types/types';

export interface Props {
    state: ArronaxState;
    switchMode: () => void;
    switchTab:  () => void;
    setFilter:  () => void;
    resetAll:   () => void;
}

export const Arronax = (props: Props) =>
  <button onClick={props.switchMode}>I am in {props.state.mode} mode!</button>;
