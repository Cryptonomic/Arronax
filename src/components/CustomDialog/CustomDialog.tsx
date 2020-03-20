import React from 'react';
import { useTranslation } from 'react-i18next';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { DialogContentWrapper, DismissButton } from './styles';

const CustomDialog = (props: any) => {
    const { t } = useTranslation();
    const { open, onClose, title, message, dissmiss } = props;

    return (
        <Dialog open={open} onClose={onClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
            <DialogTitle id="alert-dialog-title">{t(title)}</DialogTitle>
            {message && (
                <DialogContentWrapper>
                    <DialogContentText id="alert-dialog-description">{message}</DialogContentText>
                </DialogContentWrapper>
            )}
            {dissmiss && (
                <DialogActions>
                    <DismissButton onClick={onClose}>{t(dissmiss)}</DismissButton>
                </DialogActions>
            )}
        </Dialog>
    );
};

export default CustomDialog;
