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

const AddWalletDialog = (props) => {
    const { openDialog, setOpenDialog } = props;
    const dispatch = useDispatch();

    const [newWalletName, setNewWalletName] = React.useState('');
    const [newWalletDescribe, setNewWalletDescribe] = React.useState('');
    const [disableDialogButtons, setDisableDialogButtons] = React.useState(false);

    const resetWalletDialogData = () => {
        setNewWalletName('');
        setNewWalletDescribe('');
    }

    const handleCloseDialog = () => {
        if (!disableDialogButtons) {
            setOpenDialog(false);
            resetWalletDialogData();
        }
    };

    const handleChangeNewWalletName = (event) => {
        setNewWalletName(event.target.value);
    }

    const handleChangeNewWalletDescribe = (event) => {
        setNewWalletDescribe(event.target.value);
    }

    const handleAddNewWallet = () => {
        setDisableDialogButtons(true);
        axios.request({
            method: "post",
            url: "/api/wallet",
            data: { walletName: newWalletName, walletDescribe: newWalletDescribe },
        })
            .then(response => {
                setDisableDialogButtons(false);
                setOpenDialog(false);
                resetWalletDialogData();
                dispatch(openSnackbar(true, response.data.message, "success"));
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
            <DialogTitle>Add new wallet</DialogTitle>
            <DialogContent>
                <Stack spacing={1}>
                    <TextField
                        disabled={disableDialogButtons}
                        value={newWalletName}
                        required
                        id="wallet-name-field"
                        label="Wallet name"
                        size="small"
                        variant="standard"
                        onChange={handleChangeNewWalletName}
                    />
                    <TextField
                        disabled={disableDialogButtons}
                        value={newWalletDescribe}
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
                <Button disabled={disableDialogButtons} onClick={handleAddNewWallet}>Add</Button>
            </DialogActions>
        </Dialog>
    );
}

AddWalletDialog.propTypes = {
    openDialog: PropTypes.bool.isRequired,
    setOpenDialog: PropTypes.func.isRequired,
    };

export default AddWalletDialog;