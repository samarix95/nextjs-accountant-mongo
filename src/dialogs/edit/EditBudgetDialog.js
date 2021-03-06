import * as React from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';

import { openSnackbar, getUserBalances, closeEditBudgetDialog, openAddCategoryDialog } from '../../../actions';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
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

const filter = createFilterOptions();

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

const EditBudgetDialog = () => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const state = useSelector((state) => state);
    const { userCategories, userBalances, editBudgetDialog, userWallets } = state;
    const balanceData = userBalances.data.find(x => x._id === editBudgetDialog.balanceId);
    const currentCategoryData = userCategories.data.find(x => x._id === balanceData.categoryData._id);
    const availableCategories = userCategories.data.filter(x => x.isSpending === balanceData.categoryData.isSpending);
    const currentWalletData = userWallets.data.find(x => x._id === balanceData.walletData._id)._id;

    const [disableDialogButtons, setDisableDialogButtons] = React.useState(false);
    const [changedWallet, setChangedWallet] = React.useState(currentWalletData);
    const [selectedCategory, setSelectedCategory] = React.useState(currentCategoryData);
    const [value, setValue] = React.useState(balanceData.balance);

    const resetBudgetDialogData = () => {
        setSelectedCategory(null);
        setValue(0.0);
    }

    const handleCloseDialog = () => {
        if (!disableDialogButtons) {
            resetBudgetDialogData();
            dispatch(closeEditBudgetDialog());
        }
    };

    const handleChangeWallet = (event) => {
        setChangedWallet(event.target.value);
    }

    const handleSetNewValue = (event) => {
        setValue(event.target.value);
    }

    const handleEditBudget = () => {
        if (selectedCategory === null) {
            dispatch(openSnackbar(true, "Select category", "error"));
            return;
        }
        setDisableDialogButtons(true);
        axios.request({
            method: "put",
            url: "/api/balance",
            data: { id: editBudgetDialog.balanceId, walletId: changedWallet, categoryId: selectedCategory._id, value: value },
        })
            .then(response => {
                setDisableDialogButtons(false);
                dispatch(openSnackbar(true, response.data.message, "success"));
                resetBudgetDialogData();
                dispatch(closeEditBudgetDialog());
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
                open={editBudgetDialog.openDialog}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleCloseDialog}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>Edit balance</DialogTitle>
                <DialogContent>
                    <Box sx={{ p: 1 }}>
                        <Stack spacing={2}>
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
                                        dispatch(openAddCategoryDialog(Boolean(openEditBudgetDialogData.isSpending), newValue.inputValue, ""));
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
                            <TextField
                                required
                                id="buget-value"
                                label="Balance"
                                type="number"
                                value={value}
                                onChange={handleSetNewValue}
                            />
                        </Stack>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button disabled={disableDialogButtons} size="small" variant="text" onClick={handleCloseDialog}>Cancel</Button>
                    <Button disabled={disableDialogButtons} size="small" variant="contained" onClick={handleEditBudget}>Update</Button>
                </DialogActions>
            </Dialog >
        </React.Fragment >
    );
}

export default EditBudgetDialog;
