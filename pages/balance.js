import * as React from 'react';
import { useSelector } from 'react-redux';

import ProTip from '../src/ProTip';
import Copyright from '../src/Copyright';
import AddBudgetDialog from '../src/balance/AddBudgetDialog';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import PropTypes from 'prop-types';
import Collapse from '@mui/material/Collapse';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';

function Row(props) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);

    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell>{row.categoryData.name}</TableCell>
                <TableCell>{row.balance}</TableCell>
                <TableCell>{row.categoryData.description}</TableCell>
                <TableCell align="right">
                    <IconButton size="small"><EditIcon /></IconButton>
                    <IconButton size="small"><DeleteIcon /></IconButton>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                {row.categoryData.name} history
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Value</TableCell>
                                        <TableCell>Comment</TableCell>
                                        <TableCell align="right">Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {row.balanceHistory
                                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                        .map((historyRow, key) => (
                                            <TableRow key={key}>
                                                <TableCell>{new Date(historyRow.date).toLocaleString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' })}</TableCell>
                                                <TableCell>{historyRow.value}</TableCell>
                                                <TableCell>{historyRow.comment}</TableCell>
                                                <TableCell align="right">
                                                    <IconButton size="small"><EditIcon /></IconButton>
                                                    <IconButton size="small"><DeleteIcon /></IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

Row.propTypes = {
    row: PropTypes.shape({
        balance: PropTypes.number.isRequired,
        categoryData: PropTypes.shape({
            name: PropTypes.string.isRequired,
            description: PropTypes.string,
        }),
        balanceHistory: PropTypes.arrayOf(
            PropTypes.shape({
                date: PropTypes.string.isRequired,
                value: PropTypes.number.isRequired,
                comment: PropTypes.string,
            }),
        ).isRequired,
    }).isRequired,
};


const Balance = () => {
    const state = useSelector((state) => state);
    const { userBalances } = state;

    const [openAddBudgetDialogData, setOpenAddBudgetDialogData] = React.useState({ openDialog: false, budgetType: '', isSpending: false });

    const handleOpenAddBudget = (type) => {
        setOpenAddBudgetDialogData({
            openDialog: true,
            budgetType: type,
            isSpending: type === "outgoing",
        });
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
                            Loading balances
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
                                        <TableCell align="right">Action</TableCell>
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