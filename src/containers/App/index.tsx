import * as React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import { getLoading, getNetwork, getTab } from '../../reducers/app/selectors';
import {changeNetwork} from '../../reducers/app/thunks';
import { setTabAction } from '../../reducers/app/actions';
import SidePanel from '../SidePanel';
import DataPanel from '../DataPanel';
import Header from 'components/Header';
import FilterTool from 'components/FilterTool';
import FilterPanel from 'components/FilterPanel';

const Container = styled.div`
    padding: 50px 0;
`;

const MainContainer = styled.div`
    position: relative;
    background: #f0f2f5;
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
    opacity: ${({ isDark }) => isDark ? 0.74 : 1};
    padding: 25px 30px 0 30px;
`;

const TabsWrapper = styled(Tabs)`
    &&& {
        padding: 0 30px;
        width: 100%;
        span[class*='MuiPrivateTabIndicator-root'] {
            background-color: #A6DFE2;
            height: 5px;
        }
    }

`;

const TabContainer = styled(Typography)`

`;

const TabItem = styled.div`
    color: #2E3B6C;
    font-size: 24px;
    letter-spacing: 3px;
    font-weight: ${({ isSelected }) => isSelected ? 'normal' : 300};
    margin-right: 133px;
    margin-bottom: 7px;
    cursor: pointer;
`;

const FilterExTxt = styled.span`
    font-size: 18px;
    color: #9B9B9B;
    margin-left: 21px;
`;

const tabsArray = [
  {
    value: 'blocks',
    title: 'Blocks'
  },
  {
    value: 'operations',
    title: 'Operations'
  },
  {
    value: 'accounts',
    title: 'Accounts'
  }
];

export interface Props {
    isLoading: boolean;
    network: string;
    selectedTab: string;
    changeNetwork(network: string): void;
    changeTab: (type: string) => void;
}

export interface States {
    isFilterCollapse: boolean;
}

class Arronax extends React.Component<Props, States> {
    constructor(props: Props) {
        super(props);
        this.state = {
            isFilterCollapse: false
        }
    }

    onChangeNetwork = (event) => {
        const {changeNetwork} = this.props;
        changeNetwork(event.target.value);
    }

    onChangeTab = (value) => {
        // const {changeTab, fetchItems} = this.props;
        const {changeTab} = this.props;
        changeTab(value);
        // fetchItems(value);    
    }

    onFilterCollapse = () => {
        const {isFilterCollapse} = this.state;
        this.setState({isFilterCollapse: !isFilterCollapse});
    }

    onCloseFilter = () => {
        this.setState({isFilterCollapse: false});
    }

    render() {
        const {isLoading, network, selectedTab} = this.props;
        const {isFilterCollapse} = this.state;
        return (
            <MainContainer>
                <Header network={network} onChangeNetwork={this.onChangeNetwork}/>
                <Container>
                    <TabsWrapper
                        value={selectedTab}
                    >
                        {tabsArray.map((item, index) => (
                            <Tab
                                key={index}
                                value={item.value}
                                component={() => (
                                    <TabItem
                                        isSelected={selectedTab===item.value}
                                        onClick={() => this.onChangeTab(item.value)}
                                    >
                                        {item.title}
                                    </TabItem>)}
                            />
                        ))}
                    </TabsWrapper>
                    <FilterPanel isCollapse={isFilterCollapse} onClose={this.onCloseFilter} />
                    <FilterHeader isDark={isFilterCollapse}>
                        <FilterTool value={2} onCollapse={this.onFilterCollapse} />
                        <FilterExTxt>e.g. What were blocks where baked by Foudation Baker 1 in the past 24 hours?</FilterExTxt>
                    </FilterHeader>
                    <TabContainer component="div">
                        {/* <CustomTable items={items} category={selectedTab} /> */}
                    </TabContainer>
                </Container>
                {isLoading && 
                    <LoadingContainer>
                        <CircularProgress />
                    </LoadingContainer>
                }
            </MainContainer>
            
        )

        
    }
}

const mapStateToProps = (state: any) => ({
  isLoading: getLoading(state),
  network: getNetwork(state),
  selectedTab: getTab(state)
});

const mapDispatchToProps = (dispatch) => ({
    changeNetwork: (network: string) => dispatch(changeNetwork(network)),
    changeTab: (type: string) => dispatch(setTabAction(type))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Arronax);
