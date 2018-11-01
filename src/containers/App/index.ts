import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { TezosFilter } from 'conseiljs';
import Arronax from 'components/Arronax';
import { ArronaxState, GlobalStateMap } from 'types';
import { ArronaxAction, setFilter, setNetwork } from './actions';
import {
  makeSelectFilters,
  makeSelectNetwork,
} from './selectors';

interface DispatchToProps {
  setFilter(filters: TezosFilter): void;
  setNetwork(network: string): void;
}

const mapStateToProps = createStructuredSelector<
  GlobalStateMap,
  ArronaxState
>({
  filters: makeSelectFilters(),
  network: makeSelectNetwork()
});

const mapDispatchToProps = (
  dispatch: Dispatch<ArronaxAction>
): DispatchToProps => ({
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
