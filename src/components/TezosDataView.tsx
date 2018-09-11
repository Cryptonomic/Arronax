import * as React from 'react';
import { DataView } from '../types';
import TezosConseilView from './TezosConseilView';

interface TezosDataProps {
    dataView: DataView;
    network: string;
    id: string;
}

const TezosDataView = (props: TezosDataProps) => {
    const { dataView, id, network } = props;
    let type = '';
    switch (dataView) {
        case (DataView.Blocks):
            type = 'block';
            break;
        case (DataView.Accounts):
            type = 'account';
            break;
        case (DataView.Operations):
            type = 'operation';
            break;
        default:
            return(
                <p>Invalid view!</p>
            );
    }
    return (<TezosConseilView type={type} id={id} network={network} />);
};

export default TezosDataView;
