import * as React from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import enLocale from 'date-fns/locale/en-US';

import { openSnackbar, getUserBalances, closeEditBudgetHistoryDialog } from '../../../actions';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Slide from '@mui/material/Slide';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import MobileDatePicker from '@mui/lab/MobileDatePicker';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

const EditBudgetHistoryDialog = () => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const state = useSelector((state) => state);
    const { userBalances, editBudgetHistoryDialog } = state;
    const balanceData = userBalances.data.find(x => x._id === editBudgetHistoryDialog.balanceId);
    const historyData = balanceData.balanceHistory.find(x => x._id === editBudgetHistoryDialog.historyId);

    const [disableDialogButtons, setDisableDialogButtons] = React.useState(false);
    const [dateValue, setDateValue] = React.useState(new Date(historyData.date));
    const [value, setValue] = React.useState(historyData.value);
    const [comment, setComment] = React.useState(historyData.comment);

    const resetBudgetDialogData = () => {
        setDateValue(new Date());
        setValue(0.0);
        setComment("");
    }

    const handleCloseDialog = () => {
        if (!disableDialogButtons) {
            dispatch(closeEditBudgetHistoryDialog());
            resetBudgetDialogData();
        }
    };

    const handleChangeData = (event, value) => {
        let date = new Date();
        switch (value) {
            case "prev":
                date.setDate(date.getDate() - 1);
                break;
            case "next":
                date.setDate(date.getDate() + 1);
                break;
            default:
                break;
        }
        setDateValue(date);
    }

    const handleSetNewValue = (event) => {
        setValue(event.target.value);
    }

    const handleSetComment = (event) => {
        setComment(event.target.value);
    }

    const handleAddNewBudget = () => {
        setDisableDialogButtons(true);
        axios.request({
            method: "put",
            url: "/api/balance-history",
            data: { id: editBudgetHistoryDialog.historyId, date: dateValue, value: value, comment: comment, },
        })
            .then(response => {
                setDisableDialogButtons(false);
                resetBudgetDialogData();
                dispatch(openSnackbar(true, response.data.message, "success"));
                dispatch(closeEditBudgetHistoryDialog());
                dispatch(getUserBalances());
            })
            .catch(error => {
                setDisableDialogButtons(false);
                dispatch(openSnackbar(true, error.response.data.message, "error"));
            });
    }

    return (
        <React.Fragment>
            <Dialog
                fullScreen={fullScreen}
                open={editBudgetHistoryDialog.openDialog}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleCloseDialog}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>Edit balance history</DialogTitle>
                <DialogContent>
                    <Box sx={{ p: 1 }}>
                        <Stack spacing={2}>
                            <Paper sx={{ padding: 2 }}>
                                <Stack direction="row" justifyContent="space-around" alignItems="center" sx={{ width: "100%", marginBottom: 1 }}>
                                    <Button variant="text" size="small" onClick={(event) => handleChangeData(event, "prev")}>yesterday</Button>
                                    <Button variant="text" size="small" onClick={(event) => handleChangeData(event, "now")}>today</Button>
                                    <Button variant="text" size="small" onClick={(event) => handleChangeData(event, "next")}>tomorrow</Button>
                                </Stack>
                                <LocalizationProvider dateAdapter={AdapterDateFns} locale={enLocale}>
                                    <MobileDatePicker
                                        label="When"
                                        value={dateValue}
                                        onChange={(newDateValue) => {
                                            setDateValue(newDateValue);
                                        }}
                                        renderInput={(params) => <TextField fullWidth variant="standard" {...params} />}
                                    />
                                </LocalizationProvider>
                            </Paper>
                            <TextField id="buget-value" variant="standard" label="Value" type="number" value={value} onChange={handleSetNewValue} required />
                            <TextField id="budget_comment" variant="standard" label="Comment" multiline rows={2} value={comment} onChange={handleSetComment} />
                        </Stack>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button disabled={disableDialogButtons} size="small" variant="text" onClick={handleCloseDialog}>Cancel</Button>
                    <Button disabled={disableDialogButtons} size="small" variant="contained" onClick={handleAddNewBudget}>Update</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

export default EditBudgetHistoryDialog;
