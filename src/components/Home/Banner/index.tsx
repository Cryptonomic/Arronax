import React from 'react';
import { 
    Title,
    Text,
    BottomDiv,
    Holder,
    styles,
    LogoCon
} from './style';

import DownArrow from '../../../assets/icons/down-arrow.png';
import CryptonomicLogo from '../../../assets/images/Cryptonomic_logo.svg';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const Banner = (props: any) => {
    return (
        <Holder>
            <Title ref={props.actionBtnRef}>ARRONAX</Title>
            <Text>Blockchain Analytics Tool </Text>
            <LogoCon>
                <Text> Brought to you by </Text>
                <img src={CryptonomicLogo} alt="Brought to you by Cryptonomic"/>
            </LogoCon>
            <Button onClick={props.redirectToDashboard} className={props.classes.primaryBtn} variant="contained" color="primary" disableElevation>
            Create Data Queries
            </Button>

            <BottomDiv>
                <img src={DownArrow} alt="img"/>
            </BottomDiv>
        </Holder>
    );
};

export default withStyles(styles)(Banner);
