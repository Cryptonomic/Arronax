import styled from 'styled-components';

export const Holder = styled.h1 `
    align-self: center;
    flex: 1 1 auto;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    text-align: center;
`;

export const Title = styled.h1 `
    font-family: Futura;
    font-style: normal;
    font-weight: 500;
    font-size: 72px;
    line-height: 96px;
    letter-spacing: 10.92px;
    color: #fff;
    margin:0;
`;

export const Text = styled.p `
    font-family: Roboto;
    font-style: normal;
    font-weight: 500;
    font-size: 38px;
    line-height: 50px;
    letter-spacing: 5.76333px;
    color: #FFFFFF;
    margin: 0 0 10px;
`;

export const BottomDiv = styled.div `
    position: absolute;
    bottom: 10px;
    left: 0;
    right: 0;
    margin: 0 auto;
`;

export const LogoCon = styled.div`
    display: flex;
    align-self: center;
    height: 48px;
    margin: 20px auto 50px;

    p {
        font-size: 16px;
    }
    img {
        width: 112px;
        height: 48px; 
    }
`;

export const styles: any = {
    primaryBtn: {
        marginTop: '50px',
        padding: '10px 30px',
        fontSize: '20px',
        fontWeight: 'bold',
        fontFamily: 'Roboto',
        height: 'auto',
        lineHeight: '23.44px',
        borderRadius: '5px',
        letterSpacing: '2.42667px',
        textTransform: 'none',
        boxShadow:  ' none !important',
        outline: 'none !important',
        border: '1px solid #FF7477;',
        background: '#FF7477 !important',
        color: '#fff',
        width: 'max-content',
        alignSelf: 'center',
    },
    headerBackground: {
        background: 'linear-gradient(177.02deg,#4A9396 -35.63%,#4A4F96 180.07%) !important',
        transition: 'background 3000ms linear',
        zIndex: 2,
    }
};