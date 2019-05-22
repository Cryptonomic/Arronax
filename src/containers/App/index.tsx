import * as React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
  getLoading,
  getNetwork,
  getEntity,
  getItems,
  getIsFullLoaded,
  getFilterCount,
  getColumns
} from '../../reducers/app/selectors';
import {
  changeNetwork,
  initLoad,
  submitQuery,
  exportCsvData
} from '../../reducers/app/thunks';
import {
  setTabAction,
  removeAllFiltersAction,
} from '../../reducers/app/actions';
import Header from 'components/Header';
import SettingsPanel from 'components/SettingsPanel';
import Footer from 'components/Footer';
import Toolbar from 'components/Toolbar';
import CustomTable from '../CustomTable';

import { ToolType } from '../../types';

import * as octopusSrc from 'assets/sadOctopus.svg';

const Container = styled.div`
  padding: 50px 0;
  min-height: calc(100vh - 405px);
`;

const MainContainer = styled.div`
  position: relative;
  min-height: 100vh;
`;

const LoadingContainer = styled.div`
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.3);
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 100;
`;

const TabsWrapper = styled(Tabs)`
  &&& {
    padding: 0 30px;
    width: 100%;
    span[class*='MuiPrivateTabIndicator-root'] {
      background-color: #a6dfe2;
      height: 5px;
    }
  }
`;

const TabContainer = styled.div`
  padding: 0px 30px;
  width: 100%;
`;

const TabItem = styled.div`
  color: #2e3b6c;
  font-size: 24px;
  letter-spacing: 3px;
  font-weight: ${({ isSelected }) => (isSelected ? 'normal' : 300)};
  margin-right: 133px;
  margin-bottom: 7px;
  cursor: pointer;
`;

const FilterExTxt = styled.span`
  font-size: 18px;
  color: #9b9b9b;
  margin-left: 21px;
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

const tabsArray = [
  {
    value: 'blocks',
    title: 'Blocks',
  },
  {
    value: 'operations',
    title: 'Operations',
  },
  {
    value: 'accounts',
    title: 'Accounts',
  },
];

export interface Props {
  isLoading: boolean;
  network: string;
  selectedEntity: string;
  items: object[];
  isFullLoaded: boolean;
  filterCount: number;
  selectedColumns: any[];
  removeAllFilters: (entity: string) => void;
  changeNetwork(network: string): void;
  changeTab: (type: string) => void;
  initLoad: () => void;
  submitQuery: () => void;
  exportCsvData: ()=> void
}

export interface States {
  isSettingCollapsed: boolean;
  selectedTool: string
}

class Arronax extends React.Component<Props, States> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isSettingCollapsed: false,
      selectedTool: ToolType.FILTER
    };
  }

  componentDidMount() {
    const { initLoad } = this.props;
    initLoad();
  }

  onChangeNetwork = event => {
    const { changeNetwork } = this.props;
    changeNetwork(event.target.value);
  };

  onChangeTab = async (value: string) => {
    const { changeTab } = this.props;
    changeTab(value);
    await changeTab(value);
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


  render() {
    const {
      isLoading,
      network,
      selectedEntity,
      items,
      isFullLoaded,
      filterCount,
      selectedColumns
    } = this.props;
    const { isSettingCollapsed, selectedTool } = this.state;
    const isRealLoading = isLoading || (!isFullLoaded && items.length === 0);
    return (
      <MainContainer>
        <Header network={network} onChangeNetwork={this.onChangeNetwork} />
        <Container>
          <TabsWrapper value={selectedEntity}>
            {tabsArray.map((item, index) => (
              <Tab
                key={index}
                value={item.value}
                component={() => (
                  <TabItem
                    isSelected={selectedEntity === item.value}
                    onClick={() => this.onChangeTab(item.value)}
                  >
                    {item.title}
                  </TabItem>
                )}
              />
            ))}
          </TabsWrapper>
          <Toolbar
            isCollapsed={isSettingCollapsed}
            selectedTool={selectedTool}
            filterCount={filterCount}
            columnsCount={selectedColumns.length}
            onChangeTool={this.onChangeTool}
            onExportCsv={this.onExportCsv}
          />
          <SettingsPanel
            isCollapsed={isSettingCollapsed}
            selectedTool={selectedTool}
            onSubmit={this.onSubmit}
            onClose={this.onCloseFilter}
          />
          <TabContainer component="div">
            {items.length > 0 && <CustomTable isLoading={isLoading} items={items} onExportCsv={this.onExportCsv} /> }
            {(items.length === 0 && isFullLoaded) && (
              <NoResultContainer>
                <OctopusImg src={octopusSrc} />
                <NoResultContent>
                  <NoResultTxt>Sorry, your filters returned no results.</NoResultTxt>
                  <TryTxt>Try a different filter combination.</TryTxt>
                  <ButtonContainer>
                    <ClearButton onClick={this.onClearFilter}>Clear Filters</ClearButton>
                    <TryButton onClick={this.onSettingCollapse}>Try Again</TryButton>
                  </ButtonContainer>
                </NoResultContent>
              </NoResultContainer>
            )}
          </TabContainer>
        </Container>
        <Footer />
        {isRealLoading && (
          <LoadingContainer>
            <CircularProgress />
          </LoadingContainer>
        )}
      </MainContainer>
    );
  }
}

const mapStateToProps = (state: any) => ({
  filterCount: getFilterCount(state),
  isLoading: getLoading(state),
  network: getNetwork(state),
  selectedEntity: getEntity(state),
  items: getItems(state),
  isFullLoaded: getIsFullLoaded(state),
  selectedColumns: getColumns(state),
});

const mapDispatchToProps = dispatch => ({
  removeAllFilters: (selectedEntity: string) =>
    dispatch(removeAllFiltersAction(selectedEntity)),
  changeNetwork: (network: string) => dispatch(changeNetwork(network)),
  changeTab: (type: string) => dispatch(setTabAction(type)),
  initLoad: () => dispatch(initLoad()),
  submitQuery: () => dispatch(submitQuery()),
  exportCsvData: () => dispatch(exportCsvData())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Arronax);
