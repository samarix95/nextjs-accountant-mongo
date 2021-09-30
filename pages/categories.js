import * as React from 'react';
import { useSelector } from 'react-redux';

import AddCategoryDialog from '../src/category/AddCategoryDialog';
import EditCategoryDialog from '../src/category/EditCategoryDialog';
import DeleteCategoryDialog from '../src/category/DeleteCategoryDialog';
import ProTip from '../src/ProTip';
import Copyright from '../src/Copyright';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddBoxIcon from '@mui/icons-material/AddBox';

const Categories = () => {
    const state = useSelector((state) => state);

    const { userCategories } = state;

    const [openAddDialog, setOpenAddDialog] = React.useState(false);
    const [openEditDialogData, setOpenEditDialogData] = React.useState({ openDialog: false, categoryId: '', categoryName: '', categoryDescription: '', isSpending: false });
    const [openDeleteDialogData, setOpenDeleteDialogData] = React.useState({ openDialog: false, categoryId: '', categoryName: '' });

    const handleAddCategory = () => {
        setOpenAddDialog(true);
    }

    const handleEditCategory = (id, name, description, spending) => {
        setOpenEditDialogData({ openDialog: true, categoryId: id, categoryName: name, categoryDescription: description, isSpending: spending });
    }

    const handleDeleteCategory = (id, name) => {
        setOpenDeleteDialogData({ openDialog: true, categoryId: id, categoryName: name });
    }

    return (
        <Container maxWidth="sm">
            <AddCategoryDialog openDialog={openAddDialog} setOpenDialog={setOpenAddDialog} />
            <EditCategoryDialog openEditDialogData={openEditDialogData} setOpenEditDialogData={setOpenEditDialogData} />
            <DeleteCategoryDialog openDeleteDialogData={openDeleteDialogData} setOpenDeleteDialogData={setOpenDeleteDialogData} />
            <Box sx={{ my: 4 }}>
                {userCategories.loading
                    ? <Stack sx={{ display: 'flex', height: 200, alignItems: 'center', justifyContent: 'center', }}>
                        <CircularProgress />
                        <Typography variant="body2">
                            Loading categories
                        </Typography>
                    </Stack>
                    : <Box sx={{ p: 1 }}>
                        <Stack spacing={1} direction={{ xs: 'column', sm: 'row' }} >
                            <Stack spacing={1} >
                                {userCategories.data.length > 0 && (<Typography variant="h6">Incomings</Typography>)}
                                {userCategories.data
                                    .sort((a, b) => Number(a.isSpending) - Number(b.isSpending) || a.name.localeCompare(b.name))
                                    .filter(category => !category.isSpending)
                                    .map(item =>
                                        <Card key={item._id} variant="outlined">
                                            <CardContent>
                                                <Typography variant="subtitle2" gutterBottom>
                                                    {item.name}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {item.description}
                                                </Typography>
                                            </CardContent>
                                            <CardActions>
                                                <Stack direction="row" spacing={1}>
                                                    <Button size="small" color="inherit" startIcon={<EditIcon />} onClick={() => handleEditCategory(item._id, item.name, item.description)}>Edit</Button>
                                                    <Button size="small" color="inherit" startIcon={<DeleteIcon />} onClick={() => handleDeleteCategory(item._id, item.name)}>Delete</Button>
                                                </Stack>
                                            </CardActions>
                                        </Card>
                                    )}
                            </Stack>
                            <Stack spacing={1} >
                                {userCategories.data.length > 0 && (<Typography variant="h6">Outgoings</Typography>)}
                                {userCategories.data
                                    .sort((a, b) => Number(a.isSpending) - Number(b.isSpending) || a.name.localeCompare(b.name))
                                    .filter(category => category.isSpending)
                                    .map(item =>
                                        <Card key={item._id} variant="outlined">
                                            <CardContent>
                                                <Typography variant="subtitle2" gutterBottom>
                                                    {item.name}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {item.description}
                                                </Typography>
                                            </CardContent>
                                            <CardActions>
                                                <Stack direction="row" spacing={1}>
                                                    <Button size="small" color="inherit" startIcon={<EditIcon />} onClick={() => handleEditCategory(item._id, item.name, item.description, item.isSpending)}>Edit</Button>
                                                    <Button size="small" color="inherit" startIcon={<DeleteIcon />} onClick={() => handleDeleteCategory(item._id, item.name)}>Delete</Button>
                                                </Stack>
                                            </CardActions>
                                        </Card>
                                    )}
                            </Stack>
                        </Stack>
                        <Box sx={{ p: 1, display: 'flex', justifyContent: 'center' }}>
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