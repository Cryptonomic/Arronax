import * as React from 'react';
import { TezosConseilQuery } from 'conseiljs';
import config from '../config';

interface TezosOperationProps {
    network: string;
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

    async refreshData(props: TezosOperationProps) {
        const url = `${config.url}${this.props.network}`;
        const result = await TezosConseilQuery.getOperationGroup(url, this.props.id, config.key);
        this.setState({data: result});
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