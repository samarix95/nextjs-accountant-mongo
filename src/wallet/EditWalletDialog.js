import * as React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useDispatch } from 'react-redux';

import { openSnackbar, getUserWallets } from '../../actions';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Slide from '@mui/material/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

const EditWalletDialog = (props) => {
    const { openEditDialogData, setOpenEditDialogData } = props;
    const dispatch = useDispatch();

    const [disableDialogButtons, setDisableDialogButtons] = React.useState(false);

    const handleCloseDialog = () => {
        if (!disableDialogButtons) {
            setOpenEditDialogData({ ...openEditDialogData, openDialog: false });
        }
    };

    const handleChangeNewWalletName = (event) => {
        setOpenEditDialogData({ ...openEditDialogData, walletName: event.target.value });
    }

    const handleChangeNewWalletDescribe = (event) => {
        setOpenEditDialogData({ ...openEditDialogData, walletDescribe: event.target.value });
    }

    const handleAddNewWallet = () => {
        setDisableDialogButtons(true);
        axios.request({
            method: "put",
            url: "/api/wallet",
            data: { id: openEditDialogData.walletId, walletName: openEditDialogData.walletName, walletDescribe: openEditDialogData.walletDescribe },
        })
            .then(response => {
                setDisableDialogButtons(false);
                dispatch(openSnackbar(true, response.data.message, "success"));
                setOpenEditDialogData({ ...openEditDialogData, openDialog: false });
                dispatch(getUserWallets());
            })
            .catch(error => {
                setDisableDialogButtons(false);
                dispatch(openSnackbar(true, error.response.data.message, "error"));
            });
    }

    return (
        <Dialog
            open={openEditDialogData.openDialog}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleCloseDialog}
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle>Edit wallet</DialogTitle>
            <DialogContent>
                <Stack spacing={1}>
                    <TextField
                        disabled={disableDialogButtons}
                        value={openEditDialogData.walletName || ''}
                        required
                        id="wallet-name-field"
                        label="Wallet name"
                        size="small"
                        variant="standard"
                        onChange={handleChangeNewWalletName}
                    />
                    <TextField
                        disabled={disableDialogButtons}
                        value={openEditDialogData.walletDescribe || ''}
                        id="wallet-describe-field"
                        label="Wallet describe"
                        size="small"
                        variant="standard"
                        onChange={handleChangeNewWalletDescribe}
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button disabled={disableDialogButtons} onClick={handleCloseDialog}>Cancel</Button>
                <Button disabled={disableDialogButtons} onClick={handleAddNewWallet}>Update</Button>
            </DialogActions>
        </Dialog>
    );
}

EditWalletDialog.propTypes = {
    openEditDialogData: PropTypes.object.isRequired,
    setOpenEditDialogData: PropTypes.func.isRequired,
};

export default EditWalletDialog;