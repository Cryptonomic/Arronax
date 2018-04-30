import * as React from 'react';
import { DataView } from '../types';

interface ExpandableGridRowProps {
    dataView: DataView;
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
                        <pre>
                        {JSON.stringify(this.props.data, null, 2)}
                        </pre>
                    </td>
                </tr>
            );
        }
    }
}