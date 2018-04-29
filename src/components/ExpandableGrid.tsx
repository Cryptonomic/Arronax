import * as React from 'react';
import { DataView, TezosBlock } from '../types';

interface ExpandableGridPops {
    dataView: DataView;
    data: Object[];
}

interface ExpandableGridState {
    expansions: Map<string, string>;
}

export class ExpandableGrid extends React.Component<ExpandableGridPops, ExpandableGridState> {

    constructor(props: ExpandableGridPops) {
        super(props);
        this.state = {expansions: new Map<string, string>()};
    }

    public render() {
        return (
            <table>
                <tr key="poo">
                    {this.props.data.length !== 0 ?
                        Object.keys(this.props.data[0]).map((value, index) => <th key="meh">{value}</th>) :
                        <th key="meh">Hi</th>}
                </tr>
                {
                    this.props.data.map((value, index) =>
                        <tr key="foo">
                            {Object.keys(value).map((value2, index2) =>
                                <td key="bar">{value[value2]}</td>
                            )}
                        </tr>
                    )}
            </table>
        );
    }
}