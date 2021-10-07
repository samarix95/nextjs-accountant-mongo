import * as React from 'react';

import ProTip from '../src/ProTip';
import Copyright from '../src/Copyright';
import AddBudgetDialog from '../src/balance/AddBudgetDialog';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';

import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';

const Balance = () => {
    const [openAddBudgetDialogData, setOpenAddBudgetDialogData] = React.useState({ openDialog: false, budgetType: '', isSpending: false });

    const handleOpenAddBudget = (type) => {
        setOpenAddBudgetDialogData({
            openDialog: true,
            budgetType: type,
            isSpending: type === "outgoing",
        });
    }

    return (
        <Container maxWidth="sm">
            <AddBudgetDialog openAddBudgetDialogData={openAddBudgetDialogData} setOpenAddBudgetDialogData={setOpenAddBudgetDialogData} />
            <Box sx={{ my: 4 }}>
                <Box sx={{ p: 1, display: 'flex', justifyContent: 'center' }}>
                    <Stack direction="row" spacing={2}>
                        <IconButton aria-label="add" color="success" size="large" onClick={() => handleOpenAddBudget("incoming")}>
                            <AddCircleOutlineOutlinedIcon fontSize="large" />
                        </IconButton>
                        <IconButton aria-label="delete" color="error" size="large" onClick={() => handleOpenAddBudget("outgoing")}>
                            <RemoveCircleOutlineOutlinedIcon fontSize="large" />
                        </IconButton>
                    </Stack>
                </Box>
                <Typography variant="h4" component="h1" gutterBottom>
                    Balance page
                </Typography>
            </Box>
            <ProTip />
            <Copyright />
        </Container>
    );
}

export default Balance;