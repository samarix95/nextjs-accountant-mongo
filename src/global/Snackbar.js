import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';

import { closeSnackbar } from '../../actions';

function SlideTransition(props) {
    return <Slide {...props} direction="up" />;
}

const SnackbarComponent = () => {
    const state = useSelector((state) => state);
    const dispatch = useDispatch();
    const { snackbar } = state;

    const handleClose = () => {
        dispatch(closeSnackbar());
    };

    return (
        <Snackbar
            open={snackbar.open}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            onClose={handleClose}
            TransitionComponent={SlideTransition}
            autoHideDuration={5000}
        >
            <Alert onClose={handleClose} severity={snackbar.type} sx={{ width: '100%' }}>
                {snackbar.message}
            </Alert>
        </Snackbar>
    );
}

export default SnackbarComponent;