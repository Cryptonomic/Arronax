import React from 'react';
import { Title } from './style';
import { Text } from './style';
import { Title2 } from './style';
import { BottomDiv } from './style';
import DownArrow from '../../assets/icons/down-arrow.png';

const Home = (props: any) => {
    return (
        <>
            <Title>ARRONAX</Title>
            <Text>Blockchain Analytics Tool </Text>
            <button className="btn btn-primary">Explore Data</button>

            <BottomDiv>
                <Title2>Discover Arronax</Title2>
                <img src={DownArrow} alt="img"/>
            </BottomDiv>
        </>
    );
};

export default Home;
