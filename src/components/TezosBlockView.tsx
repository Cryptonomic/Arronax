import * as React from 'react';
import { TezosConseilQuery } from 'conseiljs';
import { mainUrl } from '../constants';

interface TezosBlockProps {
    network: string;
    id: string;
}

interface TezosBlockState {
    data: object;
}

export class TezosBlockView extends React.Component<TezosBlockProps, TezosBlockState> {

    constructor(props: TezosBlockProps) {
        super(props);
        this.state = {data: {}};
        this.refreshData = this.refreshData.bind(this);
        this.refreshData(props);
    }

    async refreshData(props: TezosBlockProps) {
        const url = `${mainUrl}${this.props.network}`;
        const result = TezosConseilQuery.getBlock(url, this.props.id, 'hooman');
        this.setState({data: result});
    }

    componentWillReceiveProps(nextProps: TezosBlockProps) {
        this.refreshData(nextProps);
    }

    public render() {
        if (Object.keys(this.state.data).length === 0) {
            return (
                <p>Fetching Tezos block..</p>
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