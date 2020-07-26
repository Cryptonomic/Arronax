import React from 'react';
import { 
    Title,
    Text,
    Title2,
    BottomDiv,
    Holder,
    styles
} from './style';
import DownArrow from '../../../assets/icons/down-arrow.png';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const Banner = (props: any) => {
    return (
        <Holder>
            <Title ref={props.actionBtnRef}>ARRONAX</Title>
            <Text>Blockchain Analytics Tool </Text>
            <Button className={props.classes.primaryBtn} variant="contained" color="primary" disableElevation>
                Explore Data
            </Button>

            <BottomDiv>
                <Title2>Discover Arronax</Title2>
                <img src={DownArrow} alt="img"/>
            </BottomDiv>
        </Holder>
    );
};

export default withStyles(styles)(Banner);
