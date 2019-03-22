import * as React from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import TextField from '@material-ui/core/TextField';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import StartBetweenInput from '../StartBetweenInput';
import EndBetweenInput from '../EndBetweenInput';

const Container = styled.div``;

const HR = styled.div`
  width: 1px;
  background-color: #ecedef;
`;

const AndBlock = styled.div`
  color: #4a4a4a;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 400;
  padding-right: 10px;
  padding-left: 10px;
`;

const TextInput = styled(TextField)`
  margin-top: 17px !important;
  margin-left: 10px !important;
  color: #9b9b9b;
  font-size: 18px;
  font-weight: normal;
  height: 17px;
  letter-spacing: 0;
  line-height: 17px;
  width: 150px;
`;

const ButtonShell = styled(Button)`
  &&& {
    height: 52px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    cursor: pointer;
    color: ${({ isactive }) => (isactive ? '#4A4A4A' : '#9b9b9b')};
    text-transform: capitalize;
  }
`;

const NestedTitle = styled.div`
  cursor: default;
  flex-shrink: 0;
  outline: none;
  padding: 5px 25px 0 25px;
  color: #9b9b9b;
  font-family: Roboto-Medium;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 0;
  text-transform: capitalize;
`;

const ArrowIcon = styled(KeyboardArrowDown)`
  color: #56c2d9;
  margin-left: 7px;
`;

const MenuContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
`;

const MenuContents = styled.div`
  max-height: 368px;
  flex: 1;
  outline: none;
  overflow: auto;
  min-height: 1.25em;
`;

const MainMenuItem = styled(MenuItem)`
  &&& {
    &[class*='selected'] {
      background-color: rgba(101,  200, 206, 0.13);
    }
    &:hover {
      background-color: rgba(101,  200, 206, 0.1);
    }
    font-size: 20px;
    font-weight: 300;
    padding-left: 25px;
    padding-right: 25px;
    color: #4a4a4a;
  }
`;

interface Props {
  attributes: any[];
  filter: any;
  selectedValues: any;
  availableValues: Array<object>;
  placeholder?: string;
  filterOperator: string;
  inputProps?: object;
  InputProps?: object;
  filterInputState: any[];
  filterInputVal: any;
  onChange: (value: object) => void;
  setFilterInputState: (value: string, filterName: string) => void;
  setFilterInput: (
    value: string,
    filterName: string,
    filterOperator: string
  ) => void;
}

type States = {
  anchorEl: boolean;
  // value: string;
};

class ValueSelect extends React.Component<Props, States> {
  state = {
    anchorEl: null,
  };

  handleChange = value => {
    const { onChange, filter } = this.props;
    const newValue = { [filter.toString()]: value };
    onChange(newValue);
    this.setState({ anchorEl: null });
  };

  cancelChange = () => {
    this.setState({ anchorEl: null });
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleInputChange = event => {
    const { filter, setFilterInputState, filterOperator } = this.props;
    setFilterInputState(event.target.value, filter);
    // setFilterInput(event.target.value, filter, filterOperator);
  };

  handleBetweenChange = event => {
    const { filter, setFilterInput, filterOperator } = this.props;
    // setFilterInput(event.target.value, filter, filterOperator);
  };

  render() {
    const { anchorEl } = this.state;
    const {
      attributes,
      availableValues,
      selectedValues,
      placeholder,
      filter,
      filterOperator,
      inputProps,
      InputProps,
      filterInputState,
      filterInputVal,
    } = this.props;
    console.log(filterInputState);
    const cards = attributes.reduce((acc, current) => {
      if (current.cardinality < 15 && current.cardinality !== null) {
        acc.push(current.name);
      }
      return acc;
    }, []);
    let newValue = [];
    selectedValues.forEach(val => {
      if (val[filter.toString()] !== undefined) {
        newValue.push(val[filter.toString()]);
      }
    });
    let valuesAvailable = [];
    availableValues.forEach(item => {
      if (Object.keys(item) == filter) {
        if (item[filter.toString()] !== null) {
          const items = item[filter.toString()].replace(/(^|_)./g, s =>
            s
              .split('_')
              .map(s => s.charAt(0).toUpperCase() + s.substring(1))
              .join(' ')
          );
          valuesAvailable.push(items);
        } else if (item.toString() === null) {
          valuesAvailable.push('Null');
        }
      }
    });
    const selectedItem: any = valuesAvailable.find(
      (item: any) => item == newValue[0]
    );
    const menuTitle =
      selectedValues && selectedItem !== undefined ? selectedItem : placeholder;
    const findValue = filterInputState.find(
      value => Object.keys(value).toString() === filter
    );
    const currentValue = findValue ? Object.values(findValue).toString() : null;
    let input;
    if (filter.operator === 'BETWEEN' || filter.operator === 'IN') {
      input = (
        <React.Fragment>
          <Container>
            <TextInput
              // value={value}
              inputProps={inputProps}
              InputProps={InputProps}
              placeholder={placeholder}
              onChange={event => this.handleInputChange(event)}
            />
          </Container>
          <Container>
            <TextInput
              // value={value}
              inputProps={inputProps}
              InputProps={InputProps}
              placeholder={placeholder}
              onChange={event => this.handleBetweenChange(event)}
            />
          </Container>
        </React.Fragment>
      );
    } else if (filter.operator === 'ISNULL') {
      input = null;
    } else if (filterOperator === 'EQ' && cards.includes(filter)) {
      input = (
        <Container>
          <ButtonShell
            aria-owns={anchorEl ? 'simple-menu' : undefined}
            aria-haspopup="true"
            isactive={selectedValues}
            onClick={this.handleClick}
          >
            {menuTitle}
            <ArrowIcon />
          </ButtonShell>
          <MenuContainer>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={this.cancelChange}
              PaperProps={{
                style: {
                  position: 'relative',
                  width: 300,
                },
              }}
            >
              <NestedTitle>{placeholder}</NestedTitle>
              <MenuContents>
                {valuesAvailable.map((value: any, index) => (
                  <MainMenuItem
                    onClick={() => this.handleChange(value)}
                    key={index}
                    selected={value === newValue[0]}
                  >
                    {value}
                  </MainMenuItem>
                ))}
              </MenuContents>
            </Menu>
          </MenuContainer>
        </Container>
      );
    } else {
      input = (
        <Container>
          <TextInput
            value={currentValue ? currentValue : ''}
            inputProps={inputProps}
            InputProps={InputProps}
            placeholder={`input`}
            onChange={event => this.handleInputChange(event)}
          />
        </Container>
      );
    }

    return <React.Fragment>{input}</React.Fragment>;
  }
}

export default ValueSelect;
