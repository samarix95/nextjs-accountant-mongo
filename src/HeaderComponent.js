import * as React from 'react';
import PropTypes from 'prop-types';
import { signIn, signOut, useSession } from 'next-auth/client';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';

import SnackbarComponent from './global/Snackbar';
import EditBudgetDialog from './dialogs/edit/EditBudgetDialog';
import DeleteBudgetDialog from './dialogs/delete/DeleteBudgetDialog';
import EditBudgetHistoryDialog from './dialogs/edit/EditBudgetHistoryDialog';
import DeleteBudgetHistoryDialog from './dialogs/delete/DeleteBudgetHistoryDialog';
import AddCategoryDialog from './dialogs/add/AddCategoryDialog';
import EditCategoryDialog from './dialogs/edit/EditCategoryDialog';
import DeleteCategoryDialog from './dialogs/delete/DeleteCategoryDialog';
import AddWalletDialog from './dialogs/add/AddWalletDialog';
import { getUserWallets, getUserCategories, getUserBalances, setSelectedWallet } from '../actions';
import Link from './Link';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Popper from '@mui/material/Popper';
import Fade from '@mui/material/Fade';
import Paper from '@mui/material/Paper';
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Container from "@mui/material/Container";
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';

import InboxIcon from '@mui/icons-material/Inbox';
import AccountCircle from '@mui/icons-material/AccountCircle';
import AddBoxIcon from '@mui/icons-material/AddBox';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import HomeIcon from '@mui/icons-material/Home';
import MenuIcon from '@mui/icons-material/Menu';
import InfoIcon from '@mui/icons-material/Info';
import DehazeIcon from '@mui/icons-material/Dehaze';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import SettingsIcon from '@mui/icons-material/Settings';

const drawerWidth = 240;

const pages = {
    "/": "Home",
    "/balance": "My balance",
    "/wallets": "My wallets",
    "/categories": "My categories",
    "/settings": "Settings",
    "/about": "About",
}

