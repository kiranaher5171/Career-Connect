"use client";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import LogoutIcon from "@mui/icons-material/Logout";
import { getMenuItems } from "./menuItems";
import {
  Box,
  Drawer,
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function MobileDrawer() {
  const [state, setState] = useState({ right: false });
  const [userType, setUserType] = useState("");
  const router = useRouter();

  const toggleDrawer = (anchor, open) => () => {
    setState({ ...state, [anchor]: open });
  };

  const isDrawerOpen = state["right"];

  const handleCloseDrawer = () => {
    setState({ ...state, right: false });
  };

  const handleLogout = () => {
    localStorage.clear();
    handleCloseDrawer(); // Close the drawer
    router.push("/auth/login");
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserType(localStorage.getItem("user_type"));
    }
  }, []);

  const pathname = usePathname();

  // menuItems imported from shared/menuItems.js
  const menuItems = getMenuItems().map((item) => ({
    ...item,
    icon: <item.icon fontSize="small" />,
  }));

  const isActive = (href) => {
    return pathname.startsWith(href);
  };

  return (
    <>
      <Box>
        <Tooltip
          title={isDrawerOpen ? "Collapse" : "Expand"}
          arrow
          placement="bottom"
        >
          <IconButton
            onClick={toggleDrawer("right", !isDrawerOpen)}
            size="medium"
            className="mobile-menu-icon"
          >
            {isDrawerOpen ? (
              <MenuOpenIcon fontSize="medium" />
            ) : (
              <MenuIcon fontSize="medium" />
            )}
          </IconButton>
        </Tooltip>
      </Box>

      <Drawer
        id="mobile-drawer"
        anchor="right"
        open={isDrawerOpen}
        onClose={toggleDrawer("right", false)}
      >
        <Box className="sidebar-bg" mt={4}>
          <Box>
            <Box id="menus">
              <List sx={{ height: "calc(100vh - 77px)", overflow: "auto" }}>
                {menuItems.map((item) => (
                  <Link href={item.href} passHref key={item.href}>
                    <ListItem disablePadding>
                      <ListItemButton
                        disableRipple
                        selected={isActive(item.href)}
                        onClick={handleCloseDrawer}
                      >
                        <Tooltip title={item.title} arrow placement="right">
                          <ListItemIcon>{item.icon}</ListItemIcon>
                        </Tooltip>
                        <ListItemText primary={item.title} />
                      </ListItemButton>
                    </ListItem>
                  </Link>
                ))}

                <ListItem disablePadding className="log-out-button">
                  <ListItemButton onClick={handleLogout}>
                    <Tooltip title={"Logout"} arrow placement="right">
                      <ListItemIcon>
                        <LogoutIcon className="white" />
                      </ListItemIcon>
                    </Tooltip>
                    <ListItemText primary={"Logout"} />
                  </ListItemButton>
                </ListItem>
              </List>
            </Box>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
