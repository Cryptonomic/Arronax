import React from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import { SvgIconProps } from '@material-ui/core/SvgIcon';

export const Container = styled.div``;

export const ButtonShell = styled(Button)<{
  isactive: string;
  iscapital: number;
  borderradius?: string;
  backgroundcolor?: string;
}>`
  &&& {
    background-color: ${({ backgroundcolor }) =>
      backgroundcolor ? backgroundcolor : ''};
    border-radius: ${({ borderradius }) => (borderradius ? borderradius : '0')};
    height: 52px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    cursor: pointer;
    width: max-content;
    color: ${({ isactive }) => (isactive ? '#4A4A4A' : '#9b9b9b')};
    text-transform: ${({ iscapital }) =>
      iscapital ? 'capitalize' : 'initial'};
  }
`;

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

export const MainMenuItem = styled(MenuItem)`
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
