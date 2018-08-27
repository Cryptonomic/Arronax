import * as React from 'react';
import { TezosConseilQuery } from 'conseiljs';
import config from '../config';
import * as actions from '../actions';

interface TezosOperationProps {
    network: string;
    id: string;
    setError:  (error: string) => actions.SetError;
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
        const result = await TezosConseilQuery.getOperationGroup(url, this.props.id, config.key)
        .catch( (error) => {
            console.log('-debug: Error in: getOperationGroup:');
            console.error(error);
            props.setError(error.message);
            return {};
        });
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