import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Arronax } from './components/Arronax';
import { ArronaxState, DataView } from './types';
import { switchTab, setFilter, setNetwork } from './actions';
import { TezosFilter } from 'conseiljs';

interface DispatchFromProps {
  switchTab(dataView: DataView): void;
  setFilter(filters: TezosFilter): void;
  setNetwork(network: string): void;
}

const mapStateToProps = (state: ArronaxState): ArronaxState => ({
  filters: state.filters,
  dataView: state.dataView,
  network: state.network
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchFromProps => ({
  switchTab: (dataView: DataView): void => {
    dispatch(switchTab(dataView));
  },
  setFilter: (filters: TezosFilter): void => {
    dispatch(setFilter(filters));
  },
  setNetwork: (network: string): void => {
    dispatch(setNetwork(network));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Arronax);
