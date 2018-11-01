import { connect } from 'react-redux';
import { compose, Dispatch } from 'redux';
import { createStructuredSelector } from 'reselect';
import injectReducer from 'utils/injectReducer.js';
import injectSaga from 'utils/injectSaga.js';
import OperationsGrid from 'components/OperationsGrid';
import { makeSelectFilters } from 'containers/App/selectors';
import { GlobalStateMap } from 'types';
import { fetchOperations, OperationsAction } from './actions';
import { makeSelectOperations, makeSelectFetching } from './selectors';
import reducer from './reducer';
import saga from './saga';

interface DispatchToProps {
  fetchOperations(): void;
}

const mapStateToProps = createStructuredSelector<GlobalStateMap, any>({
  operations: makeSelectOperations(),
  filters: makeSelectFilters(),
  fetching: makeSelectFetching()
});

const mapDispatchToProps = (
  dispatch: Dispatch<OperationsAction>
): DispatchToProps => ({
  fetchOperations: () => {
    dispatch(fetchOperations());
  }
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);
const withReducer = injectReducer({ key: 'operations', reducer });
const withSaga = injectSaga({ key: 'operations', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect
)(OperationsGrid);
