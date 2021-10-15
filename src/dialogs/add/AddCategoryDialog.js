import * as React from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';

import { openSnackbar, getUserCategories, closeAddCategoryDialog } from '../../../actions';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Slide from '@mui/material/Slide';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

const AddCategoryDialog = () => {
    const state = useSelector((state) => state);
    const dispatch = useDispatch();
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const { addCategoryDialog } = state;

    const [isSpending, setIsSpending] = React.useState(addCategoryDialog.isSpending);
    const [newCategoryName, setNewCategoryName] = React.useState(addCategoryDialog.categoryName);
    const [newCategoryDescription, setNewCategoryDescription] = React.useState(addCategoryDialog.categoryDescription);
    const [disableDialogButtons, setDisableDialogButtons] = React.useState(false);

    const resetCategoryDialogData = () => {
        setIsSpending(addCategoryDialog.isSpending);
        setNewCategoryName(addCategoryDialog.categoryName);
        setNewCategoryDescription(addCategoryDialog.categoryDescription);
    }

    const handleCloseDialog = () => {
        if (!disableDialogButtons) {
            resetCategoryDialogData();
            dispatch(closeAddCategoryDialog());
        }
    };

    const handleChangeIsSpend = (event) => {
        setIsSpending(event.target.checked);
    }

    const handleChangeNewCategoryName = (event) => {
        setNewCategoryName(event.target.value);
    }

    const handleChangeNewCategoryDescription = (event) => {
        setNewCategoryDescription(event.target.value);
    }

    const handleAddNewCategory = () => {
        setDisableDialogButtons(true);
        axios.request({
            method: "post",
            url: "/api/category",
            data: { categoryName: newCategoryName, categoryDescription: newCategoryDescription, isSpending: isSpending },
        })
            .then(response => {
                setDisableDialogButtons(false);
                resetCategoryDialogData();
                dispatch(closeAddCategoryDialog());
                dispatch(openSnackbar(true, response.data.message, "success"));
                dispatch(getUserCategories());
            })
            .catch(error => {
                setDisableDialogButtons(false);
                dispatch(openSnackbar(true, error.response.data.message, "error"));
            });
    }

    return (
        <Dialog
            fullScreen={fullScreen}
            open={addCategoryDialog.openDialog}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleCloseDialog}
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle>Add new category</DialogTitle>
            <DialogContent>
                <Box sx={{ p: 1 }}>
                    <Stack spacing={1}>
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        color="default"
                                        checked={isSpending}
                                        onChange={handleChangeIsSpend}
                                    />
                                }
                                label="Is spending"
                            />
                        </FormGroup>
                        <TextField
                            disabled={disableDialogButtons}
                            value={newCategoryName}
                            required
                            id="Category-name-field"
                            label="Category name"
                            onChange={handleChangeNewCategoryName}
                        />
                        <TextField
                            disabled={disableDialogButtons}
                            value={newCategoryDescription}
                            id="Category-description-field"
                            label="Category description"
                            onChange={handleChangeNewCategoryDescription}
                            multiline
                            rows={2}
                        />
                    </Stack>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button disabled={disableDialogButtons} size="small" variant="text" onClick={handleCloseDialog}>Cancel</Button>
                <Button disabled={disableDialogButtons} size="small" variant="contained" onClick={handleAddNewCategory}>Add</Button>
            </DialogActions>
        </Dialog>
    );
}

export default AddCategoryDialog;