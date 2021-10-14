import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { setSelectedWallet } from '../actions';

import ProTip from '../src/ProTip';
import Copyright from '../src/Copyright';
import AddBudgetDialog from '../src/dialogs/add/AddBudgetDialog';
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
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';

import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';

import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';

const Balance = () => {
    const dispatch = useDispatch();
    const state = useSelector((state) => state);
    const { userBalances, userWallets } = state;

    const [openAddBudgetDialogData, setOpenAddBudgetDialogData] = React.useState({ openDialog: false, budgetType: '', isSpending: false });
    const [selectedDate, setSelectedDate] = React.useState(new Date())
    const selectedMonth = selectedDate.getMonth() + 1;
    const selectedYear = selectedDate.getFullYear();

    const handleOpenAddBudget = (type) => {
        setOpenAddBudgetDialogData({ openDialog: true, budgetType: type, isSpending: type === "outgoing" });
    }

    const handleChangeWallet = (event) => {
        localStorage.setItem("selectedWalletId", event.target.value);
        dispatch(setSelectedWallet(event.target.value));
    }

    return (
        <Container>
            <AddBudgetDialog openAddBudgetDialogData={openAddBudgetDialogData} setOpenAddBudgetDialogData={setOpenAddBudgetDialogData} />
            <Box>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Paper sx={{ p: 1 }}>
                        <Stack spacing={1}>
                            <Stack direction="row" spacing={1}>
                                <Box sx={{ minWidth: 200 }}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DesktopDatePicker
                                            label="Month and year"
                                            value={selectedDate}
                                            views={['month', 'year']}
                                            minDate={new Date('2011-01-01')}
                                            maxDate={new Date('2030-01-01')}
                                            onChange={(newValue) => setSelectedDate(newValue)}
                                            renderInput={(params) => <TextField {...params} />}
                                        />
                                    </LocalizationProvider>
                                </Box>
                                {Object.keys(userWallets.data).length > 0 && (
                                    <FormControl fullWidth>
                                        <InputLabel id="wallet-simple-select-label">Wallet</InputLabel>
                                        <Select
                                            labelId="wallet-simple-select-label"
                                            id="wallet-simple-select"
                                            label="Wallet"
                                            value={userWallets.selectedId === null ? "summary" : userWallets.selectedId}
                                            onChange={handleChangeWallet}
                                        >
                                            <MenuItem value={"summary"}>Summary</MenuItem>
                                            {userWallets.data.map((item, key) => (
                                                <MenuItem key={key} value={item._id}>{item.name}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                )}
                            </Stack>
                            <Stack direction="row" spacing={2} justifyContent="center">
                                <IconButton aria-label="add" color="success" size="large" onClick={() => handleOpenAddBudget("incoming")}>
                                    <AddCircleOutlineOutlinedIcon fontSize="large" />
                                </IconButton>
                                <IconButton aria-label="delete" color="error" size="large" onClick={() => handleOpenAddBudget("outgoing")}>
                                    <RemoveCircleOutlineOutlinedIcon fontSize="large" />
                                </IconButton>
                            </Stack>
                        </Stack>
                    </Paper>
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
                                        <TableCell>Wallet</TableCell>
                                        <TableCell />
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {userBalances.data
                                        .sort((a, b) => Number(a.categoryData.isSpending) - Number(b.categoryData.isSpending) || Math.abs(b.balance) - Math.abs(a.balance))
                                        .filter((item) => item.month === selectedMonth && item.year === selectedYear)
                                        .map((row, key) => <Row key={key} row={row} />)
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                }
            </Box>
            <ProTip />
            <Copyright />
        </Container >
    );
}

export default Balance;