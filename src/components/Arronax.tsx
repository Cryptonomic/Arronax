import * as React from 'react';
import { TezosFilter } from 'conseiljs';
import { Layout } from 'antd';
import { FilterPanel } from './FilterPanel/FilterPanel';
import { DataPanel } from './DataPanel';
import config from '../config';
/* tslint:disable no-import-side-effect */
import '../App.css';

const { Content, Sider } = Layout;

export interface ArronaxProps {
  filters: TezosFilter;
  network: string;
  setFilter(filters: TezosFilter, network: string): void;
}

export interface ArronaxState {
    loaded: boolean;
}

class Arronax extends React.PureComponent<ArronaxProps, ArronaxState> {
    constructor(props: ArronaxProps) {
        super(props);
        this.state = {
            loaded: false
        };
    }

    componentDidMount() {
        fetch('config.json')
            .then(res => res.json())
            .then(parsedRes => {
                config.url = parsedRes.url;
                config.key = parsedRes.key;
                this.setState({loaded: true});
            })
            .catch(() => console.log('Error during config initialization.'))
    }

    render(): JSX.Element {
        let arronaxView = <p>Fetching data....</p>;
        if (this.state.loaded) {
            arronaxView = (
                <Layout style={{ height: '100%' }}>
                    {/* <Header>Arronax</Header> */}
                    <Sider>
                        <FilterPanel filters={this.props.filters} setFilter={this.props.setFilter} network={this.props.network} />
                    </Sider>
                    <Content style={{ padding: '50px' }}>
                        <DataPanel
                            filters={this.props.filters}
                            network={this.props.network}
                        />
                    </Content>
                </Layout>
            );
        }
        return arronaxView;
    }
}

export default Arronax;
