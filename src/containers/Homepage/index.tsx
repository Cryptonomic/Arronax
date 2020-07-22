import React from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import * as d3 from "d3";

import { Padding } from './style';
import { Title } from './style';
import { ContentHolder } from './style';
import { Paragraph } from './style';
import { ImageHolder } from './style';
import { WhiteBg } from './style';
import { SectionTitle } from './style';
import { Footer } from './style';
import { ListItem } from './style';
import { ListContainer, styles } from './style';
import Banner from '../../components/Home/Banner';
import {chartGenerator} from '../../utils/chartGenerator';

import AskIcon from '../../assets/icons/ask_question_icon.svg';
import AggregatedDataIcon from '../../assets/icons/aggregated_data_icon.svg';
import ExportQueriesIcon from '../../assets/icons/export_queries_icon.svg';
import ThoughtBubbleIcon from '../../assets/icons/thought_bubble_icon.svg';
import PlaceholderImage from '../../assets/images/placeholder.png';
import PlaceholderImage1 from '../../assets/images/placeholder1.png';
import PlaceholderImage2 from '../../assets/images/placeholder2.png';

import { Props, States } from './types';

// const useStyles = makeStyles({
//     outlineBtn: {
//         padding: '10px 30px',
//         fontSize: '16px',
//         fontWeight: 'bold',
//         fontFamily: 'Futura',
//         height: 'auto',
//         lineHeight: '21px',
//         borderRadius: '5px',
//         letterSpacing: '2.42667px',
//         boxShadow:  ' none !important',
//         outline: 'none !important',
//         border: '1px solid #FF7477;',
//         color: '#FF7477',
//         background: '#fff !important'
//     },
// });

class Home extends React.Component<Props, States> {

    transactionPerHour: any = null;
    axis: any = null;

    constructor(props: Props) {
        super(props);
        
        this.transactionPerHour = React.createRef();
        this.axis = React.createRef();
    }

