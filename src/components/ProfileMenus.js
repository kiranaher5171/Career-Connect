"use client";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Logout from "@mui/icons-material/Logout";
import Settings from "@mui/icons-material/Settings";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import Link from "next/link";
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  IconButton,
  Button,
} from "@mui/material";
import { LogoutConfirmationDialog } from "@/components/dialogs";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfileMenus() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  const [anchorEl, setAnchorEl] = useState(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const open = Boolean(anchorEl);

  useEffect(() => {
    // Get user data from localStorage
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setRole(parsedUser.role);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogoutClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleClose();
    setLogoutDialogOpen(true);
  };

  const handleLogoutConfirm = () => {
    setLogoutDialogOpen(false);
    // Small delay to ensure dialog closes before navigation
    setTimeout(() => {
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect to home page after logout
      window.location.href = "/home";
    }, 100);
  };

  const handleLogoutCancel = () => {
    setLogoutDialogOpen(false);
  };

  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    }
    if (user?.name) {
      return user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return "U";
  };

  const getUserDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      const firstName = user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1).toLowerCase();
      const lastName = user.lastName.charAt(0).toUpperCase() + user.lastName.slice(1).toLowerCase();
      return `${firstName} ${lastName}`;
    }
    // Fallback to name or email if firstName/lastName not available
    return user?.name || user?.email || "User";
  };

  const handleLogoutIconClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLogoutDialogOpen(true);
  };

  if (!user || !role) {
    return null;
  }
  return (
    <Box id="profile-menu"  sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Box>
        {/* <Tooltip title="Account settings"> */}
        <List 
          sx={{ display: "flex", alignItems: "center" }}
        >
          <ListItem disablePadding>
            <ListItemButton
              onClick={handleClick}
              sx={{
                display: "flex",
                alignItems: "center",
                p: 0,
                minHeight: 0,
                marginRight: 0,
              }}
              aria-controls={open ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              disableRipple
            >
           
              <ListItemText
                id="desktop-only"
                primary={
                  <Typography
                    variant="h6"
                    className=" fw5" >
                    {getUserDisplayName()}
                  </Typography>
                } 
                sx={{ mr: 1, ml:0}}
              />
                 <ListItemAvatar sx={{ minWidth: "auto" }}>
                <Avatar
                  sx={{
                    width: 30,
                    height: 30,
                    border: "2px solid #fff",
                    background: "#00b0f0",
                    color: "#fff",
                  }}
                >
                  <Typography variant="body2" className="fw5" sx={{fontSize:"13px"}}>
                    {getUserInitials()}
                  </Typography>
                </Avatar>
              </ListItemAvatar>
            </ListItemButton>
          </ListItem>
        </List>

        {/* </Tooltip> */}
      </Box> 
      
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              minWidth: 200,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Box sx={{ px: 2, py: 1.5, borderBottom: "1px solid", borderColor: "divider" }}>
          <Typography variant="h6" >
            {getUserDisplayName()}
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary", textTransform: "capitalize" }}>
            {role}
          </Typography>
        </Box>
        
        <Divider />
         
        <Box sx={{ px: 1, py: 0.5 }}>
          <Link href="/profile" style={{ textDecoration: "none", width: "100%", display: "block" }}>
            <Button
              fullWidth
              variant="text"
              startIcon={<PersonOutlineOutlinedIcon fontSize="small" />}
              className="profile-options"
              onClick={handleClose}
              sx={{ justifyContent: "flex-start", textTransform: "none" }}
            >
              Profile
            </Button>
          </Link>
        </Box>

        <Box sx={{ px: 1, py: 0.5 }}>
          <Link href="/settings" style={{ textDecoration: "none", width: "100%", display: "block" }}>
            <Button
              fullWidth
              variant="text"
              startIcon={<Settings fontSize="small" />}
              className="profile-options"
              onClick={handleClose}
              sx={{ justifyContent: "flex-start", textTransform: "none" }}
            >
              Settings
            </Button>
          </Link>
        </Box>

        <Divider />

        <Box sx={{ px: 1, py: 0.5 }}>
          <Button
            fullWidth
            variant="text"
            startIcon={<Logout fontSize="small" />}
            className="profile-options"
            onClick={handleLogoutClick}
            sx={{ justifyContent: "flex-start", textTransform: "none" }}
          >
            Logout
          </Button>
        </Box>

        
      </Menu>

      {/* Logout Confirmation Dialog */}
      <LogoutConfirmationDialog
        open={logoutDialogOpen}
        onCancel={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
      />
    </Box>
  );
}
