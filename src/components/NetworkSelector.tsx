import * as React from 'react';

interface NetworkSelectorProps {
  network: string;
  setNetwork(network: string): void;
}

export class NetworkSelector extends React.Component<
  NetworkSelectorProps,
  object
> {
  public handleNetworkUpdate = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    this.props.setNetwork(event.target.value);
  }

  public render() {
    return (
      <div id="network-selector">
        <p>
          Network:
          <select
            value={this.props.network}
            onChange={this.handleNetworkUpdate}
          >
            <option>zeronet</option>
          </select>
        </p>
      </div>
    );
  }
}
