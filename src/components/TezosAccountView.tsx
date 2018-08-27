import * as React from 'react';
import { TezosConseilQuery } from 'conseiljs';
import config from '../config';
import * as actions from '../actions';

interface TezosAccountProps {
    network: string;
    id: string;
    setError:  (error: string) => actions.SetError;
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

    async refreshData(props: TezosAccountProps) {
        const url = `${config.url}${this.props.network}`;
        const result = await TezosConseilQuery.getAccount(url, this.props.id, config.key)
        .catch( (error) => {
            console.log('-debug: Error in: getAccount:');
            console.error(error);
            props.setError(error.message);
            return {};
        });
        this.setState({data: result});
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