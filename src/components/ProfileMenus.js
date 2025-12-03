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
import { LogoutConfirmationDialog, SuccessDialog } from "@/components/dialogs";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfileMenus() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  const [anchorEl, setAnchorEl] = useState(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const open = Boolean(anchorEl);

  // Helper function to normalize role (trim whitespace and convert to lowercase for comparison)
  const normalizeRole = (role) => {
    if (!role || typeof role !== 'string') return null;
    return role.trim().toLowerCase();
  };

  // Function to check and update auth state
  const checkAuthState = () => {
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        // Validate user object has required fields
        if (parsedUser && typeof parsedUser === 'object') {
          setUser(parsedUser);
          // Normalize role to ensure consistent comparison
          const normalizedRole = normalizeRole(parsedUser.role);
          setRole(normalizedRole);
        } else {
          console.warn('Invalid user data structure in ProfileMenus');
          setUser(null);
          setRole(null);
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        setUser(null);
        setRole(null);
      }
    } else {
      setUser(null);
      setRole(null);
    }
  };

  useEffect(() => {
    // Initial auth check
    checkAuthState();

    // Listen for storage changes (logout from other tabs/windows)
    const handleStorageChange = (e) => {
      if (e.key === 'token' || e.key === 'user') {
        checkAuthState();
      }
    };

    // Listen for custom logout event
    const handleLogout = () => {
      checkAuthState();
    };

    // Listen for custom login event (when user logs in from another component)
    const handleLogin = () => {
      checkAuthState();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
      window.addEventListener('userLogout', handleLogout);
      window.addEventListener('userLogin', handleLogin);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('userLogout', handleLogout);
        window.removeEventListener('userLogin', handleLogin);
      }
    };
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
    // Close logout confirmation dialog first
    setLogoutDialogOpen(false);
    
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('userLogout'));
    // Clear state immediately
    setUser(null);
    setRole(null);
    // Redirect directly to home page
    window.location.href = "/";
  };

  const handleSuccessDialogClose = () => {
    setSuccessDialogOpen(false);
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

  // Only hide if we're sure user is not logged in (not just loading)
  // Show component if user exists, even if role is being determined
  if (!user) {
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

      {/* Success Dialog */}
      <SuccessDialog
        open={successDialogOpen}
        onClose={handleSuccessDialogClose}
      />
    </Box>
  );
}
