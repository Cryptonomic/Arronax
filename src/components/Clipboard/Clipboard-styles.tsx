import styled from 'styled-components';

export const useClipboardWrapper = (Component) => styled(Component)`
  border: none;
  background: transparent;
  outline: none !important;
  cursor: pointer;
`;

export const useCopyIconWrapper = (Component) => styled(Component)`
&&& {
  color: #a6dfe2;
  font-size: 20px;
}
`