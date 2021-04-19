import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withRouter, Link } from 'react-router-dom';
import * as d3 from 'd3';
import moment from 'moment';

import { 
    Padding,
    Title,
    ContentHolder,
    Paragraph,
    ImageHolder,
    WhiteBg,
    SectionTitle,
    ListItem,
    ListContainer,
    styles,
    BannerHolder,
    MapHolder,
    AnchorTag
} from './style';
import {
    DismissButton,
    DialogContentWrapper,
} from '../App/styles';
import { Config } from '../../types';
import Banner from '../../components/Home/Banner';
import Header from '../../components/Home/Header';
import {chartGenerator} from '../../utils/chartGenerator';
import { loadHourlyTransactions, fetchTopAccounts, fetchTopBakers, searchByIdThunk} from '../../reducers/app/thunks';
import {
    getHourlyTransactionsLoading,
    getHourlyTransactions,
    getHourlyTransactionsUrl,
    getTopAccounts,
    getTopAccountsUrl,
    getTopAccountsLoading,
    getTopBakers,
    getTopBakersUrl,
    getTopBakersLoading,
    getSelectedConfig,
    getConfigs,
    getEntity
} from '../../reducers/app/selectors';
import { getErrorState, getMessageTxt } from '../../reducers/message/selectors';
import { clearMessageAction } from '../../reducers/message/actions';
import { removeConfigAction } from '../../reducers/app/actions';

import AskIcon from '../../assets/icons/ask_question_icon.svg';
import AggregatedDataIcon from '../../assets/icons/aggregated_data_icon.svg';
import ExportQueriesIcon from '../../assets/icons/export_queries_icon.svg';
import ThoughtBubbleIcon from '../../assets/icons/thought_bubble_icon.svg';
import PlaceholderImage from '../../assets/images/placeholder.png';
import PlaceholderImage1 from '../../assets/images/placeholder1.png';
import PlaceholderImage2 from '../../assets/images/placeholder2.png';
import link_icon from '../../assets/images/link_icon.svg'

import { Props, States, Transactions, Accounts, Bakers } from './types';

import Footer from '../../components/Footer';

class Home extends React.Component<Props, States> {

    transactionPerHour: any = null;
    topAccountsRef: any = null;
    topBakersRef: any = null;
    topAccountsAxisRef: any = null;
    actionBtnRef: any = null;
    container: any = null;

    constructor(props: Props) {
        super(props);
        
        this.transactionPerHour = React.createRef();
        this.topAccountsRef = React.createRef();
        this.topBakersRef = React.createRef();
        this.topAccountsAxisRef = React.createRef();
        this.actionBtnRef = React.createRef();
        this.container = React.createRef();

        this.state = {
            showLogo: false,
            isOpenConfigModal: false
        };
    }

    async componentDidMount() {
        const prevDate = new Date(); 
        // subtract one day from current time
        prevDate.setDate(prevDate.getDate() - 1);

        this.fetchHourlyTransactions(prevDate);
        this.getTopTransactions();
        this.getTopBakers(prevDate);

        // On scoll Add logo after certain position from Top
        window.addEventListener('scroll', this.handleScroll.bind(this), true);
    }

    async fetchHourlyTransactions(prevDate: Date) {
        const { loadHourlyTransactions } = this.props;

        await loadHourlyTransactions(prevDate.getTime());
        let {data, label, timestamps } = await this.formatHourlyTransactions(this.props.hourlytransactions, prevDate.getTime());
        this.generateHourlyTransactionsGraph(data, label, timestamps);
    }

    async formatHourlyTransactions(transactionsList: Transactions[], date: number) {
        const label: Array<Date> = [],
        timestamps: Array<number> = [],
        values: Array<number> = [],
        data: Array<any> = [];
        const now = new Date().getTime();

        for(var time = new Date(date).getTime(); time < now; time += 3600000) {
            label.push(new Date(time));
            timestamps.push(time);
            values.push(0)
        }

        for(let r = 0; r < transactionsList.length; r++) {
            for(let t = label.length - 1; t > 0; t--) {
                if(transactionsList[r].timestamp > label[t].getTime()) {
                    values[t] += parseInt(transactionsList[r].count_kind);
                    break;
                }
            }
        }  

        for(var x = 0; x < values.length; x++) {
            data.push({date : label[x].getTime(), values : values[x] });
        }

        const dummyData: object = { date: data[0].date, values: 0 };
        data.unshift(dummyData);
        return {data, label, timestamps};

    }

