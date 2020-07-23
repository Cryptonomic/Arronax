import React from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import Header from '../../components/Header';
import SettingsPanel from '../../components/SettingsPanel';
import Footer from '../../components/Footer';
import Toolbar from '../../components/Toolbar';
import CustomTable from '../CustomTable';
import ConfigModal from '../../components/ConfigModal';
import Loader from '../../components/Loader';
import Tabs from '../../components/Tabs';
import FilterResults from '../../components/FilterResults';
import CustomPaginator from '../../components/CustomPaginator';
import { fetchItemByPrimaryKey } from '../../reducers/modal/thunk';
import {
    getLoading,
    getConfigs,
    getSelectedConfig,
    getEntity,
    getItems,
    getIsFullLoaded,
    getFilterCount,
    getColumns,
    getEntities,
    getAggregations,
    getRows,
} from '../../reducers/app/selectors';
import DynamicModal from '../Modal';
import { getModal } from '../../reducers/modal/selectors';
import { getErrorState, getMessageTxt } from '../../reducers/message/selectors';
import { initLoad, submitQuery, exportCsvData, shareReport, changeTab, searchByIdThunk } from '../../reducers/app/thunks';
import { removeAllFiltersAction, addConfigAction, removeConfigAction } from '../../reducers/app/actions';
import { clearMessageAction } from '../../reducers/message/actions';
import { defaultPath, reQuery } from '../../router/routes';
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
    DialogContentWrapper,
} from './styles';

import { ToolType, Config } from '../../types';
import { Props, States } from './types';

class Arronax extends React.Component<Props, States> {
    static defaultProps: any = {
        items: [],
    };
    settingRef: any = null;
    tableRef: any = null;
    EntityModal: any = null;
    constructor(props: Props) {
        super(props);
        this.state = {
            isSettingCollapsed: false,
            selectedTool: ToolType.FILTER,
            isOpenConfigMdoal: false,
            page: 0,
        };

        this.settingRef = React.createRef();
        this.tableRef = React.createRef();
    }

    async componentDidMount() {
        window.addEventListener('beforeunload', this.onBeforeunload.bind(this));
        const { initLoad } = this.props;
        const loadProps = this.getLoadProps();
        await initLoad(loadProps);
    }

    componentDidUpdate(prevProps: Props) {
        const {
            match: {
                params: { platform: prevPlatform, network: prevNetwork, entity: prevEntity },
            },
        } = prevProps;
        const {
            match: {
                params: { platform: currPlatform, network: currNetwork, entity: currEntity },
            },
            initLoad,
            isLoading,
            isFullLoaded,
        } = this.props;

        if ((isFullLoaded && !isLoading && prevPlatform !== currPlatform) || prevNetwork !== currNetwork) {
            const loadProps = this.getLoadProps();
            initLoad(loadProps);
            return;
        }

        if (isFullLoaded && !isLoading && prevPlatform === currPlatform && prevNetwork === currNetwork && prevEntity !== currEntity) {
            this.onChangeTab(currEntity);
        }
    }

    componentWillUnmount() {
        window.removeEventListener('beforeunload', this.onBeforeunload.bind(this));
    }

    updateRoute = (replace?: boolean, entity?: string, id?: string | number) => {
        const {
            selectedConfig: { platform, network },
            selectedEntity,
            history,
        } = this.props;
        let url = `/${platform}/${network}/${entity || selectedEntity}${id ? '/' + id : ''}`;
        if (replace) {
            history.replace(url);
            return;
        }
        history.push(url);
    };

    getLoadProps() {
        const {
            history,
            location,
            configs,
            match: { url, params },
        } = this.props;
        const isSearchQuery = !!location.search && reQuery.test(location.search);
        const isQuery = !!isSearchQuery || url.includes('/query/');

        if (isSearchQuery) {
            const searchParams = new URLSearchParams(location.search);
            const [searchNetwork, searchEntity] = searchParams.get('e')?.split('/');
            const searchConfig = configs.find((c: Config) => c.displayName === searchNetwork);

            if (!searchConfig) {
                history.replace(defaultPath);
                return;
            }

            return {
                platform: searchConfig.platform,
                network: searchConfig.network,
                entity: searchEntity,
                id: searchParams.get('q'),
                isQuery,
                history,
            };
        }
        return { ...params, isQuery, history };
    }

    onChangeNetwork = async (config: Config) => {
        const { selectedEntity, history } = this.props;
        const { platform, network } = config;
        history.replace(`/${platform}/${network}/${selectedEntity}`);
    };

    onBeforeunload(e: any) {
        e.preventDefault();
        e.returnValue = true;
    }

    onChangeTab = async (value: string) => {
        const { selectedEntity, changeTab } = this.props;
        if (value === selectedEntity) return;
        try {
            await changeTab(value);
            this.settingRef.current.onChangeHeight();
        } catch (e) {
            this.updateRoute(true, selectedEntity);
        }
    };

    onClickTab = (value: string) => {
        this.updateRoute(false, value);
    };

    onChangeTool = async (tool: string) => {
        const { isSettingCollapsed, selectedTool } = this.state;
        if (isSettingCollapsed && selectedTool !== tool) {
            this.setState({ selectedTool: tool });
        } else if (!isSettingCollapsed && selectedTool !== tool) {
            this.setState({ isSettingCollapsed: !isSettingCollapsed, selectedTool: tool });
        } else {
            this.setState({ isSettingCollapsed: !isSettingCollapsed });
        }
    };

    onSettingCollapse = () => {
        const { isSettingCollapsed } = this.state;
        this.setState({ isSettingCollapsed: !isSettingCollapsed });
    };

    onCloseFilter = () => {
        this.setState({ isSettingCollapsed: false });
    };

