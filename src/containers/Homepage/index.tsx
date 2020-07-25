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
    Footer,
    ListItem,
    ListContainer,
    styles,
    BannerHolder,
    MapHolder
} from './style';
import {
    DismissButton,
    DialogContentWrapper,
} from '../App/styles';
import Banner from '../../components/Home/Banner';
import {chartGenerator} from '../../utils/chartGenerator';
import { loadHourlyTransactions, fetchTopAccounts, fetchTopBakers } from '../../reducers/app/thunks';
import {
    getHourlyTransactionsLoading,
    getHourlyTransactions,
    getTopAccounts,
    getTopAccountsLoading,
    getTopBakers,
    getTopBakersLoading
} from '../../reducers/app/selectors';
import { getErrorState, getMessageTxt } from '../../reducers/message/selectors';
import { clearMessageAction } from '../../reducers/message/actions';

import AskIcon from '../../assets/icons/ask_question_icon.svg';
import AggregatedDataIcon from '../../assets/icons/aggregated_data_icon.svg';
import ExportQueriesIcon from '../../assets/icons/export_queries_icon.svg';
import ThoughtBubbleIcon from '../../assets/icons/thought_bubble_icon.svg';
import PlaceholderImage from '../../assets/images/placeholder.png';
import PlaceholderImage1 from '../../assets/images/placeholder1.png';
import PlaceholderImage2 from '../../assets/images/placeholder2.png';

import { Props, Transactions, Accounts, Bakers } from './types';

class Home extends React.Component<Props> {

    transactionPerHour: any = null;
    topAccountsRef: any = null;
    topBakersRef: any = null;

    constructor(props: Props) {
        super(props);
        
        this.transactionPerHour = React.createRef();
        this.topAccountsRef = React.createRef();
        this.topBakersRef = React.createRef();
    }

    async componentDidMount() {
        const prevDate = new Date(); 
        // subtract one day from current time
        prevDate.setDate(prevDate.getDate() - 1);

        this.fetchHourlyTransactions(prevDate);
        this.getTopTransactions();
        this.getTopBakers(prevDate);
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
        data: Array<object> = [];
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

        return {data, label, timestamps};

    }