    componentDidMount() {
        let svg = d3.select(this.transactionPerHour.current);
        let axis = d3.select(this.axis.current);
        let  data = [{
            "date": 1563820200000,
            "values": 0
        }, {
            "date": 1563906600000,
            "values": 3
        }, {
            "date": 1563993000000,
            "values": 6
        }, {
            "date": 1564079400000,
            "values": 4
        }, {
            "date": 1564165800000,
            "values": 5
        }, {
            "date": 1564252200000,
            "values": 5
        }, {
            "date": 1564338600000,
            "values": 12
        }, {
            "date": 1564425000000,
            "values": 3
        }, {
            "date": 1564511400000,
            "values": 17
        }, {
            "date": 1564597800000,
            "values": 12
        }, {
            "date": 1564684200000,
            "values": 27
        }, {
            "date": 1564770600000,
            "values": 11
        }, {
            "date": 1564857000000,
            "values": 11
        }, {
            "date": 1564943400000,
            "values": 20
        }, {
            "date": 1565029800000,
            "values": 21
        }, {
            "date": 1565116200000,
            "values": 26
        }, {
            "date": 1565202600000,
            "values": 10
        }, {
            "date": 1565289000000,
            "values": 55
        }, {
            "date": 1565375400000,
            "values": 29
        }, {
            "date": 1565461800000,
            "values": 14
        }, {
            "date": 1565548200000,
            "values": 21
        }, {
            "date": 1565634600000,
            "values": 15
        }, {
            "date": 1565721000000,
            "values": 6
        }, {
            "date": 1565807400000,
            "values": 5
        }, {
            "date": 1565893800000,
            "values": 15
        }, {
            "date": 1565980200000,
            "values": 6
        }, {
            "date": 1566066600000,
            "values": 12
        }, {
            "date": 1566153000000,
            "values": 12
        }, {
            "date": 1566239400000,
            "values": 12
        }, {
            "date": 1566325800000,
            "values": 9
        }, {
            "date": 1566412200000,
            "values": 4
        }, {
            "date": 1566498600000,
            "values": 4
        }, {
            "date": 1566585000000,
            "values": 7
        }, {
            "date": 1566671400000,
            "values": 7
        }, {
            "date": 1566757800000,
            "values": 11
        }, {
            "date": 1566844200000,
            "values": 15
        }, {
            "date": 1566930600000,
            "values": 15
        }, {
            "date": 1567017000000,
            "values": 8
        }, {
            "date": 1567103400000,
            "values": 5
        }, {
            "date": 1567189800000,
            "values": 9
        }, {
            "date": 1567276200000,
            "values": 10
        }, {
            "date": 1567362600000,
            "values": 12
        }, {
            "date": 1567449000000,
            "values": 4
        }, {
            "date": 1567535400000,
            "values": 7
        }, {
            "date": 1567621800000,
            "values": 6
        }, {
            "date": 1567708200000,
            "values": 8
        }, {
            "date": 1567794600000,
            "values": 4
        }, {
            "date": 1567881000000,
            "values": 5
        }, {
            "date": 1567967400000,
            "values": 5
        }, {
            "date": 1568053800000,
            "values": 8
        }, {
            "date": 1568140200000,
            "values": 6
        }, {
            "date": 1568226600000,
            "values": 8
        }, {
            "date": 1568313000000,
            "values": 4
        }, {
            "date": 1568399400000,
            "values": 7
        }, {
            "date": 1568485800000,
            "values": 10
        }, {
            "date": 1568572200000,
            "values": 10
        }, {
            "date": 1568658600000,
            "values": 9
        }, {
            "date": 1568745000000,
            "values": 10
        }, {
            "date": 1568831400000,
            "values": 8
        }, {
            "date": 1568917800000,
            "values": 3
        }, {
            "date": 1569004200000,
            "values": 9
        }, {
            "date": 1569090600000,
            "values": 8
        }, {
            "date": 1569177000000,
            "values": 12
        }, {
            "date": 1569263400000,
            "values": 11
        }, {
            "date": 1569349800000,
            "values": 3
        }, {
            "date": 1569436200000,
            "values": 6
        }, {
            "date": 1569522600000,
            "values": 6
        }, {
            "date": 1569609000000,
            "values": 9
        }, {
            "date": 1569695400000,
            "values": 5
        }, {
            "date": 1569781800000,
            "values": 2
        }, {
            "date": 1569868200000,
            "values": 8
        }, {
            "date": 1569954600000,
            "values": 10
        }, {
            "date": 1570041000000,
            "values": 5
        }, {
            "date": 1570127400000,
            "values": 4
        }, {
            "date": 1570213800000,
            "values": 7
        }, {
            "date": 1570300200000,
            "values": 7
        }, {
            "date": 1570386600000,
            "values": 1
        }, {
            "date": 1570473000000,
            "values": 4
        }, {
            "date": 1570559400000,
            "values": 5
        }, {
            "date": 1570645800000,
            "values": 7
        }, {
            "date": 1570732200000,
            "values": 5
        }, {
            "date": 1570818600000,
            "values": 2
        }, {
            "date": 1570905000000,
            "values": 3
        }, {
            "date": 1570991400000,
            "values": 8
        }, {
            "date": 1571077800000,
            "values": 5
        }, {
            "date": 1571164200000,
            "values": 2
        }, {
            "date": 1571250600000,
            "values": 8
        }, {
            "date": 1571337000000,
            "values": 4
        }, {
            "date": 1571423400000,
            "values": 6
        }, {
            "date": 1571509800000,
            "values": 6
        }, {
            "date": 1571596200000,
            "values": 4
        }, {
            "date": 1571682600000,
            "values": 3
        }, {
            "date": 1571769000000,
            "values": 5
        }, {
            "date": 1571855400000,
            "values": 3
        }, {
            "date": 1571941800000,
            "values": 4
        }, {
            "date": 1572028200000,
            "values": 6
        }, {
            "date": 1572114600000,
            "values": 5
        }, {
            "date": 1572201000000,
            "values": 13
        }, {
            "date": 1572287400000,
            "values": 4
        }, {
            "date": 1572373800000,
            "values": 10
        }, {
            "date": 1572460200000,
            "values": 6
        }, {
            "date": 1572546600000,
            "values": 9
        }, {
            "date": 1572633000000,
            "values": 9
        }, {
            "date": 1572719400000,
            "values": 14
        }, {
            "date": 1572805800000,
            "values": 11
        }, {
            "date": 1572892200000,
            "values": 4
        }, {
            "date": 1572978600000,
            "values": 4
        }, {
            "date": 1573065000000,
            "values": 39
        }, {
            "date": 1573151400000,
            "values": 22
        }, {
            "date": 1573237800000,
            "values": 20
        }, {
            "date": 1573324200000,
            "values": 19
        }, {
            "date": 1573410600000,
            "values": 15
        }, {
            "date": 1573497000000,
            "values": 14
        }, {
            "date": 1573583400000,
            "values": 7
        }, {
            "date": 1573669800000,
            "values": 11
        }, {
            "date": 1573756200000,
            "values": 17
        }, {
            "date": 1573842600000,
            "values": 7
        }, {
            "date": 1573929000000,
            "values": 9
        }, {
            "date": 1574015400000,
            "values": 8
        }, {
            "date": 1574101800000,
            "values": 9
        }, {
            "date": 1574188200000,
            "values": 8
        }, {
            "date": 1574274600000,
            "values": 10
        }, {
            "date": 1574361000000,
            "values": 15
        }, {
            "date": 1574447400000,
            "values": 11
        }, {
            "date": 1574533800000,
            "values": 14
        }, {
            "date": 1574620200000,
            "values": 17
        }, {
            "date": 1574706600000,
            "values": 4
        }, {
            "date": 1574793000000,
            "values": 14
        }, {
            "date": 1574879400000,
            "values": 7
        }, {
            "date": 1574965800000,
            "values": 11
        }, {
            "date": 1575052200000,
            "values": 8
        }, {
            "date": 1575138600000,
            "values": 3
        }, {
            "date": 1575225000000,
            "values": 7
        }, {
            "date": 1575311400000,
            "values": 7
        }, {
            "date": 1575397800000,
            "values": 8
        }, {
            "date": 1575484200000,
            "values": 11
        }, {
            "date": 1575570600000,
            "values": 13
        }, {
            "date": 1575657000000,
            "values": 5
        }, {
            "date": 1575743400000,
            "values": 17
        }, {
            "date": 1575829800000,
            "values": 23
        }, {
            "date": 1575916200000,
            "values": 6
        }, {
            "date": 1576002600000,
            "values": 20
        }, {
            "date": 1576089000000,
            "values": 31
        }, {
            "date": 1576175400000,
            "values": 32
        }, {
            "date": 1576261800000,
            "values": 19
        }];
        chartGenerator.seperateAxisPrioritizedBarChartGenerator(500, 500, svg, axis, data, "date", "values");;
    }
    render() {
        const { classes } = this.props;
        return (
            <React.Fragment>
                <WhiteBg>
                    <Container maxWidth="lg">
                        <Banner/>
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
                        <Grid container spacing={0}>
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
                                <p>Map here</p>
                                <svg ref={this.axis}></svg>
                                <svg ref={this.transactionPerHour}></svg>
                            </Grid>
                        </Grid>
                    </Padding>
                </Container>
                <Container maxWidth="lg">
                    <Padding>
                        <Grid container spacing={0}>
                            <Grid item xs={12}>
                                <SectionTitle>
                                    <img style={{marginRight: '20px'}} src={ThoughtBubbleIcon} alt="img"/>
                                    How many Tezos blocks are baked per hour by the highest priority bakers?
                                </SectionTitle>
                            </Grid>
                            <Grid item xs={6}>
                                <p>Map here</p>
                            </Grid>
                            <Grid item xs={6}>
                                <img src={PlaceholderImage1} alt="img"/>
                            </Grid>
                        </Grid>
                    </Padding>
                </Container>
                <Container maxWidth="lg">
                    <Padding>
                        <Grid container spacing={0}>
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
                                <p>Map here</p>
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
            </React.Fragment>
        );
    }
};

export const HomePage: any = withStyles(styles)(Home);
