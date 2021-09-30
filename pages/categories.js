import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getUserCategories } from '../actions';

import AddCategoryDialog from '../src/category/AddCategoryDialog';
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
    const dispatch = useDispatch();
    const state = useSelector((state) => state);

    const { userCategories } = state;

    const [openAddDialog, setOpenAddDialog] = React.useState(false);
    const [openEditDialogData, setOpenEditDialogData] = React.useState({ openDialog: false, categoryId: '', categoryName: '', categoryDescribe: '' });
    const [openDeleteDialogData, setOpenDeleteDialogData] = React.useState({ openDialog: false, categoryId: '', categoryName: '' });

    const handleAddCategory = () => {
        setOpenAddDialog(true);
    }

    const handleEditCategory = (id, name, describe) => {
        setOpenEditDialogData({ openDialog: true, categoryId: id, categoryName: name, categoryDescribe: describe });
    }

    const handleDeleteCategory = (id, name) => {
        setOpenDeleteDialogData({ openDialog: true, categoryId: id, categoryName: name });
    }

    React.useEffect(() => {
        dispatch(getUserCategories());
    }, [])

    return (
        <Container maxWidth="sm">
            <AddCategoryDialog openDialog={openAddDialog} setOpenDialog={setOpenAddDialog} />
            <Box sx={{ my: 4 }}>
                {userCategories.loading
                    ? <Stack sx={{ display: 'flex', height: 200, alignItems: 'center', justifyContent: 'center', }}>
                        <CircularProgress />
                        <Typography variant="body2">
                            Loading categories
                        </Typography>
                    </Stack>
                    : <Box sx={{ p: 1 }}>
                        <Stack spacing={1}>
                            {userCategories.data.map(item =>
                                <Card key={item._id} variant="outlined">
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            {item.name}
                                        </Typography>
                                        <Typography color="text.secondary">
                                            {item.describe}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Stack direction="row" spacing={1}>
                                            <Button size="small" color="inherit" startIcon={<EditIcon />} onClick={() => handleEditCategory(item._id, item.name, item.describe)}>Edit</Button>
                                            <Button size="small" color="inherit" startIcon={<DeleteIcon />} onClick={() => handleDeleteCategory(item._id, item.name)}>Delete</Button>
                                        </Stack>
                                    </CardActions>
                                </Card>
                            )}
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