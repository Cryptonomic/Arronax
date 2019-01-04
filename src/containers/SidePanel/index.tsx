import * as React from 'react';
import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';
import styled from 'styled-components';
import FormControl from '@material-ui/core/FormControl';
import SelectField from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Input from '@material-ui/core/Input';
import FilterItem from '../../components/FilterItem';
import { TezosFilter } from 'conseiljs/dist/conseiljs.web';
import { getFilter, getNetwork } from '../../reducers/app/selectors';
import {submitFilters, changeNetwork} from '../../reducers/app/thunks';
import {setFilterAction} from '../../reducers/app/actions';

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

const MainContainer = styled.div`
    width: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px 0 0 0;
`;

const SelectContainer = styled(FormControl)`
  width: 100px;
`;

const SelectWrapper = styled(SelectField)`
  &&& {
    font-size: 16px;
    font-weight: 300;
  }  
`;

const FilterForm = styled.form`
  margin-top: 20px;
  width: 90%;
`;

const SubmitBtn = styled(Input) `
  &&& {
    display: block;
    margin: 10px auto;
    width: 100px;
    border-radius: 4px;
    border: solid 1px #d9d9d9;
    input {
        height: 32px;
        padding: 0;
    }
  }

`;

interface Props {
    filters: TezosFilter;
    network: string;
    setFilter(filters: TezosFilter): void;
    submitFilters(): void;
    changeNetwork(network: string): void;
}
class SidePanel extends React.Component<Props, {}> {
    constructor(props: Props) {
        super(props);
    }

    onChangeNetwork = (event) => {
      const {changeNetwork} = this.props;
      changeNetwork(event.target.value);
    }

    onChangedFilterItem = (val: string, type: string) => {
      const {filters, setFilter} = this.props;
      let newFilters;
      let newVal;
      if (type === 'limit') {
        newVal = val;
      } else {
        const emptyStrs = val.replace(' ', '');
        newVal = emptyStrs.split(',');
      }

      newFilters = {...filters, [type]: newVal};
      setFilter(newFilters);
    }

    handleSubmit = (event) => {
      const {submitFilters} = this.props;
      submitFilters();
      event.preventDefault();
    }

    render() {
        const {network, filters} = this.props;
        return (
            <MainContainer>
                <SelectContainer>
                    <SelectWrapper
                        value={network}
                        onChange={this.onChangeNetwork}
                    >
                        <MenuItem value='zeronet'>Zeronet</MenuItem>
                        <MenuItem value='mainnet'>Mainnet</MenuItem>
                    </SelectWrapper>
                </SelectContainer>
                <FilterForm onSubmit={this.handleSubmit}>
                    {controls.map((item, index) => {
                        return (
                            <FilterItem
                                key={index}
                                label={item.label}
                                value={filters[item.type]}
                                type={item.type}
                                onChange={this.onChangedFilterItem}
                            />
                        );
                        })
                    }
                    <SubmitBtn type="submit" disableUnderline value="Refresh" />
                </FilterForm>
            </MainContainer>
        );
    }
}

const mapStateToProps = (state: any) => ({
  network: getNetwork(state),
  filters: getFilter(state)
});

const mapDispatchToProps = (dispatch) => ({
  setFilter: (filters: TezosFilter) => dispatch(setFilterAction(filters)),
  submitFilters: () => dispatch(submitFilters()),
  changeNetwork: (network: string) => dispatch(changeNetwork(network))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SidePanel);
