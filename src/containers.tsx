import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { createStructuredSelector } from 'reselect';
import { TezosFilter } from 'conseiljs';
import { Arronax } from './components/Arronax';
import { DataView, ArronaxImmutableState } from './types';
import { switchTab, setFilter, setNetwork, ArronaxAction } from './actions';
import {
  makeSelectFilters,
  makeSelectDataView,
  makeSelectNetwork,
} from './selectors';

interface ArronaxDispatchAction {
  switchTab(dataView: DataView): void;
  setFilter(filters: TezosFilter): void;
  setNetwork(network: string): void;
}

const mapStateToProps = createStructuredSelector<ArronaxImmutableState, any>({
  filters: makeSelectFilters,
  dataView: makeSelectDataView,
  network: makeSelectNetwork
});

const mapDispatchToProps = (
  dispatch: Dispatch<ArronaxAction>
): ArronaxDispatchAction => ({
  switchTab: (dataView: DataView) => {
    dispatch(switchTab(dataView));
  },
  setFilter: (filters: TezosFilter) => {
    dispatch(setFilter(filters));
  },
  setNetwork: (network: string) => {
    dispatch(setNetwork(network));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Arronax);
