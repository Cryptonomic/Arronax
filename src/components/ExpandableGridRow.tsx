import * as React from 'react';
import { DataView, TezosBlock } from '../types';

interface ExpandableGridRowProps {
    dataView: DataView;
    data: Object;
}

interface ExpandableGridRowState {

}

export class ExpandableGridRow extends React.Component<ExpandableGridRowProps, ExpandableGridRowState> {

    constructor(props: ExpandableGridRowProps) {
        super(props);
        this.state = {};
    }

    public render() {
        return (
            <tr key="foo">
                {Object.keys(this.props.data).map((value2, index2) =>
                    <td key="bar">{this.props.data[value2]}</td>
                )}
            </tr>
        );
    }
}