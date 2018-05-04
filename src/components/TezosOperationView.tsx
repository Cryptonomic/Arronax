import * as React from 'react';
import { getOperation } from '../Conseil';

interface TezosOperationProps {
    id: string;
}

interface TezosOperationState {
    data: object;
}

export class TezosOperationView extends React.Component<TezosOperationProps, TezosOperationState> {

    constructor(props: TezosOperationProps) {
        super(props);
        this.state = {data: {}};
        this.refreshData = this.refreshData.bind(this);
        this.refreshData(props);
    }

    refreshData(props: TezosOperationProps) {
        getOperation('alphanet', this.props.id).
        then(value => this.setState({data: JSON.parse(decodeURI(value))}));
    }

    componentWillReceiveProps(nextProps: TezosOperationProps) {
        this.refreshData(nextProps);
    }

    public render() {
        if (this.state.data === {}) {
            return (
                <p>Fetching Tezos operation..</p>
            );
        } else {
            return (
                <pre>
                    {JSON.stringify(this.state.data, null, 2)}
                </pre>
            );
        }
    }
}