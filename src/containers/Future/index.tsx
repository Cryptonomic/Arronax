import React from 'react';
import { compose } from 'redux';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';

import { Props } from '../Homepage/types';

export const Typewriter = styled.div`
    body {
        background: #fff;
        padding-top: 5em;
        display: flex;
        justify-content: center;
    }

    h1 {
        color: #000;
        font-family: monospace;
        overflow: hidden;
        border-right: 0.15em solid orange;
        white-space: nowrap;
        margin: 0 auto;
        letter-spacing: 0.15em;
        animation: typing 3.5s steps(30, end), blink-caret 0.5s step-end infinite;
    }

    @keyframes typing {
        from {
            width: 0;
        }
        to {
            width: 100%;
        }
    }

    @keyframes blink-caret {
        from,
        to {
            border-color: transparent;
        }
        50% {
            border-color: black;
        }
    }
`;

export const Desk = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    position: relative;
`;

export const DeskMat = styled.h1`
    align-self: center;
    flex: 1 1 auto;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    text-align: center;
`;

export const BottomDiv = styled.div`
    position: absolute;
    bottom: 10px;
    left: 0;
    right: 0;
    margin: 0 auto;
`;

export const Title2 = styled.h4`
    font-family: monospace;
    font-weight: 300;
    margin: 0 0 25px;
    font-size: 20px;
    line-height: 29px;
    letter-spacing: 3.04333px;
    color: #000;
    cursor: pointer;
`;

class Future extends React.Component<Props> {
    redirectToDashboard = () => {
        this.props.history.push('/tezos/mainnet/');
    }

    render() {
        return (
            <React.Fragment>
                <Desk>
                    <DeskMat>
                        <Typewriter>
                            <h1>Polygon coming soon</h1>
                        </Typewriter>

                        <BottomDiv>
                            <Title2 onClick={this.redirectToDashboard}>Legacy Tezos Data</Title2>
                        </BottomDiv>
                    </DeskMat>
                </Desk>
            </React.Fragment>
        );
    }
}

export const FuturePage: any = compose(withRouter, withStyles({}))(Future);
