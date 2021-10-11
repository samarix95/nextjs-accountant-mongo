import * as React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useDispatch } from 'react-redux';

import { openSnackbar, getUserCategories } from '../../../actions';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

const DeleteCategoryDialog = (props) => {
    const { openDeleteDialogData, setOpenDeleteDialogData } = props;
    const dispatch = useDispatch();

    const [disableDialogButtons, setDisableDialogButtons] = React.useState(false);

    const handleCloseDialog = () => {
        if (!disableDialogButtons) {
            setOpenDeleteDialogData({ ...openDeleteDialogData, openDialog: false });
        }
    };

    const handleDeleteCategory = () => {
        setDisableDialogButtons(true);
        axios.request({
            method: "delete",
            url: "/api/category",
            data: { id: openDeleteDialogData.categoryId },
        })
            .then(response => {
                setDisableDialogButtons(false);
                dispatch(openSnackbar(true, response.data.message, "success"));
                setOpenDeleteDialogData({ ...openDeleteDialogData, openDialog: false });
                dispatch(getUserCategories());
            })
            .catch(error => {
                setDisableDialogButtons(false);
                dispatch(openSnackbar(true, error.response.data.message, "error"));
            });
    }

    return (
        <Dialog
            open={openDeleteDialogData.openDialog}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleCloseDialog}
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle>Do you want to delete category "{openDeleteDialogData.categoryName}"?</DialogTitle>
            <DialogActions>
                <Button disabled={disableDialogButtons} size="small" variant="text" onClick={handleCloseDialog}>Cancel</Button>
                <Button disabled={disableDialogButtons} size="small" variant="contained" onClick={handleDeleteCategory}>Delete</Button>
            </DialogActions>
        </Dialog>
    );
}

DeleteCategoryDialog.propTypes = {
    openDeleteDialogData: PropTypes.object.isRequired,
    setOpenDeleteDialogData: PropTypes.func.isRequired,
};

export default DeleteCategoryDialog;