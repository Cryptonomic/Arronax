import * as React from 'react';

interface NetworkSelectorProps {
    network: string;
    setNetwork: (network: string) => void;
}

export class NetworkSelector extends React.Component<NetworkSelectorProps, Object> {

    constructor(props: NetworkSelectorProps) {
        super(props);
        this.state = {};
        this.handleNetworkUpdate = this.handleNetworkUpdate.bind(this);
    }

    handleNetworkUpdate(event: React.ChangeEvent<HTMLSelectElement>) {
        this.props.setNetwork(event.target.value);
    }

    public render() {
        return (
            <div id="network-selector">
                <h1>Arronax</h1>
                <p>
                Network:
                <select value={this.props.network} onChange={this.handleNetworkUpdate}>
                <option>alphanet</option>
                <option>zeronet</option>
                </select>
                </p>
            </div>
        );
    }
}