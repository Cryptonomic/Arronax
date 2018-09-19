import * as React from 'react';
import { TezosConseilQuery } from 'conseiljs';
import config from '../config';

interface TezosOperationProps {
  network: string;
  id: string;
}

interface TezosOperationState {
  data: object;
}

export class TezosOperationView extends React.Component<
  TezosOperationProps,
  TezosOperationState
> {
  public constructor(props: TezosOperationProps) {
    super(props);
    this.state = { data: {} };
    this.refreshData(props);
  }

  public refreshData = async (props: TezosOperationProps): Promise<void> => {
    const url = `${config.url}${this.props.network}`;
    const result: object = await TezosConseilQuery.getOperationGroup(
      url,
      this.props.id,
      config.key
    );
    this.setState({ data: result });
  }

  public componentWillReceiveProps(nextProps: TezosOperationProps) {
    this.refreshData(nextProps);
  }

  public render() {
    if (this.state.data === {}) {
      return <p>Fetching Tezos operation..</p>;
    } else {
      const INDENT = 2;

      return <pre>{JSON.stringify(this.state.data, undefined, INDENT)}</pre>;
    }
  }
}
