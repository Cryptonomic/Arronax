import * as React from 'react';
import styled from 'styled-components';
import { TezosFilter } from 'conseiljs';
import { Button } from 'antd';

interface FilterPanelProps {
  filters: TezosFilter;
  setFilter: (filters: TezosFilter) => void;
}

const Wrapper = styled.div`
  width: 100%;
  padding: 10px;
`;

const TextAreaFilter = styled.textarea`
  width: 100%;
  height: 3em;
`;

const InputFilter = styled.input.attrs({
  type: 'text'
})`
  width: 100%;
`;

const Label = styled.label`
  color: white;
`;

const controls = [
  {
    label: 'Block IDs',
    type: 'block_id'
  },
  {
    label: 'Block Levels',
    type: 'block_level'
  },
  {
    label: 'Net IDs',
    type: 'block_netid'
  },
  {
    label: 'Protocols',
    type: 'block_protocol'
  },
  {
    label: 'Operation IDs',
    type: 'operation_id'
  },
  {
    label: 'Operation Sources',
    type: 'operation_source'
  },
  {
    label: 'Operation Participants',
    type: 'operation_participant'
  },
  {
    label: 'Operation Destinations',
    type: 'operation_destination'
  },
  {
    label: 'Operation Kinds',
    type: 'operation_kind'
  },
  {
    label: 'Account IDs',
    type: 'account_id'
  },
  {
    label: 'Account Managers',
    type: 'account_manager'
  },
  {
    label: 'Account Delegates',
    type: 'account_delegate'
  },
  {
    label: 'Limit',
    type: 'limit'
  }
];

export class FilterPanel extends React.Component<
  FilterPanelProps,
  TezosFilter
> {
  public constructor(props: FilterPanelProps) {
    super(props);
    this.state = props.filters;
  }

  public handleLimit = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ limit: Number(event.target.value) });
  }

  public handleFilterProps = (
    propName: string,
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    event.preventDefault();
    // @ts-ignore
    this.setState({
        [propName]: propName === 'limit' ? Number(event.target.value) : event.target.value.split(',')
    });
  }

  public handleSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
    this.props.setFilter(this.state);
  }

  public render(): JSX.Element {
    return (
      <Wrapper>
        {controls.map(control => {
          if (control.type === 'limit') {
            return (
              <div key={control.type}>
                <Label>{control.label}:</Label>
                <InputFilter
                    value={this.state[control.type].toString()}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        this.handleFilterProps(control.type, event)
                    }
                />
              </div>
            );
          } else {
            return (
              <div key={control.type}>
                <Label>{control.label}:</Label>
                <TextAreaFilter
                    value={this.state[control.type].toString()}
                    onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
                        this.handleFilterProps(control.type, event)
                    }
                />
              </div>
            );
          }
        })}
        <div style={{ paddingTop: 20 }}>
          <Button htmlType="button" onClick={this.handleSubmit}>Refresh</Button>
        </div>
      </Wrapper>
    );
  }
}
