import * as React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useDispatch } from 'react-redux';

import { openSnackbar, getUserCategories } from '../../actions';

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

const AddCategoryDialog = (props) => {
    const { openDialog, setOpenDialog } = props;
    const dispatch = useDispatch();

    const [newCategoryName, setNewCategoryName] = React.useState('');
    const [newCategoryDescribe, setNewCategoryDescribe] = React.useState('');
    const [disableDialogButtons, setDisableDialogButtons] = React.useState(false);

    const resetCategoryDialogData = () => {
        setNewCategoryName('');
        setNewCategoryDescribe('');
    }

    const handleCloseDialog = () => {
        if (!disableDialogButtons) {
            setOpenDialog(false);
            resetCategoryDialogData();
        }
    };

    const handleChangeNewCategoryName = (event) => {
        setNewCategoryName(event.target.value);
    }

    const handleChangeNewCategoryDescribe = (event) => {
        setNewCategoryDescribe(event.target.value);
    }

    const handleAddNewCategory = () => {
        setDisableDialogButtons(true);
        axios.request({
            method: "post",
            url: "/api/category",
            data: { CategoryName: newCategoryName, CategoryDescribe: newCategoryDescribe },
        })
            .then(response => {
                setDisableDialogButtons(false);
                setOpenDialog(false);
                resetCategoryDialogData();
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
            open={openDialog}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleCloseDialog}
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle>Add new category</DialogTitle>
            <DialogContent>
                <Stack spacing={1}>
                    <TextField
                        disabled={disableDialogButtons}
                        value={newCategoryName}
                        required
                        id="Category-name-field"
                        label="Category name"
                        size="small"
                        variant="standard"
                        onChange={handleChangeNewCategoryName}
                    />
                    <TextField
                        disabled={disableDialogButtons}
                        value={newCategoryDescribe}
                        id="Category-describe-field"
                        label="Category describe"
                        size="small"
                        variant="standard"
                        onChange={handleChangeNewCategoryDescribe}
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button disabled={disableDialogButtons} onClick={handleCloseDialog}>Cancel</Button>
                <Button disabled={disableDialogButtons} onClick={handleAddNewCategory}>Add</Button>
            </DialogActions>
        </Dialog>
    );
}

AddCategoryDialog.propTypes = {
    openDialog: PropTypes.bool.isRequired,
    setOpenDialog: PropTypes.func.isRequired,
};

export default AddCategoryDialog;