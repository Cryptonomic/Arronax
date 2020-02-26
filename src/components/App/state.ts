import { useReducer, useCallback } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { withRouter, useHistory } from 'react-router-dom';

import {
  changeNetwork,
  initLoad,
  submitQuery,
  exportCsvData,
  shareReport,
  changeTab,
  searchByIdThunk
} from '../../reducers/app/thunks';

import { RootState } from '../../reducers'
import { Config } from '../../types';

const initialState = {
  primaryKeyClicked: false,
  settingCollapsed: false,
  openConfigModal: false,
  openEntityModal: false,
  tabChanged: false,
  modalUrl: false,
  selectedTool: 'filter',
  searchedEntity: '',
  searchedItem: []
};

const appStateReducer = (currentState: any, payload: any) => ({
  ...currentState,
  ...payload
})

const useAppState = () => {
  const [appState, dispatchAppState] = useReducer(appStateReducer, initialState);
  const reduxState = {
    filterCount: useSelector(({ app }: RootState) => app.filterCount[app.selectedEntity], shallowEqual),
    isLoading: useSelector(({ app }: RootState) => app.isLoading, shallowEqual),
    configs: useSelector(({ app }: RootState) => app.configs, shallowEqual),
    selectedConfig: useSelector(({ app }: RootState) => app.selectedConfig, shallowEqual),
    selectedEntity: useSelector(({ app }: RootState) => app.selectedEntity, shallowEqual),
    selectedModalItem: useSelector(({ app }: RootState) => app.selectedModalItem, shallowEqual),
    items: useSelector(({ app }: RootState) => app.items[app.selectedEntity], shallowEqual),
    isFullLoaded: useSelector(({ app }: RootState) => app.isFullLoaded, shallowEqual),
    selectedColumns: useSelector(({ app }: RootState) => app.columns[app.selectedEntity], shallowEqual),
    aggregations: useSelector(({ app }: RootState) => app.aggregations[app.selectedEntity], shallowEqual),
    attributes: useSelector(({ app }: RootState) => app.attributes, shallowEqual),
    entities: useSelector(({ app }: RootState) => app.entities, shallowEqual),
    isError: useSelector(({ message }: RootState) => message.isError, shallowEqual),
    message: useSelector(({ message }: RootState) => message.message, shallowEqual),
  };
  const dispatch = useDispatch();
  const history = useHistory();

  const updateAppState = useCallback((payload: any) => 
    dispatchAppState({
      ...payload
    }), []);

  const updateRoute = (replace?: boolean, entity?: string, id?: string | number) => {
    const { selectedConfig: { platform, network }, selectedEntity } = appState;
    let url = `/${platform}/${network}/${entity || selectedEntity}${id ? '/' + id : ''}`;
    if (replace) {
      history.replace(url);
      return;
    }
    history.push(url);
  }

  const onChangeNetwork = useCallback(async (config: Config) => {
    const { selectedEntity } = appState; 
    await dispatch(changeNetwork(config));
    // updateRoute(true, selectedEntity)
  }, []);

  return [
    { ...reduxState },
    { ...appState }, 
    { 
      updateAppState,
      onChangeNetwork
    }
  ]
}

export default useAppState;