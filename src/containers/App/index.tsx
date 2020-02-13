import React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { EntityDefinition } from 'conseiljs';
import ReactDynamicImport from 'react-dynamic-import';
import Header from '../../components/Header';
import SettingsPanel from '../../components/SettingsPanel';
import Footer from '../../components/Footer';
import Toolbar from '../../components/Toolbar';
import CustomTable from '../CustomTable';
import ConfigModal from '../../components/ConfigModal';
import Loader from '../../components/Loader';

import { getItemByPrimaryKey } from '../../reducers/app/thunks';

import {
  getLoading,
  getConfigs,
  getSelectedConfig,
  getEntity,
  getItems,
  getModalItem,
  getIsFullLoaded,
  getFilterCount,
  getColumns,
  getEntities,
  getAggregations,
  getAttributesAll
} from '../../reducers/app/selectors';
import { getErrorState, getMessageTxt } from '../../reducers/message/selectors';
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

import { ToolType, Config } from '../../types';
import octopusSrc from '../../assets/sadOctopus.svg';

const entityloader = (f: any) => import(`../Entities/${f}`);

const Container = styled.div`
  padding: 50px 0;
  min-height: calc(100vh - 405px);
`;

const MainContainer = styled.div`
  position: relative;
  min-height: 100vh;
`;

const TabContainer = styled.div`
  padding: 0px 15px;
  width: 100%;
`;

const NoResultContainer = styled.div`
  width: 100%;
  padding-top: 67px;
  display: flex;
  justify-content: center;
`;

const OctopusImg = styled.img`
  height: 183px;
  width: 169px;
`;

const NoResultContent = styled.div`
  margin-left: 38px;
  padding-top: 16px;
`;

const NoResultTxt = styled.div`
  color: rgb(42, 57, 115);
  font-size: 28px;
  font-weight: 500;
  line-height: 30px;
`;

const TryTxt = styled.div`
  color: rgb(155, 155, 155);
  font-size: 18px;
  font-weight: 500;
  line-height: 21px;
  margin-top: 8px;
`;

const ButtonContainer = styled.div`
  display: flex;
  margin-top: 24px;
`;

const CustomButton = styled.div`
  cursor: pointer;
  border-radius: 9px;
  height: 42px;
  width: 158px;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
`;

const ClearButton = styled(CustomButton)`
  border: 2px solid rgb(0, 196, 220);
  color: rgb(0, 196, 220);
`;

const TryButton = styled(CustomButton)`
  color: white;
  background: rgb(86, 194, 217);
  margin-left: 22px;
`;

const DismissButton = styled(CustomButton)`
  color: white;
  background: rgb(86, 194, 217);
`;

const TabsWrapper = withStyles({
  root: {
    borderBottom: 'none',
  },
  indicator: {
    backgroundColor: '#a6dfe2',
    height: '5px'
  },
})(Tabs);

const TabWrapper = withStyles({
  root: {
    textTransform: 'capitalize',
    padding: 0,
    minWidth: '50px',
    fontWeight: 300,
    color: '#2e3b6c',
    fontSize: '24px',
    letterSpacing: '3px',
    maxWidth: '500px',
    marginRight: '50px',
    '&$selected': {
      fontWeight: 'normal',
    },
  },
  selected: {},
})(Tab);

const DialogContentWrapper = withStyles({
  root: {
    minWidth: '350px'
  }
})(DialogContent);

interface OwnProps {
  isLoading: boolean;
  configs: Config[];
  selectedConfig: Config;
  selectedEntity: string;
  items: object[];
  isFullLoaded: boolean;
  filterCount: number;
  aggCount: number;
  selectedColumns: EntityDefinition[];
  entities: EntityDefinition[];
  isError: boolean;
  message: string;
  attributes: any;
  selectedModalItem: object;
  removeAllFilters: (entity: string) => void;
  changeNetwork(config: Config): void;
  changeTab: (type: string) => void;
  initLoad: (p: string, n: string, e: string, i: string, t: boolean) => any;
  submitQuery: () => void;
  exportCsvData: ()=> void;
  shareReport: ()=> void;
  initMessage: ()=> void;
  addConfig: (config: Config, isUse: boolean) => void;
  removeConfig: (index: number) => void;
  searchById: (id: string | number) => any;
  getModalItemAction: (entity: string, key: string, value: string | number) => void;
}

