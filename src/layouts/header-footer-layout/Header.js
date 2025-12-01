'use client';
import * as React from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Button,
  IconButton,
  Drawer,
  List,
  ListSubheader,
  ListItemButton,
  ListItemText,
  Divider,
  Typography,
  Popover,
  Stack,
} from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import MenuIcon from '@mui/icons-material/Menu';
import Link from 'next/link';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import ProfileMenus from '@/components/ProfileMenus';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [user, setUser] = React.useState(null);
  const [role, setRole] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [profileAnchor, setProfileAnchor] = React.useState(null);

  React.useEffect(() => {
    setMounted(true);
    // Check authentication from localStorage
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
    setLoading(false);

    const handleScroll = () => {
      if (typeof window === 'undefined') return;
      // Trigger background after scrolling 50px
      const triggerHeight = 50;
      if (window.scrollY > triggerHeight) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    // Initial check
    handleScroll();
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  const toggleDrawer = () => {
    setDrawerOpen((prev) => !prev);
  };
  const handleDrawerClose = () => setDrawerOpen(false);

  const handleLogout = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    handleDrawerClose();
    setProfileAnchor(null);
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Redirect to home page after logout
    window.location.href = "/home";
  };

  const handleProfileClick = (event) => {
    setProfileAnchor(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchor(null);
  };

  // Admin menu items (Home removed - logo links to home)
  const adminMenuItems = [
    { label: "Admin Dashboard", href: "/admin/dashboard" },
    { label: "Manage Jobs", href: "/admin/jobs" },
    { label: "Manage Users", href: "/admin/manage-users" },
    { label: "Saved Jobs", href: "/admin/saved-jobs" },
    { label: "Referrals", href: "/admin/referrals" },
    { label: "Applications", href: "/admin/applications" },
    { label: "Settings", href: "/admin/settings" },
  ];

  // User menu items (Home removed - logo links to home)
  const userMenuItems = [
    { label: "Find Jobs", href: "/users/jobs" },
    { label: "My Applications", href: "/my-applications" },
    { label: "Saved Jobs", href: "/saved-jobs" },
    { label: "Profile", href: "/profile" },
  ];

  // Public menu items (when not logged in) - Home, About Us, and Contact Us
  const publicMenuItems = [
    // { label: "Home", href: "/home" },
    // { label: "About Us", href: "/about" },
    // { label: "Contact Us", href: "/contact" },
  ];

  // Show public menu while loading or when not logged in
  const isLoggedIn = !loading && role && user;
  
  // Determine menu items based on authentication state
  // When logged in, show role-specific menu regardless of current page
  // When not logged in (role is null/undefined), show public menu
  const menuItems = isLoggedIn 
    ? (role === "admin" ? adminMenuItems : userMenuItems)
    : publicMenuItems;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        id="Appbar"
        position="fixed"
        className={`Appbar_height ${scrolled ? 'scrolled' : ''}`}
        elevation={0} // no shadow initially
      >
        <Toolbar className='fx_sb'>
          {/* Logo - Left */}
          <Box>
            <Link href="/home">
               {/* <Image
                src={logo}
                alt="logo"
                width={120}
                height={40}
                className="appbar_logo"
                priority
              />  */}
               <Typography variant='h6' className='white fw6 footer-heading'>Career Connect</Typography>
            </Link>
          </Box>

          {/* Desktop Menu - Center */}
          <Box sx={{ 
            display: { xs: 'none', md: 'flex' }, 
            gap: 1, 
            alignItems: 'center', 
            flexGrow: 1, 
            justifyContent: 'center',
            mx: 2
          }}>
            {menuItems.map((item) => (
              <Link key={item.href} href={item.href} passHref>
                <Button disableRipple className={`menus ${pathname === item.href ? 'active' : ''}`}>
                  {item.label}
                </Button>
              </Link>
            ))}
          </Box>

          {/* Profile Menu / Login Button - Right */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
            {/* Show profile menu only when logged in */}
            {isLoggedIn && (
              <>
              <ProfileMenus/> 
              </>
            )}
            {/* Show Login and Signup buttons only when NOT logged in */}
            {!isLoggedIn && (
              <>
                <Link href="/auth/login" passHref> 
                  <Button variant="outlined" disableRipple className={`signin-btn ${pathname === '/auth/signup' ? 'active' : ''}`} >
                    Sign In
                  </Button> 
                </Link>
              </>
            )}
          </Box>

          {/* Mobile Drawer Icon - Toggle Button */}
          <IconButton
            size="small"
            edge="end"
            onClick={toggleDrawer}
            className="drawer_btn mobile_menus"
            aria-label="toggle drawer"
          >
            <MenuIcon className="white" />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerClose}>
        <Box sx={{ width: 280 }} role="presentation" pt={2}>
          <List
            component="nav"
            subheader={<ListSubheader component="div">Menu</ListSubheader>}
          >
            {menuItems.map((item) => (
              <React.Fragment key={item.href}>
                <Link href={item.href} passHref>
                  <ListItemButton disableRipple onClick={handleDrawerClose}>
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                </Link>
                <Divider />
              </React.Fragment>
            ))}
            {!isLoggedIn && (
              <>
                <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Link href="/auth/signup" passHref>
                    <Button variant='outlined' disableRipple className="signin-btn" onClick={handleDrawerClose} fullWidth>
                      Sign Up
                    </Button>
                  </Link>
                  <Link href="/auth/login" passHref>
                    <Button variant='contained' disableRipple className="signin-btn" onClick={handleDrawerClose} fullWidth>
                      Sign In
                    </Button>
                  </Link>
                </Box>
                <Divider />
              </>
            )}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
}
