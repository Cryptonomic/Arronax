import * as React from 'react';
import {Select} from 'antd';
import {SelectValue} from 'antd/es/select';

interface NetworkSwitchProps {
    network: string;
    ntwChange: (value: SelectValue) => void;
}

const Option = Select.Option;

const networkSwitch: React.SFC<NetworkSwitchProps> = (props) => (
    <div id="network-selector">
        <label htmlFor="selector">Network:</label>
        <Select
            value={props.network}
            onChange={props.ntwChange}
        >
            <Option value="zeronet">Zeronet</Option>
            <Option value="mainnet">Mainnet</Option>
        </Select>
    </div>
);

export default networkSwitch;
