import React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import { SvgIconProps } from '@material-ui/core/SvgIcon';
const Container = styled.div``;

const ButtonShell = styled(Button)<{isactive: string; iscapital: number}>`
  &&& {
    height: 52px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    cursor: pointer;
    width: max-content;
    color: ${({ isactive }) => (isactive ? '#4A4A4A' : '#9b9b9b')};
    text-transform: ${({ iscapital }) => (iscapital ? 'capitalize' : 'initial')};;
  }
`;

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

const FadeOut = styled.span`
  position: absolute;
  width: 100%;
  height: 30px;
  pointer-events: none;
`;

const FadeTop = styled(FadeOut)`
  top: 38px;
  background-image: linear-gradient(
    to top,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.8) 50%
  );
  z-index: 10;
`;

const FadeBottom = styled(FadeOut)`
  bottom: 8px;
  background-image: linear-gradient(
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.8) 50%
  );
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

interface Item {
  cardinality?: number | null;
  dataType?: string | null;
  displayName?: string | null;
  entity?: string | null;
  keyType?: string | null;
  name?: string | null;
}

interface OwnProps {
  value: string;
  items: Array<Item>;
  type: string;
  placeholder?: string;
  onChange: (item: object) => void;
}

type States = {
  anchorEl: any;
  isFadeBottom: boolean;
  isFadeTop: boolean;
};

type Props = OwnProps & WithTranslation;

class FilterSelect extends React.Component<Props, States> {
  constructor(props: Props) {
    super(props);
    this.state = {
      anchorEl: null,
      isFadeBottom: false,
      isFadeTop: false,
    };
  }

  componentDidMount() {
    const { items } = this.props;
    if (items.length < 8) {
      this.setState({ isFadeBottom: false });
    } else {
      this.setState({ isFadeBottom: true });
    }
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

  handleScroll = (event: any) => {
    const { items } = this.props;
    const pos = event.target.scrollTop;
    const remainCount = items.length - 8;
    if (pos === 0) {
      this.setState({ isFadeTop: false, isFadeBottom: true });
    } else if (pos < remainCount * 46) {
      this.setState({ isFadeTop: true, isFadeBottom: true });
    } else {
      this.setState({ isFadeTop: true, isFadeBottom: false });
    }
  };

  render() {
    const { anchorEl, isFadeBottom, isFadeTop } = this.state;
    const { items, value, placeholder, type, t } = this.props;
    const tranPrefix = type === 'attributes'? `${type}.${items[0].entity}.` : `${type}.`;

    const selectedItem = items.find(item => item.name === value);
    const menuTitle = value ? t(`${tranPrefix}${selectedItem.name}`) : placeholder;

    return (
      <Container>
        <ButtonShell
          aria-owns={anchorEl ? 'simple-menu' : undefined}
          aria-haspopup="true"
          isactive={value}
          onClick={this.handleClick}
          iscapital={placeholder !== t('components.filterPanel.select_operator')? 1 : 0}
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
            <MenuContents onScroll={this.handleScroll}>
              {isFadeTop && <FadeTop />}
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
            {isFadeBottom && <FadeBottom />}
          </Menu>
        </MenuContainer>
      </Container>
    );
  }
}

export default withTranslation()(FilterSelect);
