import * as React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import { openEditBudgetDialog, openDeleteBudgetDialog } from '../../actions';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Stack from '@mui/material/Stack';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';

const Row = (props) => {
    const { row } = props;
    const [open, setOpen] = React.useState(false);
    const dispatch = useDispatch();

    const handleEditBalance = (event, id) => {
        dispatch(openEditBudgetDialog(true, id));
    }

    const handleDeleteBalance = (event, id) => {
        dispatch(openDeleteBudgetDialog(true, id));
    }

    const handleEditBalanceHisrory = (event, id) => {
        console.log(id);
    }

    const handleDeleteBalanceHisrory = (event, id) => {
        console.log(id);
    }

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
                <TableCell>
                    <Stack direction="row">
                        <IconButton sx={{ marginLeft: "auto" }} size="small" onClick={(event) => handleEditBalance(event, row._id)}><EditIcon /></IconButton>
                        <IconButton size="small" onClick={(event) => handleDeleteBalance(event, row._id)}><DeleteIcon /></IconButton>
                    </Stack>
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
                                        <TableCell />
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
                                                <TableCell>
                                                    <Stack direction="row">
                                                        <IconButton sx={{ marginLeft: "auto" }} size="small" onClick={(event) => handleEditBalanceHisrory(event, historyRow._id)}><EditIcon /></IconButton>
                                                        <IconButton size="small" onClick={(event) => handleDeleteBalanceHisrory(event, historyRow._id)}><DeleteIcon /></IconButton>
                                                    </Stack>
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

export default Row;