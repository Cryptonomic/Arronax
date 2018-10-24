import * as React from 'react';
import { DataView } from 'types';
import { TezosBlockView } from 'components/TezosBlockView';
import { TezosAccountView } from 'components/TezosAccountView';
import { TezosOperationView } from 'components/TezosOperationView';

interface TezosDataProps {
  dataView: DataView;
  network: string;
  id: string;
}

export class TezosDataView extends React.Component<TezosDataProps> {
  public render() {
    switch (this.props.dataView) {
      case DataView.Blocks:
        return (
          <TezosBlockView id={this.props.id} network={this.props.network} />
        );
      case DataView.Accounts:
        return (
          <TezosAccountView id={this.props.id} network={this.props.network} />
        );
      case DataView.Operations:
        return (
          <TezosOperationView id={this.props.id} network={this.props.network} />
        );
      default:
        return <p>Invalid view!</p>;
    }
  }
}
