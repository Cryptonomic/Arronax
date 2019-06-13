import React from 'react';
import styled from 'styled-components';
import FormControl from '@material-ui/core/FormControl';
import SelectField, { SelectProps} from '@material-ui/core/Select';
import MenuItem, { MenuItemProps } from '@material-ui/core/MenuItem';
import Radio from '@material-ui/core/Radio';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import ArrowDropDown from '@material-ui/icons/KeyboardArrowDown';
import { SvgIconProps } from '@material-ui/core/SvgIcon';
import { ArronaxIcon } from '../ArronaxIcon';
import { getConfigs } from '../../utils/getconfig';
import { Config } from '../../types';

const configs: Config[] = getConfigs();

const HeaderContainer = styled.div`
  width: 100%;
  height: 104px;
  padding: 0 30px;
  display: flex;
  align-items: center;
  background: linear-gradient(
    -225deg,
    #bcfcff 0%,
    #9cd9e1 12.85%,
    #84bfca 22.66%,
    #75aebc 28.69%,
    #417895 48.65%,
    #395d94 85.37%,
    #34386e 100%
  );
`;
const HeaderLogo = styled.div`
  font-family: 'Futura';
  font-weight: 400;
  font-size: 36px;
  color: #fffffe;
  letter-spacing: 5.46px;
`;

const IconContainer = styled.div`
  width: 35px;
  height: 35px;
  background: #669fb1;
  border-radius: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
`;

const SelectContainer = styled(FormControl)`
  &&& {
    margin-left: 12px;
  }
`;

const SelectWrapper = styled(SelectField)`
  &&& {
    &:before {
      border-bottom: 0;
    }
    &:after {
      border-bottom: 0;
    }
    &:hover:before {
      border-bottom: 0 !important;
    }
    font-size: 24px;
    font-weight: 300;
    letter-spacing: 2.57px;
    color: #fffffe;
  }
` as React.ComponentType<SelectProps>;

const DownIcon = styled(ArrowDropDown)`
  &&& {
    color: white;
  }
` as React.ComponentType<SvgIconProps>;

const MenuHeaderItem = styled(MenuItem)`
  &&& {
    color: #9b9b9b;
    box-sizing: border-box;
    padding: 5px 25px;
    opacity: 1;
    font-size: 16px;
  }
` as React.ComponentType<MenuItemProps>;

const MainMenuItem = styled(MenuItem)`
  &&& {
    &[class*='selected'] {
      background-color: rgba(101,  200, 206, 0.13);
    }
    &:hover {
      background-color: rgba(101,  200, 206, 0.1);
    }
  }
` as React.ComponentType<MenuItemProps>;

const UncheckedIcon = styled(RadioButtonUncheckedIcon)`
  &&& {
    font-size: 18px;
  }
` as React.ComponentType<SvgIconProps>;

const CheckedIcon = styled(RadioButtonCheckedIcon)`
  &&& {
    font-size: 18px;
    color: #00c4dc;
  }
` as React.ComponentType<SvgIconProps>;

const MenuContent = styled.span``;

const SelectRenderWrapper = styled.div``;

const getConfig = (val: string) => {
  return configs.find(conf => conf.network === val);
};

interface Props {
  network: string;
  onChangeNetwork(event: any): void;
}

const Header: React.FC<Props> = props => {
  const { network, onChangeNetwork } = props;
  return (
    <HeaderContainer>
      <HeaderLogo>ARRONAX beta</HeaderLogo>
      <IconContainer>
        <ArronaxIcon size="22px" color="#FFFFFF" iconName="icon-tz" />
      </IconContainer>
      <SelectContainer>
        <SelectWrapper
          value={network}
          onChange={onChangeNetwork}
          IconComponent={DownIcon}
          renderValue={(value: string) => {
            const config = getConfig(value);
            return <SelectRenderWrapper>{config.displayName}</SelectRenderWrapper>;
          }}
        >
          <MenuHeaderItem value="" disabled>
            Select Preferred Tezos Network
          </MenuHeaderItem>
          {configs.map(config => (
            <MainMenuItem
              key={config.network}
              value={config.network}
            >
              <Radio
                checked={network === config.network}
                icon={<UncheckedIcon fontSize="small" />}
                checkedIcon={<CheckedIcon fontSize="small" />}
              />
              <MenuContent>{config.displayName}</MenuContent>
            </MainMenuItem>
          ))}
        </SelectWrapper>
      </SelectContainer>
    </HeaderContainer>
  );
};

export default Header;
