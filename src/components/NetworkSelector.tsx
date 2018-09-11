import * as React from 'react';
interface NetworkSelectorProps {
    network: string;
    setNetwork: (network: string) => void;
}

const NetworkSelector = (props: NetworkSelectorProps) => {
    const { network, setNetwork } = props;
    return (
        <div id="network-selector">
            <p>
            Network:
            <select value={network} onChange={(event) => setNetwork(event.target.value)}>
                <option>zeronet</option>
                <option>betanet</option>
            </select>
            </p>
        </div>
    );
};

export default NetworkSelector;