interface States {
  isSettingCollapsed: boolean;
  selectedTool: string;
  isModalUrl: boolean;
  isOpenConfigMdoal: boolean;
  isOpenEntityModal: boolean;
  searchedEntity: string;
  searchedItem: any[];
  primaryKeyClicked: boolean
}

interface RouteComponentWithParmas extends RouteComponentProps {
  match: {
    params: Record<string, string>
    path: string
    url: string
    isExact: boolean
  }
}

type Props = OwnProps & RouteComponentWithParmas & WithTranslation;

class Arronax extends React.Component<Props, States> {
  static defaultProps: any = {
    items: []
  };
  settingRef: any = null;
  tableRef: any = null;
  EntityModal: any = null;
  constructor(props: Props) {
    super(props);
    this.state = {
      primaryKeyClicked: false,
      isSettingCollapsed: false,
      selectedTool: ToolType.FILTER,
      isModalUrl: false,
      isOpenConfigMdoal: false,
      isOpenEntityModal: false,
      searchedEntity: '',
      searchedItem: []
    };

    this.settingRef = React.createRef();
    this.tableRef = React.createRef();
  }

  async componentDidMount() {
    const { initLoad, match, history, selectedConfig } = this.props;
    const { url, params: { platform, network, entity, id } } = match;
    const isQuery = url.includes('/query/');
    const [redirect, changePath, openModal] = await initLoad(platform, network, entity, id, isQuery);
    redirect && history.replace(defaultPath);
    changePath && history.push(`/${platform}/${network}/${entity}`);
    if (openModal && openModal.items && openModal.items.length > 0) {
      const { platform, network } = selectedConfig;
      const modalName = getEntityModalName(platform, network, openModal.entity);
      this.EntityModal = ReactDynamicImport({ name: modalName, loader: entityloader });
      this.setState({
        searchedItem: openModal.items, 
        searchedEntity: openModal.entity, 
        isOpenEntityModal: true, 
        primaryKeyClicked: false
      });
    };
  }

  componentDidUpdate(prevProps: Props) {
    const { 
      match: { params: { entity: prevRouteEntity } },
      selectedEntity: prevSelectedEntity
    } = prevProps;
    const { 
      match: { params: { entity: currRouteEntity } },
      selectedEntity: currSelectedEntity,
      isError 
    } = this.props;
    if (!isError && prevSelectedEntity === currSelectedEntity && prevRouteEntity !== currRouteEntity) {
      this.onChangeTab(currRouteEntity);
    }
  }

  updateRoute = (entity?: string, replace?: boolean) => {
    const { 
      selectedConfig: { platform, network }, 
      selectedEntity, 
      history 
    } = this.props;
    const url = `/${platform}/${network}/${entity || selectedEntity}`;

    if (replace) {
      history.replace(url);
      return;
    }
    history.push(url);
  }

  onChangeNetwork = (config: Config) => {
    const { changeNetwork } = this.props;
    changeNetwork(config);
  };

  onChangeTab = async (value: string) => {
    const { selectedEntity, changeTab } = this.props;
    if (value === selectedEntity) return;
    try {
      await changeTab(value);
      this.settingRef.current.onChangeHeight();
    } catch (e) {
      this.updateRoute(selectedEntity, true);
    }
  };

  onClickTab = (value: string) => {
    const { selectedEntity } = this.props;
    if (value === selectedEntity) return;
    this.updateRoute(value)
  }

  onChangeTool = async (tool: string) => {
    const { isSettingCollapsed, selectedTool } = this.state;
    if (isSettingCollapsed && selectedTool !== tool) {
      this.setState({ selectedTool: tool });
    } else if (!isSettingCollapsed && selectedTool !== tool) {
      this.setState({ isSettingCollapsed: !isSettingCollapsed, selectedTool: tool });
    } else {
      this.setState({ isSettingCollapsed: !isSettingCollapsed });
    }
  }

