import React from 'react';
import styled from 'styled-components';

const Icon = styled.span<{ size: string }>`
  font-family: 'Arronax-icons' !important;
  font-size: ${({ size }) => size};
  color: ${({ color}) => color};
  speak: none;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;

  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
`;

interface Props {
  iconName: string;
  color: string;
  size: string;
  onClick?: () => void;
  className?: string;
};

const getIconByName = (iconName: string) => {
  const toUnicode = (unicode: string) => String.fromCharCode(parseInt(unicode, 16));

  switch (iconName) {
    case 'icon-delete': {
      return toUnicode('e900');
    }
    case 'icon-octopus-logo': {
      return toUnicode('e901');
    }
    case 'icon-tz': {
      return toUnicode('e902');
    }
    case 'icon-sort-ascending': {
      return toUnicode('e903');
    }
    case 'icon-sort-descending': {
      return toUnicode('e904');
    }
    case 'icon-reorder': {
      return toUnicode('e905');
    }
    case 'icon-close': {
      return toUnicode('e906');
    }
    case 'icon-reset': {
      return toUnicode('e907');
    }
    case 'icon-add': {
      return toUnicode('e908');
    }
    case 'icon-next': {
      return toUnicode('e909');
    }
    case 'icon-previous': {
      return toUnicode('e90a');
    }
    case 'icon-search-left': {
      return toUnicode('e90b');
    }
    case 'icon-search-right': {
      return toUnicode('e90c');
    }
    case 'icon-down-caret': {
      return toUnicode('e90d');
    }
    case 'icon-columns': {
      return toUnicode('e90e');
    }
    case 'icon-filter': {
      return toUnicode('e90f');
    }
    case 'icon-question': {
      return toUnicode('e910');
    }
    case 'icon-export': {
      return toUnicode('e911');
    }
    default: {
      console.error(`${iconName} No such icon in Tezos icons font`);
    }
  }
};

export function ArronaxIcon(props: Props) {
  const { iconName, size, color, className, onClick } = props;
  return (
    <Icon className={className} size={size} color={color} onClick={onClick}>
      {getIconByName(iconName)}
    </Icon>
  );
};