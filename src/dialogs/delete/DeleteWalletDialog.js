import * as React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';

import { openSnackbar, getUserWallets, setSelectedWallet } from '../../../actions';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Slide from '@mui/material/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

const DeleteWalletDialog = (props) => {
    const state = useSelector((state) => state);
    const { userWallets } = state;
    const { openDeleteDialogData, setOpenDeleteDialogData } = props;
    const dispatch = useDispatch();

    const [disableDialogButtons, setDisableDialogButtons] = React.useState(false);

    const handleCloseDialog = () => {
        if (!disableDialogButtons) {
            setOpenDeleteDialogData({ ...openDeleteDialogData, openDialog: false });
        }
    };

    const handleDeleteWallet = () => {
        setDisableDialogButtons(true);
        axios.request({
            method: "delete",
            url: "/api/wallet",
            data: { id: openDeleteDialogData.walletId },
        })
            .then(response => {
                if (localStorage.getItem("selectedWalletId") == openDeleteDialogData.walletId) {
                    const newId = Object.keys(userWallets.data).length > 1 ? userWallets.data[1]._id : null;
                    localStorage.setItem("selectedWalletId", newId);
                    dispatch(setSelectedWallet(newId));
                }
                setDisableDialogButtons(false);
                dispatch(openSnackbar(true, response.data.message, "success"));
                setOpenDeleteDialogData({ ...openDeleteDialogData, openDialog: false });
                dispatch(getUserWallets());
            })
            .catch(error => {
                setDisableDialogButtons(false);
                dispatch(openSnackbar(true, error.response.data.message, "error"));
            });
    }

    return (
        <Dialog
            open={openDeleteDialogData.openDialog}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleCloseDialog}
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle>Do you want to delete wallet "{openDeleteDialogData.walletName}"?</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Balance and history will be delete
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button disabled={disableDialogButtons} size="small" variant="text" onClick={handleCloseDialog}>Cancel</Button>
                <Button disabled={disableDialogButtons} size="small" variant="contained" onClick={handleDeleteWallet}>Delete</Button>
            </DialogActions>
        </Dialog>
    );
}

DeleteWalletDialog.propTypes = {
    openDeleteDialogData: PropTypes.object.isRequired,
    setOpenDeleteDialogData: PropTypes.func.isRequired,
};

export default DeleteWalletDialog;