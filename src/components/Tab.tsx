import * as React from 'react';
import { TezosConseilQuery, TezosFilter } from 'conseiljs';
import { DataView } from 'types';
import { ExpandableGrid } from 'components/ExpandableGrid';
import config from 'config';

interface TabProps {
  dataView: DataView;
  hidden: boolean;
  filters: TezosFilter;
  network: string;
}

interface TabState {
  data: object[];
}

export class Tab extends React.Component<TabProps, TabState> {
  public constructor(props: TabProps) {
    super(props);
    this.state = { data: [] };
    this.refreshData(props);
  }

  public refreshData = async (nextProps: TabProps) => {
    if (!nextProps.hidden) {
      const { getAccounts, getOperations, getBlocks } = TezosConseilQuery;
      let results;
      const apiKey = config.key;
      const url = `${config.url}${this.props.network}`;
      if (this.props.dataView === DataView.Operations) {
        results = await getOperations(url, nextProps.filters, apiKey);
      } else if (this.props.dataView === DataView.Accounts) {
        results = await getAccounts(url, nextProps.filters, apiKey);
      } else {
        results = await getBlocks(url, nextProps.filters, apiKey);
      }
      this.setState({ data: results });
    }
  }

  public componentWillReceiveProps(nextProps: TabProps) {
    this.refreshData(nextProps);
  }

  public render() {
    return (
      <div id="blocksPanel" hidden={this.props.hidden}>
        <ExpandableGrid
          dataView={this.props.dataView}
          network={this.props.network}
          data={this.state.data}
        />
      </div>
    );
  }
}