    async generateHourlyTransactionsGraph(data: Array<any>, label: Array<any>, timestamps: Array<any>) {
        const svg = d3.select(this.transactionPerHour.current);
        const width = this.container.current ? this.container.current.offsetWidth : 0;

        chartGenerator.seperateAxisPrioritizedBarChartGenerator(215, width, svg, data, 'date', 'values', 'rgba(135, 194, 205, 0.58639)', 'Time (hour)', 'XTZ (ꜩ)', 8, false);

        const xTooltip = function(d: any, i: number) {
            return moment(timestamps[i]).format("YYYY MMM DD, HH:mm");
        }

        const yTooltip = function(d: any, i: number) {
            return d.toLocaleString() + ' XTZ';
        }

        chartGenerator.barGraphFloatingTooltipGenerator(svg, xTooltip, yTooltip);
    }

    async getTopTransactions() {
        const { fetchTopAccounts } = this.props;
        // Fetch top ten
        await fetchTopAccounts(10);
        this.generateTopAccountGraph(this.props.topAccounts);
    }

    generateTopAccountGraph(topAccounts: Array<Accounts>) {
        const svg = d3.select(this.topAccountsRef.current);
        //Add empty bar at start and end for label
        const dummyData = {account_id: topAccounts[0].account_id, balance: 0};
        topAccounts.unshift(dummyData);
        topAccounts.push(dummyData);
        const width = this.container.current ? this.container.current.offsetWidth : 0;

        chartGenerator.seperateAxisPrioritizedBarChartGenerator(215, width, svg, topAccounts, "account_id", "balance", 'rgba(135, 194, 205, 0.58639)',  'Bakers',  'XTZ (ꜩ)', 10, false);

        let self = this;
        const xTooltip = function(d: any, i: number) {
            return self.getFormattedToken(topAccounts[i].account_id)
        }
    
        const yTooltip = function(d: any, i: number) {
            return d.toLocaleString() + " ꜩ"
        }

        chartGenerator.barGraphFloatingTooltipGenerator(svg, xTooltip, yTooltip);
    }

    async getTopBakers(prevDate: Date) {
        const { fetchTopBakers } = this.props;
        await fetchTopBakers(prevDate.getTime(), 20);
        this.generateTopBakersGraph(this.props.topBakers);
    }

