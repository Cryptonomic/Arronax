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
    font-family: Futura;
    font-style: normal;
    font-weight: 500;
    font-size: 38px;
    line-height: 50px;
    letter-spacing: 5.76333px;
    color: #FFFFFF;
    margin: 0 0 50px;
`;

export const BottomDiv = styled.div `
    position: absolute;
    bottom: 10px;
    left: 0;
    right: 0;
    margin: 0 auto;
`;

export const Title2 = styled.h4 `
    font-family: Roboto;
    font-weight:300;
    margin: 0 0 25px;
    font-size: 25px;
    line-height: 29px;
    letter-spacing: 3.04333px;
    color: #FFFFFF;
`;

export const styles: any = {
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
};