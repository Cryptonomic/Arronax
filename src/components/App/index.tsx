import React, { useState, useEffect, createRef, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import ReactDynamicImport from 'react-dynamic-import';

import Header from '../Header';
import SettingsPanel from '../SettingsPanel';
import Footer from '../Footer';
import Toolbar from '../Toolbar';
import CustomTable from '../CustomTable';
import ConfigModal from '../ConfigModal';
import Loader from '../Loader';
import { getItemByPrimaryKey } from '../../reducers/app/thunks';
import {
  changeNetwork,
  initLoad,
  submitQuery,
  exportCsvData,
  shareReport,
  changeTab,
  searchByIdThunk
} from '../../reducers/app/thunks';
import { removeAllFiltersAction, addConfigAction, removeConfigAction } from '../../reducers/app/actions';
import { clearMessageAction } from '../../reducers/message/actions';
import { getEntityModalName } from '../../utils/hashtable';
import { defaultPath } from '../../router/routes';
import octopusSrc from '../../assets/sadOctopus.svg';

import { 
  Container,
  MainContainer,
  TabContainer,
  NoResultContainer,
  OctopusImg,
  NoResultContent,
  NoResultTxt,
  TryTxt,
  ButtonContainer,
  ClearButton,
  TryButton,
  DismissButton,
  TabsWrapper,
  TabWrapper,
  DialogContentWrapper
} from './styles';

import { Config } from '../../types';
import { RootState } from '../../reducers'
 
const entityloader = (f: any) => import(`../Entities/${f}`);

export const Arronax = (props: any) => {
  const [primaryKeyClicked, setPrimaryKeyClicked] = useState(false);
  const [settingCollapsed, setSettingCollapsed] = useState(false);
  const [openConfigModal, setOpenConfigModal] = useState(false);
  const [openEntityModal, setOpenEntityModal] = useState(false);
  const [selectedTool, setSelectedTool] = useState('filter');
  const [tabChanged, setTabChanged] = useState(false);
  const [searchedEntity, setSearchedEntity] = useState('');
  const [searchedItem, setSearchedItem] = useState([]);
  const [modalUrl] = useState(false);
  const filterCount = useSelector(({ app }: RootState) => app.filterCount[app.selectedEntity], shallowEqual);
  const isLoading = useSelector(({ app }: RootState) => app.isLoading, shallowEqual);
  const configs = useSelector(({ app }: RootState) => app.configs, shallowEqual);
  const selectedConfig = useSelector(({ app }: RootState) => app.selectedConfig, shallowEqual);
  const selectedEntity = useSelector(({ app }: RootState) => app.selectedEntity, shallowEqual);
  const selectedModalItem = useSelector(({ app }: RootState) => app.selectedModalItem, shallowEqual);
  const items = useSelector(({ app }: RootState) => app.items[app.selectedEntity], shallowEqual);
  const isFullLoaded = useSelector(({ app }: RootState) => app.isFullLoaded, shallowEqual);
  const selectedColumns = useSelector(({ app }: RootState) => app.columns[app.selectedEntity], shallowEqual);
  const aggregations = useSelector(({ app }: RootState) => app.aggregations[app.selectedEntity], shallowEqual);
  const attributes = useSelector(({ app }: RootState) => app.attributes, shallowEqual);
  const entities = useSelector(({ app }: RootState) => app.entities, shallowEqual);
  const isError = useSelector(({ message }: RootState) => message.isError, shallowEqual);
  const message = useSelector(({ message }: RootState) => message.message, shallowEqual);
  const settingRef: any = createRef();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const isRealLoading = isLoading || !isFullLoaded;
  const selectedObjectEntity: any = entities.find((entity: any) => entity.name === searchedEntity);
  const modalItems = primaryKeyClicked ? selectedModalItem : searchedItem;
  let EntityModal: any = useRef(null);

  useEffect(() => {
    (async () => {
      const { match, history } = props;
      const { url, params: { platform, network, entity, id } } = match;
      const isQuery = url.includes('/query/');
      const [redirect, changePath, openModal]: any = await dispatch(initLoad(platform, network, entity, id, isQuery));
      redirect && history.replace(defaultPath);
      changePath && history.push(`/${platform}/${network}/${entity}`);
      if (openModal && openModal.items && openModal.items.length > 0) {
        const { platform, network } = selectedConfig;
        const modalName = getEntityModalName(platform, network, openModal.entity);
        EntityModal.current = ReactDynamicImport({ name: modalName, loader: entityloader });
        setSearchedItem(openModal.items);
        setSearchedEntity(openModal.entity);
        setOpenEntityModal(true);
        setPrimaryKeyClicked(false);
      };
    })();
  }, []);

  useEffect(() => {
    if (!isError) {
      onChangeTab(props.match.params.entity);
    }
  }, [tabChanged]);

  const updateRoute = (replace?: boolean, entity?: string, id?: string | number) => {
    const { platform, network } = selectedConfig;
    const { history } = props;
    let url = `/${platform}/${network}/${entity || selectedEntity}${id ? '/' + id : ''}`;
    if (replace) {
      history.replace(url);
      return;
    }
    history.push(url);
  }

  const onChangeNetwork = async (config: Config) => {
    await dispatch(changeNetwork(config));
    updateRoute(true, selectedEntity)
  };

  const onChangeTab = async (value: string) => {
    if (value === selectedEntity) return;
    try {
      await dispatch(changeTab(value));
      settingRef.current.onChangeHeight();
    } catch (e) {
      updateRoute(true, selectedEntity);
    }
  };

  const onClickTab = (value: string) => {
    if (value === selectedEntity) return;
    setTabChanged(!tabChanged);
    updateRoute(false, value);
  }

  const onChangeTool = async (tool: string) => {
    if (settingCollapsed && selectedTool !== tool) {
      setSelectedTool(tool)
    } else if (!settingCollapsed && selectedTool !== tool) {
      setSettingCollapsed(!settingCollapsed);
      setSelectedTool(tool)
    } else {
      setSettingCollapsed(!settingCollapsed);
    }
  }

  const onSettingCollapse = () => setSettingCollapsed(!settingCollapsed);

  const onCloseFilter = () => setSettingCollapsed(false);

  const onSubmit = async () => {
    onCloseFilter();
    await dispatch(submitQuery());
  };

  const onClearFilter = async () => {
    await dispatch(removeAllFiltersAction(selectedEntity));
    await dispatch(submitQuery());
  };

  const onExportCsv = async () => await dispatch(exportCsvData());

  const onShareReport = async () => await dispatch(shareReport());

  const handleErrorClose = async () => await dispatch(clearMessageAction());

  const closeConfigModal = () => setOpenConfigModal(false);

  const onOpenConfigModal = () => setOpenConfigModal(true);

  const onAddConfig = (config: Config, isUse: boolean) => {
    dispatch(addConfigAction(config, isUse));
    closeConfigModal();
  }

  const onSearchById = async (val: string | number) => {
    const realVal = !Number(val) ? val : Number(val);
    const { entity, items }: any = await dispatch(searchByIdThunk(realVal));
    if (items.length > 0 && entity) {
      const { platform, network } = selectedConfig;
      const modalName = getEntityModalName(platform, network, entity);
      EntityModal.current = ReactDynamicImport({ name: modalName, loader: entityloader });
      setSearchedItem(items);
      setSearchedEntity(entity);
      setOpenEntityModal(true);
      setPrimaryKeyClicked(false);
      updateRoute(true, '', val);
    }
  }

  const onClickPrimaryKey = (entity: string, key: string, value: string | number) => {
    if (searchedEntity === entity) return;
    const { platform, network } = selectedConfig;
    const modalName = getEntityModalName(platform, network, entity);
    EntityModal.current = ReactDynamicImport({ name: modalName, loader: entityloader });
    dispatch(getItemByPrimaryKey(entity, key, value));
    setSearchedEntity(entity);
    setPrimaryKeyClicked(true);
    updateRoute(true, '', value);
  }

  const onCloseEntityModal = () => {
    setOpenEntityModal(false);
    updateRoute(true);
  };

  const onRemoveConfig = (index: number) => dispatch(removeConfigAction(index));

  return (
    <MainContainer>
    <Header
      selectedConfig={selectedConfig}
      configs={configs}
      onChangeNetwork={onChangeNetwork}
      openModal={onOpenConfigModal}
      onRemoveConfig={onRemoveConfig}
      onSearch={onSearchById}
    />
    <Container>
      {isFullLoaded && (
        <>
          <TabsWrapper
            value={selectedEntity}
            variant='scrollable'
            onChange={(event, newValue) => onClickTab(newValue)}
          >
            {entities.map((entity: any, index: any) => (
              <TabWrapper
                key={index}
                value={entity.name}
                label={t(`containers.arronax.${entity.name}`)}
              />
            ))}
          </TabsWrapper>
          <Toolbar
            isCollapsed={settingCollapsed}
            selectedTool={selectedTool}
            filterCount={filterCount}
            aggCount={aggregations.length}
            columnsCount={selectedColumns.length}
            onChangeTool={onChangeTool}
            onExportCsv={onExportCsv}
            onShareReport={onShareReport}
          />
          <SettingsPanel
            ref={settingRef}
            isCollapsed={settingCollapsed}
            selectedTool={selectedTool}
            onSubmit={onSubmit}
            onClose={onCloseFilter}
          />
          <TabContainer>
            {items.length > 0 && 
              <CustomTable 
                isModalUrl={modalUrl} 
                isLoading={isLoading} 
                items={items} 
                onExportCsv={onExportCsv}
                updateRoute={updateRoute}
              /> 
            }
            {items.length === 0 && isFullLoaded && (
              <NoResultContainer>
                <OctopusImg src={octopusSrc} />
                <NoResultContent>
                  <NoResultTxt>{t('containers.arronax.no_results')}</NoResultTxt>
                  <TryTxt>{t('containers.arronax.try_combination')}</TryTxt>
                  <ButtonContainer>
                    <ClearButton onClick={onClearFilter}>{t('containers.arronax.clear_filters')}</ClearButton>
                    <TryButton onClick={onSettingCollapse}>{t('containers.arronax.try_again')}</TryButton>
                  </ButtonContainer>
                </NoResultContent>
              </NoResultContainer>
            )}
          </TabContainer>
        </>
      )}
    </Container>
    <Footer />
    {isRealLoading && <Loader />}
    <Dialog
      open={isError}
      onClose={handleErrorClose}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
    >
      <DialogTitle id='alert-dialog-title'>{t('general.nouns.error')}</DialogTitle>
      <DialogContentWrapper>
        <DialogContentText id='alert-dialog-description'>
          {message}
        </DialogContentText>
      </DialogContentWrapper>
      <DialogActions>
        <DismissButton onClick={handleErrorClose}>{t('general.verbs.dismiss')}</DismissButton>
      </DialogActions>
    </Dialog>
    <ConfigModal
      t={t}
      open={openConfigModal}
      onClose={closeConfigModal}
      addConfig={onAddConfig}
    />
    {openEntityModal && EntityModal &&
      <EntityModal
        open={openEntityModal}
        title={selectedObjectEntity.displayName}
        attributes={attributes[searchedEntity]}
        items={modalItems}
        isLoading={isLoading}
        onClose={onCloseEntityModal}
        onClickPrimaryKey={onClickPrimaryKey}
      />
    }
  </MainContainer>
  )
};

export default withRouter(Arronax);