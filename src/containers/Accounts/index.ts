import { connect } from 'react-redux';
import { compose, Dispatch } from 'redux';
import { createStructuredSelector } from 'reselect';
import injectReducer from 'utils/injectReducer.js';
import injectSaga from 'utils/injectSaga.js';
import AccountsGrid from 'components/AccountsGrid';
import { makeSelectFilters } from 'containers/App/selectors';
import { GlobalStateMap } from 'types';
import { fetchAccounts, AccountsAction } from './actions';
import { makeSelectAccounts, makeSelectFetching, makeSelectError } from './selectors';
import reducer from './reducer';
import saga from './saga';

interface DispatchToProps {
  fetchAccounts(): void;
}

const mapStateToProps = createStructuredSelector<GlobalStateMap, any>({
  accounts: makeSelectAccounts(),
  filters: makeSelectFilters(),
  fetching: makeSelectFetching(),
  error: makeSelectError()
});

const mapDispatchToProps = (
  dispatch: Dispatch<AccountsAction>
): DispatchToProps => ({
  fetchAccounts: () => {
    dispatch(fetchAccounts());
  }
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);
const withReducer = injectReducer({ key: 'accounts', reducer });
const withSaga = injectSaga({ key: 'accounts', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect
)(AccountsGrid);
