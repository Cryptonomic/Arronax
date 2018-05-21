import * as React from 'react';
import { getAccount } from '../Conseil';

interface TezosAccountProps {
    network: string;
    id: string;
}

interface TezosAccountState {
    data: object;
}

export class TezosAccountView extends React.Component<TezosAccountProps, TezosAccountState> {

    constructor(props: TezosAccountProps) {
        super(props);
        this.state = {data: {}};
        this.refreshData = this.refreshData.bind(this);
        this.refreshData(props);
    }

    refreshData(props: TezosAccountProps) {
        getAccount(this.props.network, this.props.id).
        then(value => this.setState({data: JSON.parse(decodeURI(value))}));
    }

    componentWillReceiveProps(nextProps: TezosAccountProps) {
        this.refreshData(nextProps);
    }

    public render() {
        if (this.state.data === {}) {
            return (
                <p>Fetching Tezos account..</p>
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