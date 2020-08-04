import styled from 'styled-components';

import Background from '../../assets/images/main_banner.png';

export const BannerHolder = styled.div `
    display:flex;
    flex-direction: column;
    min-height: 100vh;
    background-image: url(${Background});
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    position: relative;
`;

export const Padding = styled.div`
    padding: 100px 0;
    text-align:center;
`;

export const WhiteBg = styled.div `
    background-color:#fff;
`;

export const ContentHolder = styled.div`
  text-align:center;
  padding: 0 40px;
`;

export const Title = styled.h4`
    font-family: Futura;
    font-weight: 500;
    font-size: 25px;
    line-height: 33px;
    letter-spacing: 3.79167px;
    margin: 0 0 15px;
    color: #0B093F;
`;

export const ImageHolder = styled.div`
    height:135px;
    margin-bottom:40px;
`;

export const Paragraph = styled.p`
    font-family: Roboto;
    font-size: 18px;
    line-height: 21px;
    text-align: center;
    letter-spacing: 2.5px;
    color: #6A707E;
    margin: 0;
`;

export const SectionTitle = styled.h3`
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: Futura;
    font-weight: 500;
    font-size: 25px;
    line-height: 33px;
    letter-spacing: 2.85px;
    color: #0B093F;
    margin: 0 0 60px;
`;

export const Footer = styled.div`
    background: linear-gradient(177.02deg, #4A9396 -35.63%, #4A4F96 180.07%);
    border: 1px solid #979797;
    padding:30px 40px;
`;


export const ListItem = styled.li`
    font-family: Roboto;
    font-size: 14px;
    line-height: 16px;
    letter-spacing: 2px;
    color:#fff;
    list-style:none;
    margin-bottom:10px;
    &:last-child {
        margin-bottom:0;
    }
`;

export const ListContainer = styled.ul`
    margin: 0;
    padding:0;
`;

export const MapHolder = styled.div`
    background-color:#fff;
    box-shadow: 1.5px 2.6px 10px rgba(119, 119, 119, 0.1);
    position: relative;
    padding-top: 35px;
    min-height: 300px;
`;

export const AnchorTag = styled.div `
    text-align:left;
    a {
        font-family: Nunito;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 20px;
        color: #5CBBD4;
        margin-left:15px;
        text-decoration:none;
    }
    svg {
        margin-right:5px;
    }
`;

export const styles: any = {
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
    blockDisplay: {
        display: 'block',
        position: 'relative'
    },
    topBakersContainer: {
        display: 'block',
        marginLeft: '20px',
        left: '70px',
        position: 'relative',
    },
    marginBottom: {
        marginBottom:'100px'
    },

    alignRight: {
        textAlign: 'right !important'
    }
};