const HeaderComponent = (props) => {
    const { window } = props;
    const [session, loading] = useSession();
    const state = useSelector((state) => state);
    const {
        userWallets,
        editBudgetDialog,
        deleteBudgetDialog,
        editBudgetHistoryDialog,
        deleteBudgetHistoryDialog,
        addCategoryDialog,
        editCategoryDialog,
        deleteCategoryDialog
    } = state;
    const router = useRouter();
    const dispatch = useDispatch();

    const [openDialog, setOpenDialog] = React.useState(false);
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [openPooper, setOpenPooper] = React.useState(false);
    const [selectedDrawerIndex, setSelectedDrawerIndex] = React.useState(router.pathname);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleOpenPooper = (event) => {
        setAnchorEl(event.currentTarget);
        setOpenPooper(!openPooper);
    }

    const handleClosePooper = () => {
        setOpenPooper(false);
    }

    const handleChangeWallet = (wallet) => {
        if (userWallets.selectedId !== wallet) {
            localStorage.setItem("selectedWalletId", wallet);
            dispatch(setSelectedWallet(wallet));
            setOpenPooper(false);
        }
    };

    const handleAddWallet = () => {
        setOpenPooper(false);
        setOpenDialog(true);
    }

    const handleListItemClick = (index) => {
        setSelectedDrawerIndex(index);
    };

    React.useEffect(() => {
        const selectedWalletId = localStorage.getItem("selectedWalletId");
        dispatch(setSelectedWallet(selectedWalletId));
        dispatch(getUserWallets());
        dispatch(getUserCategories());
        dispatch(getUserBalances());
    }, [])

    if (loading) {
        return <p>Loading...</p>
    }

    const drawer = (
        <Stack sx={{ flexGrow: 1, display: 'flex' }}>
            <Toolbar />
            <Divider />
            <List sx={{ flexGrow: 1 }}>
                <ListItem
                    button
                    component={Link}
                    noLinkStyle
                    href="/"
                    selected={selectedDrawerIndex === "/"}
                    onClick={() => handleListItemClick("/")}
                >
                    <ListItemIcon>
                        <HomeIcon />
                    </ListItemIcon>
                    <ListItemText primary={pages["/"]} />
                </ListItem>
                <ListItem
                    button
                    component={Link}
                    noLinkStyle
                    href="/balance"
                    selected={selectedDrawerIndex === "/balance"}
                    onClick={() => handleListItemClick("/balance")}
                >
                    <ListItemIcon>
                        <LocalAtmIcon />
                    </ListItemIcon>
                    <ListItemText primary={pages["/balance"]} />
                </ListItem>
                <ListItem
                    button
                    component={Link}
                    noLinkStyle
                    href="/wallets"
                    selected={selectedDrawerIndex === "/wallets"}
                    onClick={() => handleListItemClick("/wallets")}
                >
                    <ListItemIcon>
                        <AccountBalanceWalletIcon />
                    </ListItemIcon>
                    <ListItemText primary={pages["/wallets"]} />
                </ListItem>
                <ListItem
                    button
                    component={Link}
                    noLinkStyle
                    href="/categories"
                    selected={selectedDrawerIndex === "/categories"}
                    onClick={() => handleListItemClick("/categories")}
                >
                    <ListItemIcon>
                        <DehazeIcon />
                    </ListItemIcon>
                    <ListItemText primary={pages["/categories"]} />
                </ListItem>
            </List>
            <Divider />
            <List >
                <ListItem
                    button
                    component={Link}
                    noLinkStyle
                    href="/settings"
                    selected={selectedDrawerIndex === "/settings"}
                    onClick={() => handleListItemClick("/settings")}
                >
                    <ListItemIcon>
                        <SettingsIcon />
                    </ListItemIcon>
                    <ListItemText primary={pages["/settings"]} />
                </ListItem>
                <ListItem
                    button
                    component={Link}
                    noLinkStyle
                    href="/about"
                    selected={selectedDrawerIndex === "/about"}
                    onClick={() => handleListItemClick("/about")}
                >
                    <ListItemIcon>
                        <InfoIcon />
                    </ListItemIcon>
                    <ListItemText primary={pages["/about"]} />
                </ListItem>
            </List>
        </Stack>
    );

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <React.Fragment>
            <SnackbarComponent />
            <AddWalletDialog openDialog={openDialog} setOpenDialog={setOpenDialog} />
            {editBudgetDialog.openDialog && <EditBudgetDialog />}
            {deleteBudgetDialog.openDialog && <DeleteBudgetDialog />}
            {editBudgetHistoryDialog.openDialog && <EditBudgetHistoryDialog />}
            {deleteBudgetHistoryDialog.openDialog && <DeleteBudgetHistoryDialog />}
            {addCategoryDialog.openDialog && <AddCategoryDialog />}
            {editCategoryDialog.openDialog && <EditCategoryDialog />}
            {deleteCategoryDialog.openDialog && <DeleteCategoryDialog />}
            <Popper transition
                open={openPooper}
                anchorEl={anchorEl}
                placement="bottom-end"
                disablePortal
                style={{ zIndex: 9999 }}
            >
                {({ TransitionProps }) => (
                    <ClickAwayListener onClickAway={handleClosePooper}>
                        <Fade {...TransitionProps} timeout={350}>
                            <Paper>
                                <Container>
                                    <Box sx={{ p: 1 }}>
                                        {session.user.name && <Typography variant="h6">{session.user.name} </Typography>}
                                        <Typography variant="body2" gutterBottom>{session.user.email} </Typography>
                                    </Box>
                                    <Divider />
                                    <List component="nav" aria-label="main wallets folders">
                                        {Object.keys(userWallets.data).length > 0
                                            ? <React.Fragment>
                                                {Object.keys(userWallets.data).length > 1 && (
                                                    <ListItemButton selected={userWallets.selectedId === 'summary'} onClick={() => handleChangeWallet('summary')}>
                                                        <ListItemIcon>
                                                            <InboxIcon />
                                                        </ListItemIcon>
                                                        <ListItemText primary="Summary" />
                                                    </ListItemButton>
                                                )}
                                                {userWallets.data.map((item, key) =>
                                                    <ListItemButton key={key} selected={userWallets.selectedId === item._id} onClick={() => handleChangeWallet(item._id)}>
                                                        <ListItemIcon>
                                                            <InboxIcon />
                                                        </ListItemIcon>
                                                        <Stack>
                                                            <ListItemText primary={item.name} />
                                                            {item.description && (<ListItemText secondary={item.description} />)}
                                                        </Stack>
                                                    </ListItemButton>
                                                )}
                                            </React.Fragment>
                                            : <ListItemButton disabled>
                                                <ListItemIcon>
                                                    <InboxIcon />
                                                </ListItemIcon>
                                                <ListItemText primary="No wallets" />
                                            </ListItemButton>
                                        }
                                    </List>
                                    <Box sx={{ p: 1, display: 'flex', justifyContent: 'center' }}>
                                        <Button color="inherit" size="small" startIcon={<AddBoxIcon />} onClick={handleAddWallet}>
                                            Add wallet
                                        </Button>
                                    </Box>
                                    <Divider />
                                    <Box sx={{ p: 1, display: 'flex', justifyContent: 'flex-end' }}>
                                        <Button color="inherit" size="small" onClick={signOut}>Sign out</Button>
                                    </Box>
                                </Container>
                            </Paper>
                        </Fade>
                    </ClickAwayListener>
                )}
            </Popper>
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        {pages[router.pathname]}
                    </Typography>
                    {!session && (
                        <Button color="inherit" onClick={signIn}>Login</Button>
                    )}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', }}>
                        {session && (
                            <React.Fragment>
                                <IconButton size="small" color="inherit" onClick={handleOpenPooper}>
                                    {session.user.image
                                        ? <Avatar src={session.user.image} />
                                        : <AccountCircle />
                                    }
                                </IconButton>
                                {userWallets.loading && (
                                    <CircularProgress sx={{ position: 'absolute' }} />
                                )}
                            </React.Fragment>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>
            <Box component="nav" aria-label="folders" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}  >
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
        </React.Fragment>
    );
}

HeaderComponent.propTypes = {
    window: PropTypes.func,
    wallets: PropTypes.object,
};

export default HeaderComponent;