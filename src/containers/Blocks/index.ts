import { connect } from 'react-redux';
import { compose, Dispatch } from 'redux';
import { createStructuredSelector } from 'reselect';
import injectReducer from 'utils/injectReducer.js';
import injectSaga from 'utils/injectSaga.js';
import BlocksGrid from 'components/BlocksGrid';
import { makeSelectFilters } from 'containers/App/selectors';
import { GlobalStateMap } from 'types';
import { fetchBlocks, BlocksAction } from './actions';
import { makeSelectBlocks, makeSelectFetching } from './selectors';
import reducer from './reducer';
import saga from './saga';

interface DispatchToProps {
  fetchBlocks(): void;
}

const mapStateToProps = createStructuredSelector<GlobalStateMap, any>({
  blocks: makeSelectBlocks(),
  filters: makeSelectFilters(),
  fetching: makeSelectFetching()
});

const mapDispatchToProps = (
  dispatch: Dispatch<BlocksAction>
): DispatchToProps => ({
  fetchBlocks: () => {
    dispatch(fetchBlocks());
  }
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);
const withReducer = injectReducer({ key: 'blocks', reducer });
const withSaga = injectSaga({ key: 'blocks', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect
)(BlocksGrid);
