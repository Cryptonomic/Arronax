import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import muiStyled from '@material-ui/styles/styled';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import { withStyles } from '@material-ui/core/styles';
// import { ArronaxIcon } from '../ArronaxIcon';
import { Config } from '../../../types';
import { styles } from '../Banner/style';

const HeaderContainer = styled.div`
  width: 100%;
  height: 104px;
  padding: 0 30px;
  display: flex;
  align-items: center;
  background: transparent;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  margin: 0 auto;
`;

const HeaderLogo = styled.div`
  font-family: 'Futura';
  font-weight: 400;
  font-size: 36px;
  color: #fffffe;
  letter-spacing: 5.46px;
`;

const SearchContainer = styled.div`
  width: 540px;
  height: 60px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 5px 5px 5px 5px;
  display: flex;
  padding: 0 0 0 20px;
  align-items: center;
  margin-left: auto;
  @media(max-width: 1200px) {
    flex: 1;
  }
`;

const InputContainer = muiStyled(InputBase)({
  flex: 1,
  color: '#ffffff',
  letterSpacing: '0.75px',
  fontSize: '18px',
  fontWeight: 'bold'
});

const RevertSearchIcon = muiStyled(SearchIcon)({
  color: '#ffffff',
  transform: 'rotateY(180deg)',
  fontSize: 35
});

interface Props {
  configs: Config[];
  showLogo: boolean;
  classes: any;
  onChangeNetwork(config: Config): void;
  openModal(): void;
  onRemoveConfig(index: number): void;
  onSearch(val: string | number): void;
}

const Header: React.FC<Props> = props => {
  const { configs, onSearch } = props;
  const [searchKey, setSearchKey] = React.useState('');
  const { t } = useTranslation();
  const localConfigs: any = [];
  const mainConfigs: any = [];
  configs.forEach(config => {
    if (config.isLocal) {
      localConfigs.push(config);
    } else {
      mainConfigs.push(config);
    }
  });

  return (
    <HeaderContainer className={`${props.showLogo ? props.classes.headerBackground : ''}`}>
      {
        props.showLogo ? 
          <HeaderLogo>{t('components.header.arronax_beta')}</HeaderLogo> : null
      }
      <SearchContainer>	
        <InputContainer
          value={searchKey}
          placeholder={t('components.header.input_placehoder')}
          onChange={ e => setSearchKey(e.target.value)}
          onKeyPress= { e => {
            if (e.key === 'Enter') {
              onSearch(searchKey)
            }
          }}
        />	
        <IconButton aria-label="Search" onClick={() => onSearch(searchKey)}>	
          <RevertSearchIcon />	
        </IconButton>	
      </SearchContainer>
      
    </HeaderContainer>
  );
};

export default withStyles(styles)(Header);
