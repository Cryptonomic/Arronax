import React from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import { Padding } from './style';
import { Title } from './style';
import { ContentHolder } from './style';
import { Paragraph } from './style';
import { ImageHolder } from './style';
import { WhiteBg } from './style';
import { SectionTitle } from './style';
import { Footer } from './style';
import { ListItem } from './style';
import { ListContainer } from './style';

import AskIcon from '../../assets/icons/ask_question_icon.svg';
import AggregatedDataIcon from '../../assets/icons/aggregated_data_icon.svg';
import ExportQueriesIcon from '../../assets/icons/export_queries_icon.svg';
import ThoughtBubbleIcon from '../../assets/icons/thought_bubble_icon.svg';
import PlaceholderImage from '../../assets/images/placeholder.png';
import PlaceholderImage1 from '../../assets/images/placeholder1.png';
import PlaceholderImage2 from '../../assets/images/placeholder2.png';

const useStyles = makeStyles({
    outlineBtn: {
        padding: '10px 30px',
        fontSize: '16px',
        fontWeight: 'bold',
        fontFamily: 'Futura',
        height: 'auto',
        lineHeight: '21px',
        borderRadius: '5px',
        letterSpacing: '2.42667px',
        boxShadow:  ' none !important',
        outline: 'none !important',
        border: '1px solid #FF7477;',
        color: '#FF7477',
        background: '#fff !important'
    },
});

const HomePage = (props: any) => {
    const classes = useStyles();
    return (
        <React.Fragment>
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
};

export default HomePage;
