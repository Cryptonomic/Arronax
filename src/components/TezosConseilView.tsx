import * as React from 'react';
import { TezosConseilQuery } from 'conseiljs';
import config from '../config';

interface TezosConseilProps {
    network: string;
    id: string;
    type: string;
}

interface TezosConseilState {
    data: object;
}

export default class TezosConseilView extends React.Component<TezosConseilProps, TezosConseilState> {

    constructor(props: TezosConseilProps) {
        super(props);
        this.state = {data: {}};
        this.refreshData = this.refreshData.bind(this);
        this.refreshData(props);
    }

    async refreshData(props: TezosConseilProps) {
        const { type, id, network } = props;
        const url = `${config.url}${network}`;        
        let result;
        switch (type) {
            case 'account':
                result = await TezosConseilQuery.getAccount(url, id, config.key);
                break;
            case 'block':
                result = await TezosConseilQuery.getBlock(url, id, config.key);
                break;
            default:
                result = await TezosConseilQuery.getOperationGroup(url, id, config.key);
                break;
        }
        this.setState({data: result});
    }

    componentDidUpdate(prevProps: TezosConseilProps, prevState: TezosConseilState) {
        if (prevProps.network !== this.props.network || prevProps.id !== this.props.id) {
            this.refreshData(this.props);
        }
    }

    public render() {
        if (this.state.data === {}) {
            return (
                <p>Fetching Tezos {this.props.type}..</p>
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