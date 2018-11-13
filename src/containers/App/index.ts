import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { TezosFilter } from 'conseiljs';
import Arronax from 'components/Arronax';
import { ArronaxState, GlobalStateMap } from 'types';
import { ArronaxAction, setFilter } from './actions';
import {
  makeSelectFilters,
  makeSelectNetwork,
} from './selectors';

interface DispatchToProps {
  setFilter(filters: TezosFilter, network: string): void;
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
  setFilter: (filters: TezosFilter, network: string) => {
    dispatch(setFilter(filters, network));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Arronax);
