import { Arronax } from './components/Arronax';
import { connect, Dispatch } from 'react-redux';
import { ArronaxState, DataView } from './types';
import * as actions from './actions';
import { ConseilFilter } from './Conseil';

export function mapStateToProps(state: ArronaxState) {
    return {'state': state};
}

export function mapDispatchToProps(dispatch: Dispatch<actions.ArronaxAction>) {
    return {
        switchMode: () => dispatch(actions.switchMode()),
        switchTab:  (dataView: DataView) => dispatch(actions.switchTab(dataView)),
        setFilter:  (filters: ConseilFilter) => dispatch(actions.setFilter(filters)),
        resetAll:   () => dispatch(actions.resetAll())
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Arronax);
