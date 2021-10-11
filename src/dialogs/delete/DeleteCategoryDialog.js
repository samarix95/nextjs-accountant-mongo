import * as React from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';

import { openSnackbar, getUserCategories, closeDeleteCategoryDialog } from '../../../actions';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

const DeleteCategoryDialog = () => {
    const state = useSelector((state) => state);
    const dispatch = useDispatch();
    const { deleteCategoryDialog } = state;

    const [disableDialogButtons, setDisableDialogButtons] = React.useState(false);

    const handleCloseDialog = () => {
        if (!disableDialogButtons) {
            dispatch(closeDeleteCategoryDialog());
        }
    };

    const handleDeleteCategory = () => {
        setDisableDialogButtons(true);
        axios.request({
            method: "delete",
            url: "/api/category",
            data: { id: deleteCategoryDialog.id },
        })
            .then(response => {
                setDisableDialogButtons(false);
                dispatch(openSnackbar(true, response.data.message, "success"));
                dispatch(closeDeleteCategoryDialog());
                dispatch(getUserCategories());
            })
            .catch(error => {
                setDisableDialogButtons(false);
                dispatch(openSnackbar(true, error.response.data.message, "error"));
            });
    }

    return (
        <Dialog
            open={deleteCategoryDialog.openDialog}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleCloseDialog}
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle>Do you want to delete category "{deleteCategoryDialog.name}"?</DialogTitle>
            <DialogActions>
                <Button disabled={disableDialogButtons} size="small" variant="text" onClick={handleCloseDialog}>Cancel</Button>
                <Button disabled={disableDialogButtons} size="small" variant="contained" onClick={handleDeleteCategory}>Delete</Button>
            </DialogActions>
        </Dialog>
    );
}

export default DeleteCategoryDialog;