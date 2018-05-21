import * as React from 'react';
import { DataView } from '../types';
import { TezosBlockView } from './TezosBlockView';
import { TezosAccountView } from './TezosAccountView';
import { TezosOperationView } from './TezosOperationView';

interface TezosDataProps {
    dataView: DataView;
    network: string;
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
        switch (this.props.dataView) {
            case (DataView.Blocks):
                return(
                    <TezosBlockView id={this.props.id} network={this.props.network}/>
                );
            case (DataView.Accounts):
                return(
                    <TezosAccountView id={this.props.id} network={this.props.network}/>
                );
            case (DataView.Operations):
                return(
                    <TezosOperationView id={this.props.id} network={this.props.network} />
                );
            default:
                return(
                    <p>Invalid view!</p>
                );
        }
    }
}