import React from 'react';
import styled from 'styled-components';
import { ConseilOperator } from 'conseiljs';
import { withStyles } from '@material-ui/core/styles';
import Button, { ButtonProps } from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem, { MenuItemProps } from '@material-ui/core/MenuItem';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import Checkbox from '@material-ui/core/Checkbox';
import { SvgIconProps } from '@material-ui/core/SvgIcon';
import { convertValue } from '../../utils/general';

const Container = styled.div``;

const ButtonShell = styled(Button)<{isactive: number}>`
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
` as React.ComponentType<ButtonProps & {isactive: number}>;

const ArrowIcon = styled(KeyboardArrowDown)`
  color: #56c2d9;
  margin-left: 7px;
` as React.ComponentType<SvgIconProps>;

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

const MainMenuItem = styled(MenuItem)<{ ismultiple: number }>`
  &&& {
    &[class*='selected'] {
      background-color: rgba(101,  200, 206, 0.13);
    }
    &:hover {
      background-color: rgba(101,  200, 206, 0.1);
    }
    font-size: 20px;
    font-weight: 300;
    padding-left: ${({ ismultiple }) => (ismultiple ? '0px' : '25px')};
    padding-right: 25px;
    color: #4a4a4a;
  }
`as React.ComponentType<MenuItemProps & {ismultiple: number}>;

const CheckboxWrapper = withStyles({
  root: {
    '&$checked': {
      color: '#56c2d9'
    },
  },
  checked: {},
})(Checkbox);

interface Props {
  operator: string;
  selectedValues: string[];
  values: string[];
  placeholder?: string;
  onChange: (value: any) => void;
}

type States = {
  anchorEl: any;
};

class ValueSelect extends React.Component<Props, States> {
  static defaultProps: any = {
    values: [],
    selectedValues: []
  };
  constructor(props: Props) {
    super(props);
    this.state = {
      anchorEl: null
    };
  }

  handleChange = (value: any) => {
    const { onChange } = this.props;
    onChange([value]);
    this.setState({ anchorEl: null });
  };

  handleMultipleChange = (value: any) => {
    const { selectedValues, onChange } = this.props;
    const index = selectedValues.indexOf(value);
    let newValues = [];
    if ( selectedValues[0] === '' ) {
      newValues = [value];
    } else if (index > -1) {
      selectedValues.splice(index, 1);
      newValues = selectedValues;
    } else {
      newValues = [...selectedValues, value];
    }
    onChange(newValues);
  }

  cancelChange = () => {
    this.setState({ anchorEl: null });
  };

  handleClick = (event: any) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  onGetItem = (value, index) => {
    const { operator, selectedValues } = this.props;
    if (operator === ConseilOperator.IN || operator === 'notin') {
      return (
        <MainMenuItem
          onClick={() => this.handleMultipleChange(value)}
          key={index}
          ismultiple={1}
        >
          <CheckboxWrapper
            disableRipple={true}
            checked={selectedValues.includes(value)}
          />
          {convertValue(value)}
        </MainMenuItem>
      );
    }

    return (
      <MainMenuItem
        onClick={() => this.handleChange(value)}
        key={index}
        selected={value === selectedValues[0]}
        ismultiple={0}
      >
        {convertValue(value)}
      </MainMenuItem>
    );
  }

  render() {
    const { anchorEl } = this.state;
    const { values, selectedValues, placeholder } = this.props;
    let menuTitle = '';
    if (selectedValues[0]) {
      selectedValues.forEach((value, index) => {
        if (index === 0) {
          menuTitle = convertValue(value);
        } else {
          menuTitle += `, ${convertValue(value)}`;
        }
      });
    } else {
      menuTitle = placeholder;
    }

    return (
      <Container>
        <ButtonShell
          aria-owns={anchorEl ? 'simple-menu' : undefined}
          aria-haspopup="true"
          isactive={selectedValues.length > 0 ? 1 : 0 }
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
            <MenuContents>
              {values.map((value, index) => {
                return this.onGetItem(value, index)
              })}
            </MenuContents>
          </Menu>
        </MenuContainer>
      </Container>
    );
  }
}

export default ValueSelect;
