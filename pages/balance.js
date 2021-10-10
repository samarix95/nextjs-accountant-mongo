import * as React from 'react';
import { useSelector } from 'react-redux';

import ProTip from '../src/ProTip';
import Copyright from '../src/Copyright';
import AddBudgetDialog from '../src/balance/AddBudgetDialog';
import Row from '../src/balance/Row';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';

const Balance = () => {
    const state = useSelector((state) => state);
    const { userBalances } = state;

    const [openAddBudgetDialogData, setOpenAddBudgetDialogData] = React.useState({ openDialog: false, budgetType: '', isSpending: false });

    const handleOpenAddBudget = (type) => {
        setOpenAddBudgetDialogData({ openDialog: true, budgetType: type, isSpending: type === "outgoing" });
    }

    return (
        <Container>
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
                {userBalances.loading
                    ? <Stack sx={{ display: 'flex', height: 200, alignItems: 'center', justifyContent: 'center', }}>
                        <CircularProgress />
                        <Typography variant="body2">
                            Loading balance
                        </Typography>
                    </Stack>
                    : <Box sx={{ p: 1 }}>
                        <TableContainer component={Paper}>
                            <Table aria-label="collapsible table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell />
                                        <TableCell>Category</TableCell>
                                        <TableCell>Balance</TableCell>
                                        <TableCell>Category description</TableCell>
                                        <TableCell />
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {userBalances.data
                                        .sort((a, b) => Number(a.categoryData.isSpending) - Number(b.categoryData.isSpending) || Math.abs(b.balance) - Math.abs(a.balance))
                                        .map((row, key) => (
                                            <Row key={key} row={row} />
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                }
            </Box>
            <ProTip />
            <Copyright />
        </Container>
    );
}

export default Balance;