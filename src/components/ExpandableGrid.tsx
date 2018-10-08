import * as React from 'react';
import { DataView } from 'types';
import { ExpandableGridRow } from 'components/ExpandableGridRow';

interface ExpandableGridPops {
  dataView: DataView;
  network: string;
  data: object[];
}

interface ExpandableGridState {
  expansions: Map<string, string>;
}

export class ExpandableGrid extends React.Component<
  ExpandableGridPops,
  ExpandableGridState
> {
  public constructor(props: ExpandableGridPops) {
    super(props);
    this.state = { expansions: new Map<string, string>() };
  }

  public render() {
    if (this.props.data.length !== 0) {
      return (
        <table>
          <tbody>
            <tr key="header">
              <th>Expand</th>
              {Object.keys(this.props.data[0]).map(value => (
                <th key={value}>{value}</th>
              ))}
            </tr>
            {this.props.data.map((row, index) => (
              <ExpandableGridRow
                key={`gridrow-${index}`}
                dataView={this.props.dataView}
                network={this.props.network}
                data={row}
                rowNumber={index}
              />
            ))}
          </tbody>
        </table>
      );
    } else {
      return <p>No data to render!</p>;
    }
  }
}
