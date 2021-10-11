import * as React from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';

import { openSnackbar, getUserBalances, closeDeleteBudgetDialog } from '../../../actions';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

const DeleteBudgetDialog = () => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const state = useSelector((state) => state);
    const { userBalances, deleteBudgetDialog } = state;
    const balanceData = userBalances.data.find(x => x._id === deleteBudgetDialog.balanceId);

    const [disableDialogButtons, setDisableDialogButtons] = React.useState(false);

    const handleCloseDialog = () => {
        if (!disableDialogButtons) {
            dispatch(closeDeleteBudgetDialog());
        }
    };

    const handleDeleteBudget = () => {
        setDisableDialogButtons(true);
        axios.request({
            method: "delete",
            url: "/api/balance",
            data: { id: deleteBudgetDialog.balanceId },
        })
            .then(response => {
                setDisableDialogButtons(false);
                dispatch(openSnackbar(true, response.data.message, "success"));
                dispatch(closeDeleteBudgetDialog());
                dispatch(getUserBalances());
            })
            .catch(error => {
                setDisableDialogButtons(false);
                dispatch(openSnackbar(true, error.response.data.message, "error"));
            });
    }

    return (
        <Dialog
            fullScreen={fullScreen}
            open={deleteBudgetDialog.openDialog}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleCloseDialog}
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle>{`Delete balance ${balanceData.categoryData.name}?`}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Balance and his history will be delete.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button disabled={disableDialogButtons} size="small" variant="text" onClick={handleCloseDialog}>Cancel</Button>
                <Button disabled={disableDialogButtons} size="small" variant="contained" onClick={handleDeleteBudget}>Delete</Button>
            </DialogActions>
        </Dialog >
    );
}

export default DeleteBudgetDialog;
