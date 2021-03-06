import * as React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import enLocale from 'date-fns/locale/en-US';

import { openSnackbar, getUserBalances, openAddCategoryDialog } from '../../../actions';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Slide from '@mui/material/Slide';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import MobileDatePicker from '@mui/lab/MobileDatePicker';

const filter = createFilterOptions();

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

const AddBudgetDialog = (props) => {
    const { openAddBudgetDialogData, setOpenAddBudgetDialogData } = props;
    const dispatch = useDispatch();
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const state = useSelector((state) => state);
    const { userCategories, userWallets } = state;
    const availableCategories = userCategories.data.filter(category => category.isSpending === openAddBudgetDialogData.isSpending);

    const [disableDialogButtons, setDisableDialogButtons] = React.useState(false);
    const [changedWallet, setChangedWallet] = React.useState("");
    const [selectedCategory, setSelectedCategory] = React.useState(null);
    const [dateValue, setDateValue] = React.useState(new Date());
    const [value, setValue] = React.useState(0.0);
    const [comment, setComment] = React.useState("");

    const resetBudgetDialogData = () => {
        setSelectedCategory(null);
        setDateValue(new Date());
        setValue(0.0);
        setComment("");
    }

    const handleCloseDialog = () => {
        if (!disableDialogButtons) {
            setOpenAddBudgetDialogData({ ...openAddBudgetDialogData, openDialog: false });
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

    const handleChangeWallet = (event) => {
        setChangedWallet(event.target.value);
    }

    const handleSetNewValue = (event) => {
        if (event.target.value >= 0) {
            setValue(event.target.value);
        }
    }

    const handleSetComment = (event) => {
        setComment(event.target.value);
    }

    const handleAddNewBudget = () => {
        if (selectedCategory === null) {
            dispatch(openSnackbar(true, "Select category", "error"));
            return;
        }
        setDisableDialogButtons(true);
        axios.request({
            method: "post",
            url: "/api/balance",
            data: { date: dateValue, walletId: changedWallet, categoryId: selectedCategory._id, value: value, comment: comment, },
        })
            .then(response => {
                setDisableDialogButtons(false);
                setOpenAddBudgetDialogData({ ...openAddBudgetDialogData, openDialog: false });
                resetBudgetDialogData();
                dispatch(openSnackbar(true, response.data.message, "success"));
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
                open={openAddBudgetDialogData.openDialog}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleCloseDialog}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>Add new {openAddBudgetDialogData.budgetType}</DialogTitle>
                <DialogContent>
                    <Box sx={{ p: 1 }}>
                        <Stack spacing={2}>
                            <Paper sx={{ padding: 2 }} elevation={2}>
                                <Stack direction="row" justifyContent="space-around" alignItems="center" sx={{ width: "100%", marginBottom: 1 }}>
                                    <Button variant="text" size="small" onClick={(event) => handleChangeData(event, "prev")}>yesterday</Button>
                                    <Button variant="text" size="small" onClick={(event) => handleChangeData(event, "now")}>today</Button>
                                    <Button variant="text" size="small" onClick={(event) => handleChangeData(event, "next")}>tomorrow</Button>
                                </Stack>
                                <LocalizationProvider dateAdapter={AdapterDateFns} locale={enLocale}>
                                    <MobileDatePicker
                                        label="When *"
                                        value={dateValue}
                                        onChange={(newDateValue) => {
                                            setDateValue(newDateValue);
                                        }}
                                        renderInput={(params) => <TextField fullWidth {...params} />}
                                    />
                                </LocalizationProvider>
                            </Paper>
                            <FormControl required>
                                <InputLabel id="wallet-simple-select-label">Wallet</InputLabel>
                                <Select
                                    labelId="wallet-simple-select-label"
                                    id="wallet-simple-select"
                                    value={changedWallet}
                                    label="Wallet *"
                                    fullWidth
                                    onChange={handleChangeWallet}
                                >
                                    {userWallets.data.map((item, key) => (
                                        <MenuItem key={key} value={item._id}>{item.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <Autocomplete
                                selectOnFocus
                                clearOnBlur
                                handleHomeEndKeys
                                id="free-solo-categories"
                                options={availableCategories}
                                value={selectedCategory}
                                freeSolo
                                fullWidth
                                disabled={userCategories.loading}
                                sx={{ minWidth: 300 }}
                                onChange={(event, newValue) => {
                                    if (typeof newValue === 'string') {
                                        setSelectedCategory({ name: newValue });
                                    } else if (newValue && newValue.inputValue) {
                                        // Create a new value from the user input
                                        dispatch(openAddCategoryDialog(Boolean(openAddBudgetDialogData.isSpending), newValue.inputValue, ""));
                                    } else {
                                        setSelectedCategory(newValue);
                                    }
                                }}
                                filterOptions={(options, params) => {
                                    const filtered = filter(options, params);
                                    const { inputValue } = params;
                                    // Suggest the creation of a new value
                                    const isExisting = options.some((option) => inputValue === option.name);
                                    if (inputValue !== '' && !isExisting) {
                                        filtered.push({ inputValue, name: `Add new category "${inputValue}"` });
                                    }

                                    return filtered;
                                }}
                                getOptionLabel={(option) => {
                                    // Value selected with enter, right from the input
                                    if (typeof option === 'string') {
                                        return option;
                                    }
                                    // Add "xxx" option created dynamically
                                    if (option.inputValue) {
                                        return option.inputValue;
                                    }
                                    // Regular option
                                    return option.name;
                                }}
                                renderOption={(props, option) => <li {...props}>{option.name}</li>}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        required
                                        label="Category"
                                        InputProps={{
                                            ...params.InputProps,
                                            endAdornment: (
                                                <React.Fragment>
                                                    {userCategories.loading && (<CircularProgress color="inherit" size={20} />)}
                                                    {params.InputProps.endAdornment}
                                                </React.Fragment>
                                            ),
                                        }}
                                    />
                                )}
                            />
                            <TextField id="buget-value" label="Value" type="number" value={value} onChange={handleSetNewValue} required />
                            <TextField id="budget_comment" label="Comment" multiline rows={2} value={comment} onChange={handleSetComment} />
                        </Stack>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button disabled={disableDialogButtons} size="small" variant="text" onClick={handleCloseDialog}>Cancel</Button>
                    <Button disabled={disableDialogButtons} size="small" variant="contained" onClick={handleAddNewBudget}>Add</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

AddBudgetDialog.propTypes = {
    openAddBudgetDialogData: PropTypes.object.isRequired,
    setOpenAddBudgetDialogData: PropTypes.func.isRequired,
};

export default AddBudgetDialog;
