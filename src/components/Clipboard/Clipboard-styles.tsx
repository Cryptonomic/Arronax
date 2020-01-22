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
    backgroundColor: 'white',
    color: 'rgb(155, 155, 155)',
    fontSize: '16px',
    lineHeight: '24px',
    fontWeight: 500,
    boxShadow: '0px 0px 4px 0px rgba(0, 0, 0, 0.3)'
  }
})(Component);