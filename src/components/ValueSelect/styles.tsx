import React from 'react';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import Button, { ButtonProps } from '@material-ui/core/Button';
import MenuItem, { MenuItemProps } from '@material-ui/core/MenuItem';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import Checkbox from '@material-ui/core/Checkbox';
import { SvgIconProps } from '@material-ui/core/SvgIcon';

export const ButtonShell = styled(Button)<{ isactive: number }>`
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
` as React.ComponentType<ButtonProps & { isactive: number }>;

export const ArrowIcon = styled(KeyboardArrowDown)`
  color: #56c2d9;
  margin-left: 7px;
` as React.ComponentType<SvgIconProps>;

export const MenuContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
`;

export const MenuContents = styled.div`
  max-height: 368px;
  flex: 1;
  outline: none;
  overflow: auto;
  min-height: 1.25em;
`;

export const MainMenuItem = styled(MenuItem)<{ ismultiple: number }>`
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
` as React.ComponentType<MenuItemProps & { ismultiple: number }>;

export const CheckboxWrapper = withStyles({
  root: {
    '&$checked': {
      color: '#56c2d9',
    },
  },
  checked: {},
})(Checkbox);
