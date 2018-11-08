import * as React from 'react';
import { Select } from 'antd';

interface NetworkSelectorProps {
  network: string;
  setNetwork(network: string): void;
}

const Option = Select.Option;

export class NetworkSelector extends React.Component<
  NetworkSelectorProps,
  object
> {
  public handleNetworkUpdate = (value) => {
    this.props.setNetwork(value);
  }

  public render() {
    return (
      <div id="network-selector">
          <label htmlFor="selector">Network:</label>
          <Select
            value={this.props.network}
            onChange={this.handleNetworkUpdate}
          >
            <Option value="zeronet">Zeronet</Option>
            <Option value="mainnet">Mainnet</Option>
          </Select>
      </div>
    );
  }
}