  onSettingCollapse = () => {
    const { isSettingCollapsed } = this.state;
    this.setState({ isSettingCollapsed: !isSettingCollapsed });
  };

  onCloseFilter = () => {
    this.setState({ isSettingCollapsed: false });
  };

  onResetFilters = () => {
    const {
      removeAllFilters,
      selectedEntity
    } = this.props;
    removeAllFilters(selectedEntity);
  };

  onSubmit = async () => {
    const { submitQuery } = this.props;
    this.onCloseFilter();
    await submitQuery();
  };

  onClearFilter = async () => {
    const {
      removeAllFilters,
      selectedEntity,
      submitQuery
    } = this.props;
    await removeAllFilters(selectedEntity);
    await submitQuery();
  }

  onExportCsv = async () => {
    const { exportCsvData } = this.props;
    exportCsvData();
  }

  onShareReport = () => {
    const { shareReport } = this.props;
    shareReport();
  }

  handleErrorClose = () => {
    const { initMessage } = this.props;
    initMessage();
  }

  closeConfigModal = () => this.setState({isOpenConfigMdoal: false});

  openConfigModal = () => this.setState({isOpenConfigMdoal: true});

  onAddConfig = (config: Config, isUse: boolean) => {
    const { addConfig } = this.props;
    addConfig(config, isUse);
    this.closeConfigModal();
  }

  onSearchById = async (val: string | number) => {
    const { searchById, selectedConfig } = this.props;
    const realVal = !Number(val) ? val : Number(val);
    const { entity, items } = await searchById(realVal);
    if (items.length > 0 && entity) {
      const { platform, network } = selectedConfig;
      const modalName = getEntityModalName(platform, network, entity);
      this.EntityModal = ReactDynamicImport({ name: modalName, loader: entityloader });
      this.setState({searchedItem: items, searchedEntity: entity, isOpenEntityModal: true, primaryKeyClicked: false });
    }
  }

  onClickPrimaryKey = (entity: string, key: string, value: string | number) => {
    const { searchedEntity } = this.state;
    const { getModalItemAction, selectedConfig } = this.props;
    if (searchedEntity === entity) return;
    const { platform, network } = selectedConfig;
    const modalName = getEntityModalName(platform, network, entity);
    this.EntityModal = ReactDynamicImport({ name: modalName, loader: entityloader });
    getModalItemAction(entity, key, value);
    this.setState({ searchedEntity: entity, primaryKeyClicked: true });
  }

  onCloseEntityModal = () => {
    this.setState({isOpenEntityModal: false});
    this.updateRoute('', true);
  };

