import * as React from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';

import { openSnackbar, getUserBalances, closeEditBudgetDialog } from '../../actions';
import AddCategoryDialog from '../category/AddCategoryDialog';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Slide from '@mui/material/Slide';
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
    const { userCategories, userBalances, editBudgetDialog } = state;
    const balanceData = userBalances.data.find(x => x._id === editBudgetDialog.balanceId);
    const currentCategoryData = userCategories.data.find(x => x._id === balanceData.categoryData._id);
    const availableCategories = userCategories.data.filter(x => x.isSpending === balanceData.categoryData.isSpending);

    const [disableDialogButtons, setDisableDialogButtons] = React.useState(false);
    const [selectedCategory, setSelectedCategory] = React.useState(currentCategoryData);
    const [value, setValue] = React.useState(balanceData.balance);
    const [openAddCategoryDialogData, setOpenAddCategoryDialogData] = React.useState({ openDialog: false, categoryName: '', isSpending: false });

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

    const handleSetNewValue = (event) => {
        setValue(event.target.value);
    }

    const handleAddNewBudget = () => {
        if (selectedCategory === null) {
            dispatch(openSnackbar(true, "Select category", "error"));
            return;
        }
        setDisableDialogButtons(true);
        axios.request({
            method: "put",
            url: "/api/balance",
            data: { id: editBudgetDialog.balanceId, categoryId: selectedCategory._id, value: value },
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
                    <Stack spacing={2}>
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
                                    setOpenAddCategoryDialogData({ openDialog: true, categoryName: newValue.inputValue, isSpending: openEditBudgetDialogData.isSpending });
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
                                    variant="standard"
                                    label="Select category or type new"
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
                            id="buget-value"
                            variant="standard"
                            label="Value"
                            type="number"
                            value={value}
                            onChange={handleSetNewValue}
                            required
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button disabled={disableDialogButtons} size="small" variant="text" onClick={handleCloseDialog}>Cancel</Button>
                    <Button disabled={disableDialogButtons} size="small" variant="contained" onClick={handleAddNewBudget}>Update</Button>
                </DialogActions>
            </Dialog >
            <AddCategoryDialog openAddDialogData={openAddCategoryDialogData} setOpenAddDialogData={setOpenAddCategoryDialogData} />
        </React.Fragment >
    );
}

export default EditBudgetDialog;
