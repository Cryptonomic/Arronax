import * as React from 'react';
import { DataView } from '../types';
import { TezosDataView } from './TezosDataView';

interface ExpandableGridRowProps {
    dataView: DataView;
    network: string;
    data: Object;
}

interface ExpandableGridRowState {
    isExpanded: boolean;
    expandedData: object;
}

export class ExpandableGridRow extends React.Component<ExpandableGridRowProps, ExpandableGridRowState> {

    constructor(props: ExpandableGridRowProps) {
        super(props);
        this.state = {isExpanded: false, expandedData: {}};
        this.handleOnClick = this.handleOnClick.bind(this);
    }

    handleOnClick(event: React.MouseEvent<HTMLButtonElement>) {
        this.setState({isExpanded: !this.state.isExpanded});
    }

    inferID(data: object, dataView: DataView) {
        const hash = 'hash';
        const accountId = 'accountId';
        if (dataView === DataView.Blocks || dataView === DataView.Operations) {
            return data[hash];
        } else if (dataView === DataView.Accounts) {
            return data[accountId];
        }
    }

    public render() {
        if (!this.state.isExpanded) {
            return (
                <tr key="foo">
                    <td><button onClick={this.handleOnClick}>+</button></td>
                    {Object.keys(this.props.data).map((value2, index2) =>
                        <td key="bar">{this.props.data[value2]}</td>
                    )}
                </tr>
            );
        } else {
            return (
                <tr key="foo">
                    <td><button onClick={this.handleOnClick}>-</button></td>
                    <td>
                        <TezosDataView
                            dataView={this.props.dataView}
                            network={this.props.network}
                            id={this.inferID(this.props.data, this.props.dataView)}
                        />
                    </td>
                </tr>
            );
        }
    }
}