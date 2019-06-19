import React from 'react';
import styled, { css } from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

import { Config } from '../../types';

const RowContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
`;

const TextWrapper = withStyles({
  root: {
    width: '47%',
    '& label.Mui-focused': {
      color: '#5571a7',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#2c7df7',
    },
    '& .MuiInput-underline:hover:before': {
      borderBottomColor: '#2c7df7',
    }
  }
})(TextField);

const CustomButton = styled.div`
  cursor: pointer;
  border-radius: 9px;
  height: 42px;
  width: 158px;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
`;

const ClearButton = styled(CustomButton)`
  border: 2px solid rgb(0, 196, 220);
  color: rgb(0, 196, 220);
`;

const DisableCss = css`
  opacity: 0.5;
  pointer-events: none;
`;
const AddButton = styled(CustomButton)<{isDisable: boolean}>`
  &&&{
    color: white;
    background: rgb(86, 194, 217);
    margin-left: 22px;
  }
  ${({ isDisable }) => (isDisable && DisableCss)};
`;

export interface States {
  platform: string;
  network: string;
  displayName: string;
  url: string;
  apiKey: string;
}

type Props = {
  open: boolean;
  addConfig: (config: Config, isUse: boolean) => void
  onClose: () => void;
};

class ConfigModal extends React.Component<Props, States> {
  constructor(props: Props) {
    super(props);
    this.state = {
      platform: '',
      network: '',
      displayName: '',
      url: '',
      apiKey: ''
    };
  }
  
  closeModal = () => {
    const { onClose } = this.props;
    this.setState({
      platform: '',
      network: '',
      displayName: '',
      url: '',
      apiKey: ''
    });
    onClose();
  }

  onAdd = (isUse: boolean) => {
    const { addConfig } = this.props;
    const { platform, network, displayName, url, apiKey } = this.state;
    const config = {
      platform,
      network,
      displayName,
      url,
      apiKey,
      isLocal: true
    };
    addConfig(config, isUse);
    this.setState({
      platform: '',
      network: '',
      displayName: '',
      url: '',
      apiKey: ''
    });
  }

  onChangeConfigForm = (event: any) => {
    const keyName: string = event.target.name;
    this.setState<never>({[keyName]: event.target.value});
  }

  render() {
    const {
      open,
    } = this.props;
    const { platform, network, displayName, url, apiKey } = this.state;
    const isAddActive = platform && network && displayName && url && apiKey;
    return (
      <Dialog
        open={open}
        onClose={this.closeModal}
        aria-labelledby='form-dialog-title'
        maxWidth='md'
        fullWidth
      >
        <DialogTitle id='form-dialog-title'>Add Network</DialogTitle>
        <DialogContent>
          <RowContainer>
            <TextWrapper
              autoFocus
              id='platform'
              name='platform'
              label='Platform'
              value={platform}
              onChange={this.onChangeConfigForm}
            />
            <TextWrapper
              id='network'
              name='network'
              label='network'
              value={network}
              onChange={this.onChangeConfigForm}
            />
          </RowContainer>
          <RowContainer>
            <TextWrapper
              id='displayName'
              name='displayName'
              label='Display Name'
              value={displayName}
              onChange={this.onChangeConfigForm}
            />
            <TextWrapper
              id='url'
              name='url'
              label='Url'
              value={url}
              onChange={this.onChangeConfigForm}
            />
          </RowContainer>
          <RowContainer>
            <TextWrapper
              id='apiKey'
              name='apiKey'
              label='Api Key'
              value={apiKey}
              onChange={this.onChangeConfigForm}
            />
          </RowContainer>
        </DialogContent>
        <DialogActions>
          <ClearButton onClick={this.closeModal}>Cancel</ClearButton>
          <AddButton isDisable={!isAddActive} onClick={() => this.onAdd(true)}>Use</AddButton>
          <AddButton isDisable={!isAddActive} onClick={() => this.onAdd(false)}>Add</AddButton>
        </DialogActions>
      </Dialog>
    );
  }
};

export default ConfigModal;
