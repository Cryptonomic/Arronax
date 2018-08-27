import { Arronax } from './components/Arronax';
import { connect, Dispatch } from 'react-redux';
import { ArronaxState, DataView } from './types';
import * as actions from './actions';
import { TezosFilter } from 'conseiljs';

function mapStateToProps(state: ArronaxState) {
    return {
        'filters': state.filters,
        'dataView': state.dataView,
        'network': state.network,
        'error': state.error
    };
}

function mapDispatchToProps(dispatch: Dispatch<actions.ArronaxAction>) {
    return {
        switchTab:  (dataView: DataView) => dispatch(actions.switchTab(dataView)),
        setFilter:  (filters: TezosFilter) => dispatch(actions.setFilter(filters)),
        setNetwork: (network: string) => dispatch(actions.setNetwork(network)),
        clearError: () => dispatch(actions.setError(''))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Arronax);
