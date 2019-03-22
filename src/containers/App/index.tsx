import * as React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
  getAttributes,
  getLoading,
  getNetwork,
  getEntity,
  getItems,
  getColumns,
  getValue,
  getIsFullLoaded
} from '../../reducers/app/selectors';
import { changeNetwork, initLoad } from '../../reducers/app/thunks';
import { setTabAction, removeValueAction } from '../../reducers/app/actions';
import Header from 'components/Header';
import FilterTool from 'components/FilterTool';
import SettingsPanel from 'components/SettingsPanel';
import Footer from 'components/Footer';
import CustomTable from '../CustomTable';

const Container = styled.div`
  padding: 50px 0;
  min-height: calc(100vh - 405px);
`;

const MainContainer = styled.div`
  position: relative;
  min-height: 100vh;
`;

const LoadingContainer = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.3);
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const FilterHeader = styled.div`
  display: flex;
  align-items: center;
  opacity: ${({ isDark }) => (isDark ? 0.74 : 1)};
  padding: 25px 30px 0 30px;
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
  position: relative;
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
  selectedValues: object[];
  selectedEntity: string;
  items: object[];
  attributes: object[];
  selectedColumns: any[];
  isFullLoaded: boolean;
  removeValue: (value: object) => void;
  changeNetwork(network: string): void;
  changeTab: (type: string) => void;
  initLoad: () => void;
}

export interface States {
  isFilterCollapse: boolean;
}

class Arronax extends React.Component<Props, States> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isFilterCollapse: false,
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
    const { changeTab, selectedValues, removeValue } = this.props;
    selectedValues.forEach(value => {
      removeValue(value);
    });
    changeTab(value);
  };

  onFilterCollapse = () => {
    const { isFilterCollapse } = this.state;
    this.setState({ isFilterCollapse: !isFilterCollapse });
  };

  onCloseFilter = () => {
    this.setState({ isFilterCollapse: false });
  };

  render() {
    const {
      isLoading,
      network,
      selectedEntity,
      items,
      selectedColumns,
      isFullLoaded
    } = this.props;
    const { isFilterCollapse } = this.state;
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
          <SettingsPanel
            selectedColumns={selectedColumns}
            selectedEntity={selectedEntity}
            isCollapse={isFilterCollapse}
            onClose={this.onCloseFilter}
          />
          <FilterHeader isDark={isFilterCollapse}>
            <FilterTool value={2} onCollapse={this.onFilterCollapse} />
            <FilterExTxt>
              e.g. What were blocks where baked by Foudation Baker 1 in the past
              24 hours?
            </FilterExTxt>
          </FilterHeader>
          <TabContainer component="div">
            <CustomTable
              items={items}
              entity={selectedEntity}
              selectedColumns={selectedColumns}
            />
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
  selectedValues: getValue(state),
  selectedColumns: getColumns(state),
  isLoading: getLoading(state),
  network: getNetwork(state),
  selectedEntity: getEntity(state),
  items: getItems(state),
  attributes: getAttributes(state),
  isFullLoaded: getIsFullLoaded(state)
});

const mapDispatchToProps = dispatch => ({
  removeValue: (value: object) => dispatch(removeValueAction(value)),
  changeNetwork: (network: string) => dispatch(changeNetwork(network)),
  changeTab: (type: string) => dispatch(setTabAction(type)),
  initLoad: () => dispatch(initLoad()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Arronax);
