import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles'

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

export const useTooltipWrapper = (Component) => withStyles({
  tooltip: {
    backgroundColor: 'red'
  }
})(Component);