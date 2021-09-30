import * as React from 'react';
import { useSelector } from 'react-redux';

import AddWalletDialog from '../src/wallet/AddWalletDialog';
import DeleteWalletDialog from '../src/wallet/DeleteWalletDialog';
import EditWalletDialog from '../src/wallet/EditWalletDialog';
import ProTip from '../src/ProTip';
import Copyright from '../src/Copyright';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddBoxIcon from '@mui/icons-material/AddBox';

const Wallets = () => {
    const state = useSelector((state) => state);
    const { userWallets } = state;

    const [openAddDialog, setOpenAddDialog] = React.useState(false);
    const [openDeleteDialogData, setOpenDeleteDialogData] = React.useState({ openDialog: false, walletId: '', walletName: '' });
    const [openEditDialogData, setOpenEditDialogData] = React.useState({ openDialog: false, walletId: '', walletName: '', walletDescribe: '' });

    const handleAddWallet = () => {
        setOpenAddDialog(true);
    }

    const handleEditWallet = (id, name, describe) => {
        setOpenEditDialogData({ openDialog: true, walletId: id, walletName: name, walletDescribe: describe });
    }

    const handleDeleteWallet = (id, name) => {
        setOpenDeleteDialogData({ openDialog: true, walletId: id, walletName: name });
    }

    return (
        <Container maxWidth="sm">
            <AddWalletDialog openDialog={openAddDialog} setOpenDialog={setOpenAddDialog} />
            <DeleteWalletDialog openDeleteDialogData={openDeleteDialogData} setOpenDeleteDialogData={setOpenDeleteDialogData} />
            <EditWalletDialog openEditDialogData={openEditDialogData} setOpenEditDialogData={setOpenEditDialogData} />
            <Box sx={{ my: 4 }}>
                {userWallets.loading
                    ? <Stack sx={{ display: 'flex', height: 200, alignItems: 'center', justifyContent: 'center', }}>
                        <CircularProgress />
                        <Typography variant="body2">
                            Loading wallets
                        </Typography>
                    </Stack>
                    : <Box sx={{ p: 1 }}>
                        <Stack spacing={1}>
                            {userWallets.data.map(item =>
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
                                            <Button size="small" color="inherit" startIcon={<EditIcon />} onClick={() => handleEditWallet(item._id, item.name, item.describe)}>Edit</Button>
                                            <Button size="small" color="inherit" startIcon={<DeleteIcon />} onClick={() => handleDeleteWallet(item._id, item.name)}>Delete</Button>
                                        </Stack>
                                    </CardActions>
                                </Card>
                            )}
                        </Stack>
                        <Box sx={{ p: 1, display: 'flex', justifyContent: 'center' }}>
                            <Button color="inherit" size="large" startIcon={<AddBoxIcon />} onClick={handleAddWallet}>
                                Add wallet
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

export default Wallets;