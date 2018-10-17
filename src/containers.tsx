import { Arronax } from 'components/Arronax';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { createStructuredSelector } from 'reselect';
import { TezosFilter } from 'conseiljs';
import { switchTab, setFilter, setNetwork, ArronaxAction } from './actions';
import {
  makeSelectFilters,
  makeSelectDataView,
  makeSelectNetwork
} from './selectors';

const mapStateToProps = createStructuredSelector({
  filters: makeSelectFilters,
  dataView: makeSelectDataView,
  network: makeSelectNetwork
});

function mapDispatchToProps(dispatch: Dispatch<ArronaxAction>) {
  return {
    switchTab: (dataView: DataView) => dispatch(switchTab(dataView)),
    setFilter: (filters: TezosFilter) => dispatch(setFilter(filters)),
    setNetwork: (network: string) => dispatch(setNetwork(network))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Arronax);