    async generateHourlyTransactionsGraph(data: Array<any>, label: Array<any>, timestamps: Array<any>) {
        const svg = d3.select(this.transactionPerHour.current);

        chartGenerator.seperateAxisPrioritizedBarChartGenerator(220, 500, svg, data, 'date', 'values', 'rgba(135, 194, 205, 0.58639)', 'Time (hour)', 'XTZ (ꜩ)', 7);

        const xTooltip = function(d: any, i: number) {
            return moment(timestamps[i]).format();
        }

        const yTooltip = function(d: any, i: number) {
            return d + ' XTZ';
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

        chartGenerator.seperateAxisPrioritizedBarChartGenerator(220, 500, svg, topAccounts,"account_id", "balance", 'rgba(135, 194, 205, 0.58639)',  'Bakers',  'XTZ (ꜩ)', 10);

        const xTooltip = function(d: any, i: number) {
            return topAccounts[i].account_id
        }
    
        const yTooltip = function(d: any, i: number) {
            return d + " ꜩ"
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
        //Add empty bar at start and end for label
        const dummyData: Bakers = { baker: topBakers[0].baker, count_hash: '0'} ;
        topBakers.unshift(dummyData);
        topBakers.push(dummyData);

        chartGenerator.seperateAxisPrioritizedBarChartGenerator(220, 500, svg, topBakers,"baker", "count_hash", 'rgba(255, 116, 119, 0.3)',  'Time (hour)',  'Blocks', 7, '#FF7477');
        const xTooltip = function(d: any, i: number) {
            return topBakers[i].baker;
        }
    
        const yTooltip = function(d: any, i: number) {
            return d + " Blocks Baked"
        }

        chartGenerator.barGraphFloatingTooltipGenerator(svg, xTooltip, yTooltip);
    }


    handleErrorClose = () => {
        const { initMessage } = this.props;
        initMessage();
    };

    render() {
        const { classes, isError, message, isTransactionsLoading, isTopAccountsLoading, isTopBakersLoading } = this.props;
        return (
            <React.Fragment>
                <BannerHolder>
                    <Banner/>
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
                        <Grid container alignItems="center" spacing={3}>
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
                                <MapHolder>
                                    {
                                        isTransactionsLoading 
                                        ? <p>Loading...</p> : 
                                        <svg className={classes.blockDisplay} ref={this.transactionPerHour}></svg>
                                    }
                                </MapHolder>
                            </Grid>
                        </Grid>
                    </Padding>
                </Container>
                <Container maxWidth="lg">
                    <Padding>
                        <Grid container spacing={3}>
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
                                        <svg className={classes.blockDisplay} ref={this.topBakersRef}></svg>
                                    }
                                </MapHolder>
                            </Grid>
                            <Grid item xs={6}>
                                <img src={PlaceholderImage1} alt="img"/>
                            </Grid>
                        </Grid>
                    </Padding>
                </Container>
                <Container maxWidth="lg">
                    <Padding>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <SectionTitle>
                                    <img style={{marginRight: '20px'}} src={ThoughtBubbleIcon} alt="img"/>
                                    Who are the top 10 richest Tezos holders?
                                </SectionTitle>
                            </Grid>
                            <Grid item xs={6}>
                                <img style={{width:'100%'}} src={PlaceholderImage2} alt="img"/>
                            </Grid>
                            <Grid item xs={6}>
                                <MapHolder>
                                    {
                                        isTopAccountsLoading 
                                        ? <p>Loading...</p> :
                                        <svg className={classes.blockDisplay} ref={this.topAccountsRef}></svg>
                                    }
                                </MapHolder>
                            </Grid>
                        </Grid>
                    </Padding>
                </Container>
                <WhiteBg>
                <Container style={{marginBottom:'100px'}} maxWidth="lg">
                    <Padding>
                        <Grid container justify="center" alignItems="center" spacing={0}>
                            <Grid item xs={6}>
                                <SectionTitle style={{margin:0,justifyContent:'flex-start'}}>
                                    Start exploring blockchain data
                                </SectionTitle>
                            </Grid>
                            <Grid style={{textAlign: 'right'}} item xs={6}>
                                <Button className={classes.outlineBtn} variant="contained" color="primary" disableElevation>
                                    Explore Data
                                </Button>
                            </Grid>
                        </Grid>
                    </Padding>
                </Container>
                </WhiteBg>
                <Footer>
                    <Container maxWidth="lg">
                        <ListContainer>
                            <ListItem>An open-source product by Cryptonomic</ListItem>
                            <ListItem>Powered by Conseil</ListItem>
                            <ListItem>Built with ConseilJS</ListItem>
                            <ListItem>Version March 2020 Release 8.1-84e17bb</ListItem>
                        </ListContainer>
                    </Container>
                </Footer>
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
    topAccounts: getTopAccounts(state),
    isTopAccountsLoading: getTopAccountsLoading(state),
    topBakers: getTopBakers(state),
    isTopBakersLoading: getTopBakersLoading(state),
    isError: getErrorState(state),
    message: getMessageTxt(state),
});

const mapDispatchToProps = (dispatch: any) => ({
    loadHourlyTransactions: (date: number) => dispatch(loadHourlyTransactions(date)),
    initMessage: () => dispatch(clearMessageAction()),
    fetchTopAccounts: (limit: number) => dispatch(fetchTopAccounts(limit)),
    fetchTopBakers: (date: number, limit: number) => dispatch(fetchTopBakers(date, limit))
});

export const HomePage: any = compose(withStyles(styles), connect(mapStateToProps, mapDispatchToProps))(Home);
