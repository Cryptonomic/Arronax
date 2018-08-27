import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { DataView } from '../types';
import { TezosBlockView } from './TezosBlockView';
import { TezosAccountView } from './TezosAccountView';
import { TezosOperationView } from './TezosOperationView';
import * as actions from '../actions';

interface TezosDataProps {
    dataView: DataView;
    network: string;
    id: string;
    setError:  (error: string) => actions.SetError;
}

interface TezosDataState {

}

class TezosDataView extends React.Component<TezosDataProps, TezosDataState> {

    constructor(props: TezosDataProps) {
        super(props);
        this.state = {};
    }

    public render() {
        switch (this.props.dataView) {
            case (DataView.Blocks):
                return(
                    <TezosBlockView id={this.props.id} network={this.props.network} setError={this.props.setError} />
                );
            case (DataView.Accounts):
                return(
                    <TezosAccountView id={this.props.id} network={this.props.network} setError={this.props.setError} />
                );
            case (DataView.Operations):
                return(
                    <TezosOperationView
                        id={this.props.id}
                        network={this.props.network}
                        setError={this.props.setError}
                    />
                );
            default:
                return(
                    <p>Invalid view!</p>
                );
        }
    }
}

function mapDispatchToProps(dispatch: Dispatch<actions.ArronaxAction>) {
    return {
        setError:  (error: string) => dispatch(actions.setError(error)),
    };
}

export default connect(mapDispatchToProps)(TezosDataView);