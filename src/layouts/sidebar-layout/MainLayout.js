"use client";

import {
    AppBar,
    Avatar,
    Box,
    Button,
    CssBaseline,
    Drawer as MuiDrawer,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Menu,
    Stack,
    Toolbar,
    Tooltip,
    Typography,
    Container,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

import logo from '../../../public/assets/logo.svg';
import smlogo from "../../../public/assets/sm-logo.png";
import MobileDrawer from "./MobileDrawer";
import { getMenuItems } from "./menuItems";
 

const drawerWidth = 260;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
});

const closedMixin = (theme) => ({
    width: `calc(${theme.spacing(10)} + 1px)`,
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
});

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== "open" })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: "nowrap",
        boxSizing: "border-box",
        ...(open && {
            ...openedMixin(theme),
            "& .MuiDrawer-paper": openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            "& .MuiDrawer-paper": closedMixin(theme),
        }),
    })
);

export default function MainLayout({ children }) {
    const [open, setOpen] = useState(true);
    const [userName, setUserName] = useState("");
    const pathname = usePathname();
    const router = useRouter();

    const toggleSidebar = () => {
        const newState = !open;
        setOpen(newState);
        localStorage.setItem("sidebar", JSON.stringify(newState));
    };

    const handleLogout = () => {
        localStorage.clear();
        handleCloseP(); // Close the profile menu
        router.push("/");
    };

    const initials = userName
        ?.split(" ")
        .map((word) => word.charAt(0))
        .join("")
        .toUpperCase();

    // Get menu items from shared menuItems.js
    const menuItems = getMenuItems().map(item => ({
        ...item,
        icon: <item.icon fontSize="small" />
    }));

    const isActive = (href) => pathname.startsWith(href);

    const [anchorElP, setAnchorElP] = useState(null);
    const openP = Boolean(anchorElP);
    const handleClickP = (event) => setAnchorElP(event.currentTarget);
    const handleCloseP = () => setAnchorElP(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            setOpen(JSON.parse(localStorage.getItem("sidebar")) ?? true);
            setUserName(localStorage.getItem("user_name") || "");
        }
    }, []);

    return (
        <>
            <Box sx={{ display: "flex" }}>
                <CssBaseline />

                <Drawer variant="permanent" open={open} className="drawer" id="desktop-only">
                    <Box className="sidebar-bg">
                        <Box className="w100 fx_c">
                            <Image src={open ? logo : smlogo} alt="Logo" className={open ? "lglogo" : "smlogo"} />
                        </Box>

                        <Box id="menus">
                            <List sx={{height:"calc(100vh - 77px)",overflow:"auto"}}>
                                {menuItems.map((item) => (
                                    <Link href={item.href} passHref key={item.href}>
                                        <ListItem disablePadding>
                                            <ListItemButton selected={isActive(item.href)}>
                                                <Tooltip title={item.title} arrow placement="right">
                                                    <ListItemIcon>{item.icon}</ListItemIcon>
                                                </Tooltip>
                                                <ListItemText primary={item.title} sx={{ opacity: open ? 1 : 0 }} />
                                            </ListItemButton>
                                        </ListItem>
                                    </Link>
                                ))}
                                {/* <ListItem disablePadding className="log-out-button">
                                    <ListItemButton onClick={handleLogout}>
                                        <Tooltip title="Logout" arrow placement="right">
                                            <ListItemIcon>
                                                <LogoutIcon className="white" />
                                            </ListItemIcon>
                                        </Tooltip>
                                        <ListItemText primary="Logout" sx={{ opacity: open ? 1 : 0 }} />
                                    </ListItemButton>
                                </ListItem> */}
                            </List>
                        </Box>
                    </Box>
                </Drawer>

                <Box component="main" sx={{ flexGrow: 1 }}>
                    <AppBar position="sticky" id="header">
                        <Toolbar className="fx_sb">
                            <Stack direction="row" alignItems="center" spacing={1} id="desktop-only">
                                <IconButton onClick={toggleSidebar} size="small">
                                    {open ? (
                                        <MenuOpenIcon fontSize="medium" className="primary" />
                                    ) : (
                                        <MenuIcon fontSize="medium" className="primary" />
                                    )}
                                </IconButton>
                            </Stack>

                            <Box id="mobile-only">
                                <Image src={logo} alt="Logo" className="mobile-logo" />
                            </Box>

                            <Stack direction="row" alignItems="center" spacing={2}>
                                <Box id="profile">
                                    <List>
                                        <ListItem disablePadding secondaryAction={<ArrowDropDownIcon />}>
                                            <ListItemButton onClick={handleClickP}>
                                                <ListItemAvatar>
                                                    <Avatar>{initials}</Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                id="desktop-only"
                                                    primary={
                                                        <Typography variant="h6">
                                                            <span>Welcome,</span> Joy
                                                        </Typography>
                                                    }
                                                />
                                            </ListItemButton>
                                        </ListItem>
                                    </List>
                                </Box>

                                <Box id="mobile-only" className="mr0">
                                    <MobileDrawer />
                                </Box>
                            </Stack>
                        </Toolbar>
                    </AppBar>

                    <Box className="child-content">{children}</Box>
                    <Box className="small footer">
                <Container maxWidth>
                    <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
                        <Typography variant='h6' className='copyright'>
                            Copyright © 2025 CareerConnect. All Rights Reserved.
                        </Typography>
                    </Stack>
                </Container>
            </Box>
                </Box>
            </Box>

            <Menu
                anchorEl={anchorElP}
                id="profile-menu"
                open={openP}
                onClose={handleCloseP}
                onClick={handleCloseP}
                slotProps={{
                    paper: {
                        elevation: 0,
                        sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.25))',
                            mt: 1.5,
                            // minWidth: 180,
                            '&::before': {
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                top: 0,
                                right: 12,
                                width: 10,
                                height: 10,
                                bgcolor: 'background.paper',
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0,
                            },
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
            >
                <Stack direction="column" alignItems="center" justifyContent="center" spacing={1}>
                    <Button
                        variant="text"
                        className="profile-options"
                        startIcon={<PersonOutlineOutlinedIcon fontSize="small" />}
                        disableRipple
                        onClick={handleCloseP}
                    >
                        Profile
                    </Button>
                    <Button
                        variant="text"
                        className="profile-options"
                        startIcon={<SettingsOutlinedIcon fontSize="small"/>}
                        disableRipple
                        onClick={handleCloseP}
                    >
                        Settings
                    </Button>
                    <Button
                        variant="text"
                        className="profile-options"
                        startIcon={<LogoutIcon fontSize="small"/>}
                        disableRipple
                        onClick={handleLogout}
                    >
                        Logout
                    </Button>
                </Stack>
            </Menu>
        </>
    );
}
