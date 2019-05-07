import * as React from 'react';
import styled from 'styled-components';
import FormControl from '@material-ui/core/FormControl';
import SelectField from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Radio from '@material-ui/core/Radio';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import ArrowDropDown from '@material-ui/icons/KeyboardArrowDown';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import ArronaxIcon from '../ArronaxIcon';
import getConfigs from '../../utils/getconfig';

const configs = getConfigs();

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
`;

const DownIcon = styled(ArrowDropDown)`
  &&& {
    color: white;
  }
`;

const SearchContainer = styled.div`
  width: 602px;
  height: 60px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 5px 5px 5px 5px;
  display: flex;
  padding: 0 0 0 29px;
  align-items: center;
  margin-left: 30px;
`;

const InputContainer = styled(InputBase)`
  &&& {
    flex: 1;
    color: #ffffff;
    letter-spacing: 0.75px;
    font-size: 18px;
    font-weight: bold;
  }
`;

const RevertSearchIcon = styled(SearchIcon)`
  &&& {
    color: #ffffff;
    transform: rotateY(180deg);
    font-size: 35px;
  }
`;

const MenuHeaderItem = styled(MenuItem)`
  &&& {
    color: #9b9b9b;
    box-sizing: border-box;
    padding: 5px 25px;
    opacity: 1;
    font-size: 16px;
  }
`;

const MainMenuItem = styled(MenuItem)`
  &&& {
    &[class*='selected'] {
      background-color: rgba(101,  200, 206, 0.13);
    }
    &:hover {
      background-color: rgba(101,  200, 206, 0.1);
    }
  }
`;

const UncheckedIcon = styled(RadioButtonUncheckedIcon)`
  &&& {
    font-size: 18px;
  }
`;

const CheckedIcon = styled(RadioButtonCheckedIcon)`
  &&& {
    font-size: 18px;
    color: #00c4dc;
  }
`;

const MenuContent = styled.span``;

const SelectRenderWrapper = styled.div``;

const getConfig = val => {
  return configs.find(conf => conf.value === val);
};

interface Props {
  network: string;
  onChangeNetwork(event: any): void;
}

const Header: React.StatelessComponent<Props> = props => {
  const { network, onChangeNetwork } = props;
  return (
    <HeaderContainer>
      <HeaderLogo>ARRONAX</HeaderLogo>
      <IconContainer>
        <ArronaxIcon size="22px" color="#FFFFFF" iconName="icon-tz" />
      </IconContainer>
      <SelectContainer>
        <SelectWrapper
          value={network}
          onChange={onChangeNetwork}
          IconComponent={DownIcon}
          renderValue={value => {
            const config = getConfig(value);
            return <SelectRenderWrapper>{config.title}</SelectRenderWrapper>;
          }}
        >
          <MenuHeaderItem value="" disabled>
            Select Preferred Tezos Network
          </MenuHeaderItem>
          {configs.map(config => (
            <MainMenuItem
              key={config.value}
              value={config.value}
              component="div"
            >
              <Radio
                checked={network === config.value}
                icon={<UncheckedIcon fontSize="small" />}
                checkedIcon={<CheckedIcon fontSize="small" />}
              />
              <MenuContent>{config.title}</MenuContent>
            </MainMenuItem>
          ))}
        </SelectWrapper>
      </SelectContainer>

      <!--SearchContainer>
        <InputContainer placeholder="Operation Group ID / Address / Block Level or Block Hash" />
        <IconButton aria-label="Search">
          <RevertSearchIcon />
        </IconButton>
      </SearchContainer-->
    </HeaderContainer>
  );
};

export default Header;
