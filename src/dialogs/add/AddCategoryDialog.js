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

const AddCategoryDialog = (props) => {
    const { openAddDialogData, setOpenAddDialogData } = props;
    const dispatch = useDispatch();
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const [newCategoryDescription, setNewCategoryDescription] = React.useState('');
    const [disableDialogButtons, setDisableDialogButtons] = React.useState(false);

    const resetCategoryDialogData = () => {
        setNewCategoryDescription('');
    }

    const handleCloseDialog = () => {
        if (!disableDialogButtons) {
            setOpenAddDialogData({ ...openAddDialogData, openDialog: false });
            resetCategoryDialogData();
        }
    };

    const handleChangeIsSpend = (event) => {
        setOpenAddDialogData({ ...openAddDialogData, isSpending: event.target.checked });
    }

    const handleChangeNewCategoryName = (event) => {
        setOpenAddDialogData({ ...openAddDialogData, categoryName: event.target.value });
    }

    const handleChangeNewCategoryDescription = (event) => {
        setNewCategoryDescription(event.target.value);
    }

    const handleAddNewCategory = () => {
        setDisableDialogButtons(true);
        axios.request({
            method: "post",
            url: "/api/category",
            data: { categoryName: openAddDialogData.categoryName, categoryDescription: newCategoryDescription, isSpending: openAddDialogData.isSpending },
        })
            .then(response => {
                setDisableDialogButtons(false);
                setOpenAddDialogData({ ...openAddDialogData, openDialog: false });
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
            fullScreen={fullScreen}
            open={openAddDialogData.openDialog}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleCloseDialog}
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle>Add new category</DialogTitle>
            <DialogContent>
                <Stack spacing={1}>
                    <FormGroup>
                        <FormControlLabel control={<Checkbox color="default" checked={openAddDialogData.isSpending} onChange={handleChangeIsSpend} />} label="Is spending" />
                    </FormGroup>
                    <TextField
                        disabled={disableDialogButtons}
                        value={openAddDialogData.categoryName || ''}
                        required
                        id="Category-name-field"
                        label="Category name"
                        size="small"
                        variant="standard"
                        onChange={handleChangeNewCategoryName}
                    />
                    <TextField
                        disabled={disableDialogButtons}
                        value={newCategoryDescription}
                        id="Category-description-field"
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
                <Button disabled={disableDialogButtons} size="small" variant="contained" onClick={handleAddNewCategory}>Add</Button>
            </DialogActions>
        </Dialog>
    );
}

AddCategoryDialog.propTypes = {
    openAddDialogData: PropTypes.object.isRequired,
    setOpenAddDialogData: PropTypes.func.isRequired,
};

export default AddCategoryDialog;