import * as React from 'react';
import { DataView } from '../types';
import { TezosDataView } from './TezosDataView';

interface ExpandableGridRowProps {
  dataView: DataView;
  network: string;
  data: object;
  rowNumber: number;
}

interface ExpandableGridRowState {
  isExpanded: boolean;
  expandedData: object;
}

export class ExpandableGridRow extends React.Component<
  ExpandableGridRowProps,
  ExpandableGridRowState
> {
  public constructor(props: ExpandableGridRowProps) {
    super(props);
    this.state = { isExpanded: false, expandedData: {} };
  }

  public handleOnClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    this.setState({ isExpanded: !this.state.isExpanded });
  }

  public inferID(data: object, dataView: DataView) {
    const hash = 'hash';
    const accountId = 'accountId';
    const groupHash = 'operationGroupHash';
    if (dataView === DataView.Blocks) {
      return data[hash];
    } else if (dataView === DataView.Operations) {
      return data[groupHash];
    } else if (dataView === DataView.Accounts) {
      return data[accountId];
    }
  }

  public render() {
    if (!this.state.isExpanded) {
      return (
        <tr key={`row+${this.props.rowNumber}`}>
          <td>
            <button onClick={this.handleOnClick}>+</button>
          </td>
          {Object.keys(this.props.data).map((value, index) => (
            <td key={`row+${this.props.rowNumber}::col${index}`}>
              {this.props.data[value]}
            </td>
          ))}
        </tr>
      );
    } else {
      return (
        <tr key={`row+${this.props.rowNumber}`}>
          <td>
            <button onClick={this.handleOnClick}>-</button>
          </td>
          <td>
            <TezosDataView
              dataView={this.props.dataView}
              network={this.props.network}
              id={this.inferID(this.props.data, this.props.dataView)}
            />
          </td>
        </tr>
      );
    }
  }
}
