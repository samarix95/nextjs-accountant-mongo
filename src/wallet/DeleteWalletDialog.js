import * as React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useDispatch } from 'react-redux';

import { openSnackbar, getUserWallets } from '../../actions';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

const DeleteWalletDialog = (props) => {
    const { openDialog, setOpenDialog, walletData } = props;
    const dispatch = useDispatch();

    const [disableDialogButtons, setDisableDialogButtons] = React.useState(false);

    const handleCloseDialog = () => {
        if (!disableDialogButtons) {
            setOpenDialog(false);
        }
    };

    const handleAddNewWallet = () => {
        setDisableDialogButtons(true);
        axios.request({
            method: "delete",
            url: "/api/wallet",
            data: { id: walletData.walletId },
        })
            .then(response => {
                setDisableDialogButtons(false);
                dispatch(openSnackbar(true, response.data.message, "success"));
                setOpenDialog(false);
                dispatch(getUserWallets());
            })
            .catch(error => {
                setDisableDialogButtons(false);
                dispatch(openSnackbar(true, error.response.data.message, "error"));
            });
    }

    return (
        <Dialog
            open={openDialog}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleCloseDialog}
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle>Do you want to delete wallet "{walletData.walletName}"?</DialogTitle>
            <DialogActions>
                <Button disabled={disableDialogButtons} onClick={handleCloseDialog}>Cancel</Button>
                <Button disabled={disableDialogButtons} onClick={handleAddNewWallet}>Delete</Button>
            </DialogActions>
        </Dialog>
    );
}

DeleteWalletDialog.propTypes = {
    openDialog: PropTypes.bool.isRequired,
    setOpenDialog: PropTypes.func.isRequired,
    walletData: PropTypes.object.isRequired,
};

export default DeleteWalletDialog;