  render() {
    const {
      isLoading,
      configs,
      selectedConfig,
      selectedEntity,
      items,
      selectedModalItem,
      isFullLoaded,
      filterCount,
      aggCount,
      selectedColumns,
      entities,
      isError,
      message,
      removeConfig,
      attributes,
      t
    } = this.props;
    const {
      isSettingCollapsed, selectedTool, isModalUrl, isOpenConfigMdoal, isOpenEntityModal,
      searchedItem, searchedEntity, primaryKeyClicked
    } = this.state;
    const { EntityModal } = this;
    const isRealLoading = isLoading || !isFullLoaded;
    const selectedObjectEntity: any = entities.find(entity => entity.name === searchedEntity);

    const modalItems = primaryKeyClicked ? selectedModalItem : searchedItem;
    
    return (
      <MainContainer>
        <Header
          selectedConfig={selectedConfig}
          configs={configs}
          onChangeNetwork={this.onChangeNetwork}
          openModal={this.openConfigModal}
          onRemoveConfig={removeConfig}
          onSearch={this.onSearchById}
        />
        <Container>
          {isFullLoaded && (
            <React.Fragment>
              <TabsWrapper
                value={selectedEntity}
                variant='scrollable'
                onChange={(event, newValue) => this.onClickTab(newValue)}
              >
                {entities.map((entity, index) => (
                  <TabWrapper
                    key={index}
                    value={entity.name}
                    label={t(`containers.arronax.${entity.name}`)}
                  />
                ))}
              </TabsWrapper>
              <Toolbar
                isCollapsed={isSettingCollapsed}
                selectedTool={selectedTool}
                filterCount={filterCount}
                aggCount={aggCount}
                columnsCount={selectedColumns.length}
                onChangeTool={this.onChangeTool}
                onExportCsv={this.onExportCsv}
                onShareReport={this.onShareReport}
              />
              <SettingsPanel
                ref={this.settingRef}
                isCollapsed={isSettingCollapsed}
                selectedTool={selectedTool}
                onSubmit={this.onSubmit}
                onClose={this.onCloseFilter}
              />
              <TabContainer>
                {items.length > 0 && <CustomTable isModalUrl={isModalUrl} isLoading={isLoading} items={items} onExportCsv={this.onExportCsv} /> }
                {items.length === 0 && isFullLoaded && (
                  <NoResultContainer>
                    <OctopusImg src={octopusSrc} />
                    <NoResultContent>
                      <NoResultTxt>{t('containers.arronax.no_results')}</NoResultTxt>
                      <TryTxt>{t('containers.arronax.try_combination')}</TryTxt>
                      <ButtonContainer>
                        <ClearButton onClick={this.onClearFilter}>{t('containers.arronax.clear_filters')}</ClearButton>
                        <TryButton onClick={this.onSettingCollapse}>{t('containers.arronax.try_again')}</TryButton>
                      </ButtonContainer>
                    </NoResultContent>
                  </NoResultContainer>
                )}
              </TabContainer>
            </React.Fragment>
          )}
        </Container>
        <Footer />
        {isRealLoading && <Loader />}
        <Dialog
          open={isError}
          onClose={this.handleErrorClose}
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
            <DismissButton onClick={this.handleErrorClose}>{t('general.verbs.dismiss')}</DismissButton>
          </DialogActions>
        </Dialog>
        <ConfigModal
          t={t}
          open={isOpenConfigMdoal}
          onClose={this.closeConfigModal}
          addConfig={this.onAddConfig}
        />
        {isOpenEntityModal && 
          <EntityModal
            open={isOpenEntityModal}
            title={selectedObjectEntity.displayName}
            attributes={attributes[searchedEntity]}
            items={modalItems}
            isLoading={isLoading}
            onClose={this.onCloseEntityModal}
            onClickPrimaryKey={this.onClickPrimaryKey}
          />
        }
      </MainContainer>
    );
  }
}

const mapStateToProps = (state: any) => ({
  filterCount: getFilterCount(state),
  isLoading: getLoading(state),
  configs: getConfigs(state),
  selectedConfig: getSelectedConfig(state),
  selectedEntity: getEntity(state),
  selectedModalItem: getModalItem(state),
  items: getItems(state),
  isFullLoaded: getIsFullLoaded(state),
  selectedColumns: getColumns(state),
  entities: getEntities(state),
  isError: getErrorState(state),
  message: getMessageTxt(state),
  aggCount: getAggregations(state).length,
  attributes: getAttributesAll(state)
});

const mapDispatchToProps = (dispatch: any) => ({
  removeAllFilters: (selectedEntity: string) =>
  dispatch(removeAllFiltersAction(selectedEntity)),
  changeNetwork: (config: Config) => dispatch(changeNetwork(config)),
  changeTab: (type: string) => dispatch(changeTab(type)),
  initLoad: (p: string, n: string, e: string, i: string, t: boolean) => dispatch(initLoad(p, n, e, i, t)),
  submitQuery: () => dispatch(submitQuery()),
  exportCsvData: () => dispatch(exportCsvData()),
  shareReport: () => dispatch(shareReport()),
  initMessage: () => dispatch(clearMessageAction()),
  addConfig: (config: Config, isUse: boolean) => dispatch(addConfigAction(config, isUse)),
  removeConfig: (index: number) => dispatch(removeConfigAction(index)),
  searchById: (id: string | number) => dispatch(searchByIdThunk(id)),
  getModalItemAction: (entity: string, key: string, value: string | number) => dispatch(getItemByPrimaryKey(entity, key, value)),
});

export const ArronaxApp: any = compose(
  withTranslation(),
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Arronax);
