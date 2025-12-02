"use client";
import { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Snackbar,
  Alert,
  Stack,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import HeaderFooterLayout from '@/layouts/header-footer-layout/HeaderFooterLayout';
import { useRouter } from 'next/navigation';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import TableSkeleton from '@/components/table_components/TableSkeleton';

ModuleRegistry.registerModules([AllCommunityModule]);

const ManageUsers = () => {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    checkAuth();
    fetchUsers();
  }, []);

  // Filter users based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setUsers(allUsers);
      return;
    }

    const filtered = allUsers.filter((user) => {
      const query = searchQuery.toLowerCase();
      return (
        (user.firstName && user.firstName.toLowerCase().includes(query)) ||
        (user.lastName && user.lastName.toLowerCase().includes(query)) ||
        (user.email && user.email.toLowerCase().includes(query)) ||
        (user.role && user.role.toLowerCase().includes(query))
      );
    });
    setUsers(filtered);
  }, [searchQuery, allUsers]);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/auth/login');
      return false;
    }

    try {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== 'admin') {
        router.push('/auth/login');
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/auth/login');
      return false;
    }
  };

  // Listen for logout events and route changes
  useEffect(() => {
    const handleLogout = () => {
      router.push('/auth/login');
    };

    const handleRouteChange = () => {
      if (!checkAuth()) {
        return;
      }
    };

    window.addEventListener('userLogout', handleLogout);
    window.addEventListener('storage', (e) => {
      if (e.key === 'token' || e.key === 'user') {
        handleRouteChange();
      }
    });

    // Check auth on mount and when pathname changes
    handleRouteChange();

    return () => {
      window.removeEventListener('userLogout', handleLogout);
    };
  }, [router]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        router.push('/auth/login');
        return;
      }

      const response = await fetch('/api/users', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (data.success) {
        setAllUsers(data.data);
        setUsers(data.data);
      } else {
        if (response.status === 401 || response.status === 403) {
          router.push('/auth/login');
        } else {
          showSnackbar(data.error || 'Failed to fetch users', 'error');
        }
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      showSnackbar('Failed to fetch users', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    try {
      const d = new Date(date);
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      return 'N/A';
    }
  };

  const [colDefs] = useState([
    { 
      field: "firstName", 
      headerName: "First Name", 
      minWidth: 150,
      cellRenderer: (params) => {
        return params.data.firstName || 'N/A';
      }
    },
    { 
      field: "lastName", 
      headerName: "Last Name", 
      minWidth: 150,
      cellRenderer: (params) => {
        return params.data.lastName || 'N/A';
      }
    },
    { 
      field: "email", 
      headerName: "Email", 
      minWidth: 250,
    },
    { 
      field: "role", 
      headerName: "Role", 
      minWidth: 120,
      cellRenderer: (params) => {
        const role = params.data?.role || 'user';
        return role.charAt(0).toUpperCase() + role.slice(1);
      }
    },
    { 
      field: "lastLogin", 
      headerName: "Last Login", 
      minWidth: 180,
      cellRenderer: (params) => {
        return formatDate(params.data?.lastLogin);
      }
    },
    { 
      field: "savedJobsCount", 
      headerName: "Saved Jobs", 
      minWidth: 120,
      cellClass: "center",
      cellRenderer: (params) => {
        return params.data?.savedJobsCount || 0;
      }
    },
    { 
      field: "applicationsCount", 
      headerName: "Applications", 
      minWidth: 130,
      cellClass: "center",
      cellRenderer: (params) => {
        return params.data?.applicationsCount || 0;
      }
    },
    { 
      field: "referralsCount", 
      headerName: "Referrals", 
      minWidth: 120,
      cellClass: "center",
      cellRenderer: (params) => {
        return params.data?.referralsCount || 0;
      }
    },
    { 
      field: "createdAt", 
      headerName: "Joined Date", 
      minWidth: 180,
      cellRenderer: (params) => {
        return formatDate(params.data?.createdAt);
      }
    },
  ]);

  const defaultColDef = {
    sortable: true,
    filter: false,
    resizable: true,
    suppressMovable: true,
    flex: 1,
  };

  const getRowStyle = (params) => ({
    backgroundColor: params.node.rowIndex % 2 === 0 ? "#f9f9f9" : "#ffffff",
  });

  return (
    <HeaderFooterLayout>
      <Container maxWidth>
        <Box className="page-content">

          <Box className="whitebx" mt={4}>
            {loading ? (
              <Box style={{ width: "100%", height: "50vh", overflow:"auto"  }}>
                <TableSkeleton />
              </Box>
            ) : (
              <>
                <Box sx={{
                  width: '100%',
                  height: '70vh',
                  display: 'flex',
                  flexDirection: 'column',
                }}>
                  <Stack direction="row" justifyContent="space-between" mb={2} sx={{ flexShrink: 0 }}>
                    <Typography variant="h" className="fw6">
                      Manage Users
                    </Typography>
                    <Box className="table-search" sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      <TextField
                        sx={{ width: '300px' }}
                        placeholder="Search users by name, email, role..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                          startAdornment: (
                            <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                              <SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                            </Box>
                          ),
                        }}
                      />
                    </Box>
                  </Stack>
                  <div
                    className="ag-theme-alpine"
                    style={{
                      width: '100%',
                      height: '100%',
                      minHeight: 0,
                    }}
                  >
                    <AgGridReact
                      rowData={users}
                      columnDefs={colDefs}
                      defaultColDef={defaultColDef}
                      getRowStyle={getRowStyle}
                      headerHeight={48}
                      rowHeight={40}
                      domLayout="normal"
                    />
                  </div>
                </Box>
              </>
            )}
          </Box>
        </Box>
      </Container>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </HeaderFooterLayout>
  );
};

export default ManageUsers;

