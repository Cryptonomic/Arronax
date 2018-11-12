import * as React from 'react';
import { TezosFilter } from 'conseiljs';
import { Button } from 'antd';

import FilterPanelControl from './FilterPanelControl';

interface FilterPanelProps {
  filters: TezosFilter;
  setFilter: (filters: TezosFilter) => void;
}

const controls = [
  {
    label: 'Block IDs',
    type: 'block_id',
    applied: true
  },
  {
    label: 'Block Levels',
    type: 'block_level',
    applied: true
  },
  {
    label: 'Net IDs',
    type: 'block_netid',
    applied: true
  },
  {
    label: 'Protocols',
    type: 'block_protocol',
    applied: true
  },
  {
    label: 'Operation IDs',
    type: 'operation_id',
    applied: true
  },
  {
    label: 'Operation Sources',
    type: 'operation_source',
    applied: true
  },
  {
    label: 'Operation Participants',
    type: 'operation_participant',
    applied: true
  },
  {
    label: 'Operation Destinations',
    type: 'operation_destination',
    applied: true
  },
  {
    label: 'Operation Kinds',
    type: 'operation_kind',
    applied: true
  },
  {
    label: 'Account IDs',
    type: 'account_id',
    applied: true
  },
  {
    label: 'Account Managers',
    type: 'account_manager',
    applied: true
  },
  {
    label: 'Account Delegates',
    type: 'account_delegate',
    applied: true
  },
  {
    label: 'Limit',
    type: 'limit',
    applied: true
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

  public handleFilterProps = (
    propName: string,
    ctrlPosition: number,
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    event.preventDefault();
    // @ts-ignore
    this.setState({
        [propName]: propName === 'limit' ? Number(event.target.value) : event.target.value.split(',')
    });
    controls[ctrlPosition].applied = false;
  }

  public handleSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
    this.props.setFilter(this.state);
    controls.forEach(control => control.applied = true);
  }

  public render(): JSX.Element {
    return (
      <div style={{width: '100%', padding: '10px'}}>
        {controls.map((control, index) => {
          return (
              <div key={index}>
                <FilterPanelControl
                    ctrlLabel={control.label}
                    ctrlType={control.type}
                    ctrlValue={this.state[control.type].toString()}
                    ctrlControlIndex={index}
                    ctrlChange={this.handleFilterProps}
                    ctrlBordered={!control.applied}
                />
              </div>
          );
        })}
        <div style={{ paddingTop: 20 }}>
          <Button htmlType="button" onClick={this.handleSubmit}>Refresh</Button>
        </div>
      </div>
    );
  }
}
