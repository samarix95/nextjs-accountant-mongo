import * as React from 'react';
import PropTypes from 'prop-types';
import { signIn, signOut, useSession } from 'next-auth/client'
import axios from 'axios';

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
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Popper from '@mui/material/Popper';
import Fade from '@mui/material/Fade';
import Paper from '@mui/material/Paper';
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Container from "@mui/material/Container";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import TextField from '@mui/material/TextField';

import InboxIcon from '@mui/icons-material/Inbox';
import AccountCircle from '@mui/icons-material/AccountCircle';
import AddBoxIcon from '@mui/icons-material/AddBox';

const drawerWidth = 240;

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

const HeaderComponent = (props) => {
    const { window, wallets } = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [session, loading] = useSession()
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [openPooper, setOpenPooper] = React.useState(false);
    const [currentWallet, setCurrentWallet] = React.useState('all');
    const [openBackdrop, setOpenBackdrop] = React.useState(false);
    const [openDialog, setOpenDialog] = React.useState(false);
    const [newWalletName, setNewWalletName] = React.useState(null);

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
        if (currentWallet !== wallet) {
            setCurrentWallet(wallet);
            setOpenPooper(false);
            changeWallet(wallet);
        }
    };

    const changeWallet = (wallet) => {
        console.log(`Change wallet: ${wallet}`);
    }

    const handleAddWallet = () => {
        setOpenPooper(false);
        setOpenDialog(true);
    }

    const handleCloseDialog = () => {
        setNewWalletName(null);
        setOpenDialog(false);
    };

    const handleChangeNewWalletName = (event) => {
        setNewWalletName(event.target.value);
    }

    const handleAddNewWallet = () => {
        axios.request({
            method: "post",
            url: "/api/wallet",
            data: { "walletName": newWalletName },
        })
            .then(response => {
                console.log(response.data.message)
                setOpenDialog(false);
            })
            .catch(error => {
                console.log(error.response.data.message)
            });
    }

    if (loading) {
        return <p>Loading...</p>
    }

    const drawer = (
        <div>
            <Toolbar />
            <Divider />
            <List>
                {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                    <ListItem button key={text}>
                        <ListItemIcon>
                            {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                        </ListItemIcon>
                        <ListItemText primary={text} />
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                {['All mail', 'Trash', 'Spam'].map((text, index) => (
                    <ListItem button key={text}>
                        <ListItemIcon>
                            {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                        </ListItemIcon>
                        <ListItemText primary={text} />
                    </ListItem>
                ))}
            </List>
        </div>
    );

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <Box sx={{ flexGrow: 1, display: 'flex' }}>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={openBackdrop}
            >
                <Box sx={{ p: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <CircularProgress color="inherit" />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Typography>Loading</Typography>
                    </Box>
                </Box>
            </Backdrop>
            <Dialog
                open={openDialog}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleCloseDialog}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>Add new wallet</DialogTitle>
                <DialogContent>
                    <TextField
                        required
                        id="wallet-name-field"
                        label="Wallet name"
                        size="small"
                        variant="standard"
                        onChange={handleChangeNewWalletName}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleAddNewWallet}>Add</Button>
                </DialogActions>
            </Dialog>
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
                                        {session.user.name &&
                                            <Typography variant="h6">{session.user.name} </Typography>
                                        }
                                        <Typography variant="body2" gutterBottom>{session.user.email} </Typography>
                                    </Box>
                                    <Divider />
                                    <List component="nav" aria-label="main wallets folders">
                                        {Object.keys(wallets.data).length > 0
                                            ? <React.Fragment>
                                                <ListItemButton
                                                    selected={currentWallet === 'all'}
                                                    onClick={() => handleChangeWallet('all')}
                                                >
                                                    <ListItemIcon>
                                                        <InboxIcon />
                                                    </ListItemIcon>
                                                    <ListItemText primary="All" />
                                                </ListItemButton>
                                                {wallets.data.map((item, key) =>
                                                    <ListItemButton key={key}
                                                        selected={currentWallet === item._id}
                                                        onClick={() => handleChangeWallet(item._id)}
                                                    >
                                                        <ListItemIcon>
                                                            <InboxIcon />
                                                        </ListItemIcon>
                                                        <ListItemText primary={item.name} />
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
                        News
                    </Typography>
                    {!session && (
                        <Button color="inherit" onClick={signIn}>Login</Button>
                    )}
                    {session && (
                        <IconButton size="large" color="inherit" onClick={handleOpenPooper}>
                            {session.user.image
                                ? <Avatar src={session.user.image} />
                                : <AccountCircle />
                            }
                        </IconButton>
                    )}
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
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
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                {props.children}
            </Box>
        </Box>
    );
}

HeaderComponent.propTypes = {
    children: PropTypes.node.isRequired,
    window: PropTypes.func,
    wallets: PropTypes.object,
};

export default HeaderComponent;