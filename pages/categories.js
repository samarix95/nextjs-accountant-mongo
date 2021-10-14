import * as React from "react";
import { useDispatch, useSelector } from "react-redux";

import ProTip from "../src/ProTip";
import Copyright from "../src/Copyright";

import { openAddCategoryDialog, openEditCategoryDialog, openDeleteCategoryDialog } from "../actions";

import { visuallyHidden } from "@mui/utils";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddBoxIcon from "@mui/icons-material/AddBox";

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === "desc"
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const Categories = () => {
    const state = useSelector((state) => state);
    const dispatch = useDispatch();
    const { userCategories } = state;

    const [order, setOrder] = React.useState("asc");
    const [orderBy, setOrderBy] = React.useState("isSpending");

    const createSortHandler = (property) => (event) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    const handleAddCategory = () => {
        dispatch(openAddCategoryDialog(false, "", ""));
    }

    const handleEditCategory = (event, id, name, description, spending) => {
        dispatch(openEditCategoryDialog(id, spending, name, description));
    }

    const handleDeleteCategory = (event, id, name) => {
        dispatch(openDeleteCategoryDialog(id, name));
    }

    return (
        <Container>
            <Box>
                {userCategories.loading
                    ? <Stack sx={{ display: "flex", height: 200, alignItems: "center", justifyContent: "center", }}>
                        <CircularProgress />
                        <Typography variant="body2">
                            Loading categories
                        </Typography>
                    </Stack>
                    : <Box sx={{ p: 1 }}>
                        <TableContainer component={Paper}>
                            <Table aria-labelledby="tableTitle" >
                                <TableHead>
                                    <TableRow>
                                        <TableCell sortDirection={orderBy === "name" ? order : false} >
                                            <TableSortLabel
                                                active={orderBy === "name"}
                                                direction={orderBy === "name" ? order : "asc"}
                                                onClick={createSortHandler("name")}
                                            >
                                                Name
                                                {orderBy === "name"
                                                    ? <Box sx={visuallyHidden}>
                                                        {order === "desc" ? "sorted descending" : "sorted ascending"}
                                                    </Box>
                                                    : <React.Fragment />
                                                }
                                            </TableSortLabel>
                                        </TableCell>
                                        <TableCell align="right" sortDirection={orderBy === "isSpending" ? order : false} >
                                            <TableSortLabel
                                                active={orderBy === "isSpending"}
                                                direction={orderBy === "isSpending" ? order : "asc"}
                                                onClick={createSortHandler("isSpending")}
                                            >
                                                Is spending
                                                {orderBy === "isSpending"
                                                    ? <Box sx={visuallyHidden}>
                                                        {order === "desc" ? "sorted descending" : "sorted ascending"}
                                                    </Box>
                                                    : <React.Fragment />
                                                }
                                            </TableSortLabel>
                                        </TableCell>
                                        <TableCell sortDirection={orderBy === "description" ? order : false} >
                                            <TableSortLabel
                                                active={orderBy === "description"}
                                                direction={orderBy === "description" ? order : "asc"}
                                                onClick={createSortHandler("description")}
                                            >
                                                Description
                                                {orderBy === "description"
                                                    ? <Box sx={visuallyHidden}>
                                                        {order === "desc" ? "sorted descending" : "sorted ascending"}
                                                    </Box>
                                                    : <React.Fragment />
                                                }
                                            </TableSortLabel>
                                        </TableCell>
                                        <TableCell />
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {stableSort(userCategories.data, getComparator(order, orderBy))
                                        .map((row, index) =>
                                            <TableRow hover tabIndex={-1} key={index} >
                                                <TableCell>{row.name}</TableCell>
                                                <TableCell align="right">{row.isSpending ? "Yes" : "No"}</TableCell>
                                                <TableCell>{row.description}</TableCell>
                                                <TableCell>
                                                    <Stack direction="row">
                                                        <IconButton
                                                            sx={{ marginLeft: "auto" }}
                                                            size="small"
                                                            onClick={(event) => handleEditCategory(event, row._id, row.name, row.description, row.isSpending)}
                                                        >
                                                            <EditIcon />
                                                        </IconButton>
                                                        <IconButton
                                                            size="small"
                                                            onClick={(event) => handleDeleteCategory(event, row._id, row.name)}
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </Stack>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Box sx={{ p: 1, display: "flex", justifyContent: "center" }}>
                            <Button color="inherit" size="large" startIcon={<AddBoxIcon />} onClick={handleAddCategory}>
                                Add Category
                            </Button>
                        </Box>
                    </Box>
                }
            </Box>
            <ProTip />
            <Copyright />
        </Container>
    );
}

export default Categories;