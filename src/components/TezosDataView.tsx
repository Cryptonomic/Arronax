import * as React from 'react';
import { DataView } from '../types';
import { TezosBlockView } from './TezosBlockView';
import { TezosAccountView } from './TezosAccountView';
import { TezosOperationView } from './TezosOperationView';

interface TezosDataProps {
    dataView: DataView;
    id: string;
}

interface TezosDataState {

}

export class TezosDataView extends React.Component<TezosDataProps, TezosDataState> {

    constructor(props: TezosDataProps) {
        super(props);
        this.state = {};
    }

    public render() {
        if (this.props.dataView === DataView.Blocks) {
            return(
                <TezosBlockView id={this.props.id}/>
            );
        } else if (this.props.dataView === DataView.Accounts) {
            return(
                <TezosAccountView id={this.props.id}/>
            );
        } else {
            return(
                <TezosOperationView id={this.props.id}/>
            );
        }
    }
}