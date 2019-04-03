import * as React from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';

const Container = styled.div``;

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

interface Props {
  value: string;
  items: Array<Item>;
  placeholder?: string;
  onChange: (value: string) => void;
}

type States = {
  anchorEl: boolean;
  isFadeBottom: boolean;
  isFadeTop: boolean;
};

class FilterSelect extends React.Component<Props, States> {
  state = {
    anchorEl: null,
    isFadeBottom: false,
    isFadeTop: false,
  };

  componentDidMount() {
    const { items } = this.props;
    if (items.length < 8) {
      this.setState({ isFadeBottom: false });
    } else {
      this.setState({ isFadeBottom: true });
    }
  }

  componentDidUpdate(prevProps) {
    const { onChange } = this.props;
    if (prevProps.placeholder === 'Select Operator' && prevProps.value === '') {
      const equalsOperator = Object.values(prevProps.items)[0];
      onChange(equalsOperator['name']);
    }
  }

  handleChange = item => {
    const { onChange } = this.props;
    onChange(item.name);
    this.setState({ anchorEl: null });
  };

  cancelChange = () => {
    this.setState({ anchorEl: null });
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleScroll = event => {
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
    const { items, value, placeholder } = this.props;

    const selectedItem: any = items.find((item: any) => item.name === value);
    const menuTitle = value ? selectedItem.displayName : placeholder;
    return (
      <Container>
        <ButtonShell
          aria-owns={anchorEl ? 'simple-menu' : undefined}
          aria-haspopup="true"
          isactive={value}
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
            <MenuContents onScroll={this.handleScroll}>
              {isFadeTop && <FadeTop />}
              {items.map((item: any, index) => (
                <MainMenuItem
                  onClick={() => this.handleChange(item)}
                  key={index}
                  selected={value === item.name}
                >
                  {item.displayName}
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

export default FilterSelect;
