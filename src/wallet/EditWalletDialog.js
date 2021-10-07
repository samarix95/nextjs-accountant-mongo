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
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

const EditWalletDialog = (props) => {
    const { openEditDialogData, setOpenEditDialogData } = props;
    const dispatch = useDispatch();
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const [disableDialogButtons, setDisableDialogButtons] = React.useState(false);

    const handleCloseDialog = () => {
        if (!disableDialogButtons) {
            setOpenEditDialogData({ ...openEditDialogData, openDialog: false });
        }
    };

    const handleChangeNewWalletName = (event) => {
        setOpenEditDialogData({ ...openEditDialogData, walletName: event.target.value });
    }

    const handleChangeNewWalletDescription = (event) => {
        setOpenEditDialogData({ ...openEditDialogData, walletDescription: event.target.value });
    }

    const handleAddNewWallet = () => {
        setDisableDialogButtons(true);
        axios.request({
            method: "put",
            url: "/api/wallet",
            data: { id: openEditDialogData.walletId, walletName: openEditDialogData.walletName, walletDescription: openEditDialogData.walletDescription },
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
            fullScreen={fullScreen}
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
                        value={openEditDialogData.walletDescription || ''}
                        id="wallet-description-field"
                        label="Wallet description"
                        size="small"
                        variant="standard"
                        onChange={handleChangeNewWalletDescription}
                        multiline
                        rows={2}
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button disabled={disableDialogButtons} size="small" variant="text" onClick={handleCloseDialog}>Cancel</Button>
                <Button disabled={disableDialogButtons} size="small" variant="contained" onClick={handleAddNewWallet}>Update</Button>
            </DialogActions>
        </Dialog>
    );
}

EditWalletDialog.propTypes = {
    openEditDialogData: PropTypes.object.isRequired,
    setOpenEditDialogData: PropTypes.func.isRequired,
};

export default EditWalletDialog;