    generateTopBakersGraph(topBakers: Array<Bakers>) {
        const svg = d3.select(this.topBakersRef.current);
        const axisScg = d3.select(this.topAccountsAxisRef.current);

        const width = this.container.current ? this.container.current.offsetWidth - 100 : 0; 
        chartGenerator.seperateAxisPrioritizedBarChartGenerator(215, width, svg, topBakers,"baker", "count_hash", 'rgba(255, 116, 119, 0.3)',  'Time (hour)',  '', 7, true, '#FF7477');
        chartGenerator.axisGenerator(axisScg, 215, topBakers, 'count_hash', 'Blocks');
        let self = this;
        const xTooltip = function(d: any, i: number) {

            if(i >= topBakers.length) {
                i = topBakers.length-1;
            }

            return self.getFormattedToken(topBakers[i].baker);
        }
    
        const yTooltip = function(d: any, i: number) {
            return d.toLocaleString() + " Blocks Baked"
        }

        chartGenerator.barGraphFloatingTooltipGenerator(svg, xTooltip, yTooltip);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    handleErrorClose = () => {
        const { initMessage } = this.props;
        initMessage();
    };

    handleScroll(event: Event) {
        const btnPos = this.actionBtnRef.current && this.actionBtnRef.current.getBoundingClientRect().top;
        if(btnPos < 0 && !this.state.showLogo) {
            this.setState({ showLogo: true});
        } else if(btnPos > 0) {
            this.setState({ showLogo: false});
        }
    }

    onChangeNetwork = async (config: Config) => {
        const { selectedEntity, history } = this.props;
        const { platform, network } = config;
        history.replace(`/${platform}/${network}/${selectedEntity}`);
    };

    openConfigModal = () => this.setState({ isOpenConfigModal: true });

    onSearchById = async (val: string | number) => {
        const { searchById } = this.props;
        const realVal = !Number(val) ? val : Number(val);
        const { entity, items } = await searchById(realVal);
        if (items.length > 0 && entity) {
            this.updateRoute(true, '', val);
        }
    };

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

    redirectToDashboard = () => {
        this.props.history.push('/tezos/mainnet/');
    }

    getFormattedToken = (tokenId: string) => {
        let subStr1 = tokenId.substring(0, 6);
        let subStr2 = tokenId.substring(tokenId.length-6, tokenId.length);
        return `${subStr1}...${subStr2}`;
    }

    render() {
        const {
            classes,
            isError,
            message,
            isTransactionsLoading,
            isTopAccountsLoading,
            isTopBakersLoading,
            selectedConfig,
            configs,
            removeConfig,
            hourlytransactionsUrl,
            topAccountsUrl,
            topBakersUrl,
        } = this.props;
        return (
            <React.Fragment>
                <BannerHolder>
                    <Header
                        configs={configs}
                        onChangeNetwork={this.onChangeNetwork}
                        openModal={this.openConfigModal}
                        onRemoveConfig={removeConfig}
                        onSearch={this.onSearchById}
                        showLogo={this.state.showLogo}
                    />
                    <Banner actionBtnRef = {this.actionBtnRef} redirectToDashboard={this.redirectToDashboard} />
                </BannerHolder>
                <WhiteBg>
                    <Container maxWidth="lg">
                        <Padding>
                            <Grid container spacing={0}>
                                <Grid item xs={4}>
                                    <ContentHolder>
                                        <ImageHolder>
                                            <img src={AskIcon} alt="img"/>
                                        </ImageHolder>
                                        <Title>Ask Questions </Title>
                                        <Paragraph>Get insightful blockchain data by asking complex and open-ended questions.</Paragraph>
                                    </ContentHolder>
                                </Grid>
                                <Grid item xs={4}>
                                    <ContentHolder>
                                        <ImageHolder>
                                            <img src={AggregatedDataIcon} alt="img"/>
                                        </ImageHolder>
                                        <Title>Aggregate Data </Title>
                                        <Paragraph>Run sophisticated queries with filters and aggregate functions to summarize your data.</Paragraph>
                                    </ContentHolder>
                                </Grid>
                                <Grid item xs={4}>
                                    <ContentHolder>
                                        <ImageHolder>
                                            <img src={ExportQueriesIcon} alt="img"/>
                                        </ImageHolder>
                                        <Title>Export Queries</Title>
                                        <Paragraph>Share your custom reports with links or export them as CSV files.</Paragraph>
                                    </ContentHolder>
                                </Grid>
                            </Grid>
                        </Padding>
                    </Container>
                </WhiteBg>
                <Container maxWidth="lg">
                    <Padding>
                        <Grid container alignItems="flex-start" spacing={3}>
                            <Grid item xs={12}>
                                <SectionTitle>
                                    <img style={{marginRight: '20px'}} src={ThoughtBubbleIcon} alt="img"/>
                                    What was the Tezos transaction volume per hour in the last day?
                                </SectionTitle>
                            </Grid>
                            <Grid item xs={6}>
                                <img src={PlaceholderImage} alt="img"/>
                            </Grid>
                            <Grid item xs={6}>
                                <MapHolder ref={this.container}>
                                    {
                                        isTransactionsLoading 
                                        ? <p>Loading...</p> : 
                                        <svg className={classes.blockDisplay} ref={this.transactionPerHour}></svg>
                                    }
                                </MapHolder>
                                <AnchorTag>
                                     <Link to={{ pathname: "https://periscope.arronax.io/operations?q=trancations"}} target="_blank" >
                                        View Graph on Periscope
                                        <img src={link_icon} alt="link_icon"/>
                                    </Link> 
                                </AnchorTag>
                            </Grid>
                        </Grid>
                    </Padding>
                </Container>
                <Container maxWidth="lg">
                    <Padding>
                        <Grid alignItems="flex-start" container spacing={3}>
                            <Grid item xs={12}>
                                <SectionTitle>
                                    <img style={{marginRight: '20px'}} src={ThoughtBubbleIcon} alt="img"/>
                                    How many Tezos blocks are baked per hour by the highest priority bakers?
                                </SectionTitle>
                            </Grid>
                            <Grid item xs={6}>
                                <MapHolder>
                                    {
                                        isTopBakersLoading 
                                        ? <p>Loading...</p> :
                                        <React.Fragment>
                                            <svg ref={this.topAccountsAxisRef}></svg>
                                            <svg className={classes.topBakersContainer} ref={this.topBakersRef}></svg>
                                        </React.Fragment>
                                    }
                                </MapHolder>
                                <AnchorTag>
                                <Link to={{ pathname: "https://periscope.arronax.io/blocks?q=priorityBlocks"}} target="_blank" >
                                        View Graph on Periscope
                                        <img src={link_icon} alt="link_icon"/>
                                    </Link> 
                                </AnchorTag>
                            </Grid>
                            <Grid item xs={6}>
                                <img className={classes.imgMarginBottom} src={PlaceholderImage1} alt="img"/>
                                <AnchorTag className={classes.alignRight}>
                                    <Link to={{ pathname: "https://harpoon.arronax.io/"}} target="_blank" >
                                        View Baker Stats on Harpoon
                                        <img src={link_icon} alt="link_icon"/>
                                    </Link> 
                                </AnchorTag>
                            </Grid>
                        </Grid>
                    </Padding>
                </Container>
                <Container maxWidth="lg">
                    <Padding>
                        <Grid alignItems="flex-start" container spacing={3}>
                            <Grid item xs={12}>
                                <SectionTitle>
                                    <img style={{marginRight: '20px'}} src={ThoughtBubbleIcon} alt="img"/>
                                    Who are the top 10 richest Tezos holders?
                                </SectionTitle>
                            </Grid>
                            <Grid item xs={6}>
                                <img src={PlaceholderImage2} alt="img"/>
                            </Grid>
                            <Grid item xs={6}>
                                <MapHolder>
                                    {
                                        isTopAccountsLoading 
                                        ? <p>Loading...</p> :
                                        <svg className={classes.blockDisplay} ref={this.topAccountsRef}></svg>
                                    }
                                </MapHolder>
                                <AnchorTag>
                                    <Link to={{ pathname: "https://periscope.arronax.io/accounts"}} target="_blank" >
                                        View Graph on Periscope
                                        <img src={link_icon} alt="link_icon"/>
                                    </Link> 
                                </AnchorTag>
                            </Grid>
                        </Grid>
                    </Padding>
                </Container>
                <WhiteBg>
                <Container className={classes.marginBottm} maxWidth="lg">
                    <Padding>
                        <Grid container justify="center" alignItems="center" spacing={0}>
                            <Grid item xs={6}>
                                <SectionTitle className={classes.titleText}>
                                    Start exploring blockchain data
                                </SectionTitle>
                            </Grid>
                            <Grid className={classes.alignRight} item xs={6}>
                                <Button className={classes.outlineBtn} onClick={this.redirectToDashboard} variant="contained" color="primary" disableElevation>
                                    Enter Arronax
                                </Button>
                            </Grid>
                        </Grid>
                    </Padding>
                </Container>
                </WhiteBg>
                {/* <Footer>
                    <Container maxWidth="lg">
                        <ListContainer>
                            <ListItem>An open-source product by Cryptonomic</ListItem>
                            <ListItem>Powered by Conseil</ListItem>
                            <ListItem>Built with ConseilJS</ListItem>
                            <ListItem>Version March 2020 Release 8.1-84e17bb</ListItem>
                        </ListContainer>
                    </Container>
                </Footer> */}
                <Footer/>
                <Dialog open={isError} onClose={this.handleErrorClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogTitle id="alert-dialog-title">Error</DialogTitle>
                    <DialogContentWrapper>
                        <DialogContentText id="alert-dialog-description">{message}</DialogContentText>
                    </DialogContentWrapper>
                    <DialogActions>
                        <DismissButton onClick={this.handleErrorClose}>Dismiss</DismissButton>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
        );
    }
};


const mapStateToProps = (state: any) => ({
    isTransactionsLoading: getHourlyTransactionsLoading(state),
    hourlytransactions: getHourlyTransactions(state),
    hourlytransactionsUrl: getHourlyTransactionsUrl(state),
    topAccounts: getTopAccounts(state),
    topAccountsUrl: getTopAccountsUrl(state),
    isTopAccountsLoading: getTopAccountsLoading(state),
    topBakers: getTopBakers(state),
    topBakersUrl: getTopBakersUrl(state),
    isTopBakersLoading: getTopBakersLoading(state),
    isError: getErrorState(state),
    message: getMessageTxt(state),
    selectedConfig: getSelectedConfig(state),
    configs: getConfigs(state),
    selectedEntity: getEntity(state),
});

const mapDispatchToProps = (dispatch: any) => ({
    loadHourlyTransactions: (date: number) => dispatch(loadHourlyTransactions(date)),
    initMessage: () => dispatch(clearMessageAction()),
    fetchTopAccounts: (limit: number) => dispatch(fetchTopAccounts(limit)),
    fetchTopBakers: (date: number, limit: number) => dispatch(fetchTopBakers(date, limit)),
    emoveConfig: (index: number) => dispatch(removeConfigAction(index)),
    searchById: (id: string | number) => dispatch(searchByIdThunk(id)),
});

export const HomePage: any = compose(withRouter, withStyles(styles), connect(mapStateToProps, mapDispatchToProps))(Home);
