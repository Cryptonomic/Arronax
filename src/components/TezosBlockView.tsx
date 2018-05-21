import * as React from 'react';
import { getBlock } from '../Conseil';

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

    refreshData(props: TezosBlockProps) {
        getBlock(this.props.network, this.props.id).
        then(value => this.setState({data: JSON.parse(decodeURI(value))}));
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