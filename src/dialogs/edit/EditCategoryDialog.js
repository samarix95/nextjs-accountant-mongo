import * as React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useDispatch } from 'react-redux';

import { openSnackbar, getUserCategories } from '../../../actions';

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
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

const EditCategoryDialog = (props) => {
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

    const handleChangeIsSpend = (event) => {
        setOpenEditDialogData({ ...openEditDialogData, isSpending: event.target.checked });
    }

    const handleChangeNewCategoryName = (event) => {
        setOpenEditDialogData({ ...openEditDialogData, categoryName: event.target.value });
    }

    const handleChangeNewCategoryDescription = (event) => {
        setOpenEditDialogData({ ...openEditDialogData, categoryDescription: event.target.value });
    }

    const handleAddNewCategory = () => {
        setDisableDialogButtons(true);
        axios.request({
            method: "put",
            url: "/api/category",
            data: { id: openEditDialogData.categoryId, categoryName: openEditDialogData.categoryName, categoryDescription: openEditDialogData.categoryDescription, isSpending: openEditDialogData.isSpending },
        })
            .then(response => {
                setDisableDialogButtons(false);
                dispatch(openSnackbar(true, response.data.message, "success"));
                setOpenEditDialogData({ ...openEditDialogData, openDialog: false });
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
            open={openEditDialogData.openDialog}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleCloseDialog}
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle>Edit category</DialogTitle>
            <DialogContent>
                <Stack spacing={1}>
                    <FormGroup>
                        <FormControlLabel control={<Checkbox color="default" checked={openEditDialogData.isSpending || false} onChange={handleChangeIsSpend} />} label="Is spending" />
                    </FormGroup>
                    <TextField
                        disabled={disableDialogButtons}
                        value={openEditDialogData.categoryName || ''}
                        required
                        id="category-name-field"
                        label="Category name"
                        size="small"
                        variant="standard"
                        onChange={handleChangeNewCategoryName}
                    />
                    <TextField
                        disabled={disableDialogButtons}
                        value={openEditDialogData.categoryDescription || ''}
                        id="category-description-field"
                        label="Category description"
                        size="small"
                        variant="standard"
                        onChange={handleChangeNewCategoryDescription}
                        multiline
                        rows={2}
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button disabled={disableDialogButtons} size="small" variant="text" onClick={handleCloseDialog}>Cancel</Button>
                <Button disabled={disableDialogButtons} size="small" variant="contained" onClick={handleAddNewCategory}>Update</Button>
            </DialogActions>
        </Dialog>
    );
}

EditCategoryDialog.propTypes = {
    openEditDialogData: PropTypes.object.isRequired,
    setOpenEditDialogData: PropTypes.func.isRequired,
};

export default EditCategoryDialog;