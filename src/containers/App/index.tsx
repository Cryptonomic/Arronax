import * as React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import CircularProgress from '@material-ui/core/CircularProgress';
import { getLoading } from '../../reducers/app/selectors';
import SidePanel from '../SidePanel';
import DataPanel from '../DataPanel';

const Container = styled.div`
    display: flex;
`;

const MainContainer = styled.div`
    position: relative;
`;

const LoadingContainer = styled.div`
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.3);
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
`;

export interface Props {
    isLoading: boolean;
}

class Arronax extends React.Component<Props, {}> {
    constructor(props: Props) {
        super(props);
    }

    componentDidMount = async () => {

    }

    render() {
        const {isLoading} = this.props;
        return (
            <MainContainer>
                <Container>
                    <SidePanel />
                    <DataPanel />
                </Container>
                {isLoading && 
                    <LoadingContainer>
                        <CircularProgress />
                    </LoadingContainer>
                }
            </MainContainer>
            
        )

        
    }
}

const mapStateToProps = (state: any) => ({
  isLoading: getLoading(state)
});

export default connect(
  mapStateToProps,
  null
)(Arronax);
