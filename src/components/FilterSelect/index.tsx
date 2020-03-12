import React from 'react';
import { withTranslation } from 'react-i18next';
import Menu from '@material-ui/core/Menu';

import {
  Container,
  ButtonShell,
  ArrowIcon,
  MenuContainer,
  MenuContents,
  MainMenuItem
} from './styles';

import { 
  FilterSelectProps,
  FilterSelectState
} from './types';

class FilterSelect extends React.Component<FilterSelectProps, FilterSelectState> {
  constructor(props: FilterSelectProps) {
    super(props);
    this.state = {
      anchorEl: null
    };
  }

  handleChange = (item: any) => {
    const { onChange } = this.props;
    onChange(item);
    this.setState({ anchorEl: null });
  };

  cancelChange = () => {
    this.setState({ anchorEl: null });
  };

  handleClick = (event: any) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  render() {
    const { anchorEl } = this.state;
    const { items, value, placeholder, type, t, borderRadius, backgroundColor } = this.props;
    const tranPrefix = type === 'attributes'? `${type}.${items[0].entity}.` : `${type}.`;

    const selectedItem = items.find(item => item.name === value);
    const menuTitle = (value && selectedItem) ? t(`${tranPrefix}${selectedItem.name}`) : placeholder;

    return (
      <Container>
        <ButtonShell
          aria-haspopup="true"
          aria-owns={anchorEl ? 'simple-menu' : undefined}
          backgroundcolor={backgroundColor}
          borderradius={borderRadius}
          isactive={value}
          iscapital={placeholder !== t('components.filterPanel.select_operator')? 1 : 0}
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
              {items.map((item: any, index) => (
                <MainMenuItem
                  onClick={() => this.handleChange(item)}
                  key={index}
                  selected={value === item.name}
                >
                  {t(`${tranPrefix}${item.name}`)}
                </MainMenuItem>
              ))}
            </MenuContents>
          </Menu>
        </MenuContainer>
      </Container>
    );
  }
}

export default withTranslation()(FilterSelect);
