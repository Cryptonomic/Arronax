import * as React from 'react';
import { DataView, TezosBlock } from '../types';

interface ExpandableGridPops {
    dataView: DataView;
    data: Object;
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
            <div>
                {
                    Object.keys(this.props.data).map((value, index) => index)
                }
            </div>
        );
    }
}