import React from 'react';
import { Title } from './style';
import { Text } from './style';
import { Title2 } from './style';
import { BottomDiv } from './style';
import DownArrow from '../../../assets/icons/down-arrow.png';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles({
    primaryBtn: {
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
        background: '#FF7477 !important',
        color: '#fff',
        width: 'max-content',
        alignSelf: 'center',
    },
});

const Banner = (props: any) => {
    const classes = useStyles();
    return (
        <>
            <Title>ARRONAX</Title>
            <Text>Blockchain Analytics Tool </Text>
            <Button className={classes.primaryBtn} variant="contained" color="primary" disableElevation>
                Explore Data
            </Button>

            <BottomDiv>
                <Title2>Discover Arronax</Title2>
                <img src={DownArrow} alt="img"/>
            </BottomDiv>
        </>
    );
};

export default Banner;
