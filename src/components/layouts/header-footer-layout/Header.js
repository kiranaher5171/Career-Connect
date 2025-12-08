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
import ProfileMenus from '@/components/features/auth/ProfileMenus';

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

  // Helper function to normalize role (trim whitespace and convert to lowercase for comparison)
  const normalizeRole = React.useCallback((role) => {
    if (!role || typeof role !== 'string') return null;
    return role.trim().toLowerCase();
  }, []);

  // Function to check and update auth state
  const checkAuthState = React.useCallback(() => {
    if (typeof window === 'undefined') {
      setLoading(false);
      return;
    }

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
          console.warn('Invalid user data structure');
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
    setLoading(false);
  }, [normalizeRole]);

  React.useEffect(() => {
    setMounted(true);
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

    // Listen for custom login event (when user logs in from login page)
    const handleLogin = () => {
      checkAuthState();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
      window.addEventListener('userLogout', handleLogout);
      window.addEventListener('userLogin', handleLogin);
    }

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
    
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('userLogout', handleLogout);
        window.removeEventListener('userLogin', handleLogin);
      }
    };
  }, [pathname, checkAuthState]);

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
    window.location.href = "/";
  };

  const handleProfileClick = (event) => {
    setProfileAnchor(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchor(null);
  };

  // Admin menu items (Home removed - logo links to home)
  const adminMenuItems = [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Manage Jobs", href: "/admin/jobs" },
    { label: "Manage Users", href: "/admin/manage-users" },
    { label: "Applications", href: "/admin/applications" },
    { label: "Analytics", href: "/admin/analytics" },
    { label: "Referrals", href: "/admin/referrals" },
  ];

  // User menu items (Home removed - logo links to home)
  const userMenuItems = [
    { label: "Find Jobs", href: "/user/find-jobs" },
    { label: "My Applications", href: "/user/my-applications" },
    { label: "Saved Jobs", href: "/user/saved-jobs" },
    { label: "Job Alerts", href: "/user/job-alerts" },
    { label: "Resume Builder", href: "/user/resume-builder" },
    { label: "Profile", href: "/profile" },
  ];

  // Public menu items (when not logged in) - Home, About Us, and Contact Us
  const publicMenuItems = [
    // { label: "Home", href: "/" },
    // { label: "About Us", href: "/about" },
    // { label: "Contact Us", href: "/contact" },
  ];

  // Show public menu while loading or when not logged in
  // Check if user is logged in: must have token, user data, and a valid role
  const isLoggedIn = !loading && mounted && role && user && typeof role === 'string';
  
  // Determine menu items based on authentication state
  // When logged in, show role-specific menu regardless of current page
  // When not logged in (role is null/undefined), show public menu
  // Normalize role comparison to handle case-insensitive matching
  const normalizedRole = role ? normalizeRole(role) : null;
  const menuItems = isLoggedIn 
    ? (normalizedRole === "admin" ? adminMenuItems : userMenuItems)
    : publicMenuItems;
  
  // Ensure menuItems is always an array to prevent rendering errors
  const safeMenuItems = Array.isArray(menuItems) ? menuItems : [];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        id="Appbar"
        position="fixed"
        className={`Appbar_height ${pathname === '/' ? 'home-page' : ''} ${scrolled ? 'scrolled' : ''}`}
        elevation={0} // no shadow initially
      >
        <Toolbar className='fx_sb'>
          {/* Logo - Left */}
          <Box>
            <Link href="/">
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
            {safeMenuItems.map((item) => {
              // Check if current pathname matches the menu item href (exact match or starts with for nested routes)
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link key={item.href} href={item.href} passHref>
                  <Button disableRipple className={`menus ${isActive ? 'active' : ''}`}>
                    {item.label}
                  </Button>
                </Link>
              );
            })}
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
            {safeMenuItems.map((item) => {
              // Check if current pathname matches the menu item href (exact match or starts with for nested routes)
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <React.Fragment key={item.href}>
                  <Link href={item.href} passHref>
                    <ListItemButton 
                      disableRipple 
                      onClick={handleDrawerClose}
                      selected={isActive}
                      sx={{
                        '&.Mui-selected': {
                          backgroundColor: 'rgba(0, 176, 240, 0.1)',
                          borderLeft: '4px solid var(--secondary)',
                          '&:hover': {
                            backgroundColor: 'rgba(0, 176, 240, 0.15)',
                          },
                        },
                      }}
                    >
                      <ListItemText 
                        primary={item.label}
                        primaryTypographyProps={{
                          sx: {
                            color: isActive ? 'var(--secondary)' : 'inherit',
                            fontWeight: isActive ? 600 : 400,
                          }
                        }}
                      />
                    </ListItemButton>
                  </Link>
                  <Divider />
                </React.Fragment>
              );
            })}
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