    onResetFilters = () => {
        const { removeAllFilters, selectedEntity } = this.props;
        removeAllFilters(selectedEntity);
    };

    onSubmit = async () => {
        const { submitQuery } = this.props;
        this.onCloseFilter();
        await submitQuery();
    };

    onClearFilter = async () => {
        const { removeAllFilters, selectedEntity, submitQuery } = this.props;
        await removeAllFilters(selectedEntity);
        await submitQuery();
    };

    onExportCsv = async () => {
        const { exportCsvData } = this.props;
        exportCsvData();
    };

    onShareReport = () => {
        const { shareReport } = this.props;
        shareReport();
    };

    handleErrorClose = () => {
        const { initMessage } = this.props;
        initMessage();
    };

    closeConfigModal = () => this.setState({ isOpenConfigMdoal: false });

    openConfigModal = () => this.setState({ isOpenConfigMdoal: true });

    onAddConfig = (config: Config, isUse: boolean) => {
        const { addConfig } = this.props;
        addConfig(config, isUse);
        this.closeConfigModal();
    };

    onSearchById = async (val: string | number) => {
        const { searchById } = this.props;
        const realVal = !Number(val) ? val : Number(val);
        const { entity, items } = await searchById(realVal);
        if (items.length > 0 && entity) {
            this.updateRoute(true, '', val);
        }
    };

    onClickPrimaryKey = (entity: string, key: string, value: string | number) => {
        const {
            getModalItemAction,
            modal: { id },
        } = this.props;
        if (value === id) return;
        getModalItemAction(entity, key, value);
        this.updateRoute(true, '', value);
    };

    onCloseEntityModal = () => {
        this.updateRoute(true);
    };

    handleChangePage = (page: number) => {
        this.setState({ page });
    };

    render() {
        const {
            isLoading,
            configs,
            selectedConfig,
            selectedEntity,
            items,
            isFullLoaded,
            filterCount,
            aggCount,
            selectedColumns,
            entities,
            isError,
            message,
            removeConfig,
            t,
            rowsPerPage,
            modal: { open },
        } = this.props;
        const { isSettingCollapsed, selectedTool, isOpenConfigMdoal, page } = this.state;
        const isRealLoading = isLoading || !isFullLoaded;

        const fullTabsList = entities.map((entity) => entity.name);
        const shortTabsList = selectedConfig.entities || [];

        const rowCount = rowsPerPage !== null ? rowsPerPage : 10;
        const realRows = items.slice(page * rowCount, page * rowCount + rowCount);

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
                            <Tabs full={fullTabsList} short={shortTabsList} selected={selectedEntity} onChange={this.onClickTab} />
                            <FilterResults />
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
                            <CustomPaginator
                                rowsPerPage={rowCount}
                                page={page}
                                totalNumber={items.length}
                                onChangePage={this.handleChangePage}
                                onExportCsv={this.onExportCsv}
                            />
                            <SettingsPanel
                                ref={this.settingRef}
                                isCollapsed={isSettingCollapsed}
                                selectedTool={selectedTool}
                                onSubmit={this.onSubmit}
                                onClose={this.onCloseFilter}
                            />
                            <TabContainer>
                                {items.length > 0 && (
                                    <CustomTable
                                        isLoading={isLoading}
                                        items={realRows}
                                        onExportCsv={this.onExportCsv}
                                        updateRoute={this.updateRoute}
                                        onClickPrimaryKey={this.onClickPrimaryKey}
                                    />
                                )}
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
                <Dialog open={isError} onClose={this.handleErrorClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogTitle id="alert-dialog-title">{t('general.nouns.error')}</DialogTitle>
                    <DialogContentWrapper>
                        <DialogContentText id="alert-dialog-description">{message}</DialogContentText>
                    </DialogContentWrapper>
                    <DialogActions>
                        <DismissButton onClick={this.handleErrorClose}>{t('general.verbs.dismiss')}</DismissButton>
                    </DialogActions>
                </Dialog>
                <ConfigModal t={t} open={isOpenConfigMdoal} onClose={this.closeConfigModal} addConfig={this.onAddConfig} />
                {isFullLoaded && open && <DynamicModal onClickPrimaryKey={this.onClickPrimaryKey} onCloseEntityModal={this.onCloseEntityModal} />}
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
    items: getItems(state),
    isFullLoaded: getIsFullLoaded(state),
    selectedColumns: getColumns(state),
    entities: getEntities(state),
    isError: getErrorState(state),
    message: getMessageTxt(state),
    aggCount: getAggregations(state).length,
    rowsPerPage: getRows(state),
    modal: getModal(state),
});

const mapDispatchToProps = (dispatch: any) => ({
    removeAllFilters: (selectedEntity: string) => dispatch(removeAllFiltersAction(selectedEntity)),
    changeTab: (type: string) => dispatch(changeTab(type)),
    initLoad: (props: any) => dispatch(initLoad(props)),
    submitQuery: () => dispatch(submitQuery()),
    exportCsvData: () => dispatch(exportCsvData()),
    shareReport: () => dispatch(shareReport()),
    initMessage: () => dispatch(clearMessageAction()),
    addConfig: (config: Config, isUse: boolean) => dispatch(addConfigAction(config, isUse)),
    removeConfig: (index: number) => dispatch(removeConfigAction(index)),
    searchById: (id: string | number) => dispatch(searchByIdThunk(id)),
    getModalItemAction: (entity: string, key: string, value: string | number) => dispatch(fetchItemByPrimaryKey(entity, key, value)),
});

export const ArronaxApp: any = compose(withTranslation(), withRouter, connect(mapStateToProps, mapDispatchToProps))(Arronax);
