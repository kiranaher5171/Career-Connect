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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import HeaderFooterLayout from '@/components/layouts/header-footer-layout/HeaderFooterLayout';
import { useRouter } from 'next/navigation';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { TableSkeleton } from '@/components/common/table';
import { ResumePreview } from '@/components/features/resume';

ModuleRegistry.registerModules([AllCommunityModule]);

const ManageUsers = () => {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [resumeDialogOpen, setResumeDialogOpen] = useState(false);
  const [selectedUserResume, setSelectedUserResume] = useState(null);
  const [loadingResume, setLoadingResume] = useState(false);

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
      router.push('/');
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
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 120,
      cellRenderer: (params) => {
        return (
          <Button
            variant="outlined"
            size="small"
            startIcon={<VisibilityIcon />}
            onClick={() => handleViewResume(params.data)}
            sx={{ textTransform: 'none' }}
          >
            View Resume
          </Button>
        );
      },
      cellClass: "center",
      sortable: false,
      filter: false,
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

  const handleViewResume = async (user) => {
    try {
      setResumeDialogOpen(true);
      setLoadingResume(true);
      setSelectedUserResume(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        showSnackbar('Authentication required', 'error');
        setResumeDialogOpen(false);
        setLoadingResume(false);
        return;
      }

      // Get user ID - handle both string and ObjectId formats
      const userId = user._id?.toString ? user._id.toString() : user._id;

      const response = await fetch(`/api/users/${userId}/resume`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (data.success) {
        if (data.data) {
          setSelectedUserResume(data.data);
        } else {
          setSelectedUserResume(null);
          showSnackbar(`No resume found for ${user.firstName} ${user.lastName}`, 'info');
        }
      } else {
        showSnackbar(data.error || 'Failed to fetch resume', 'error');
        setResumeDialogOpen(false);
      }
    } catch (error) {
      console.error('Error fetching resume:', error);
      showSnackbar('Failed to fetch resume', 'error');
      setResumeDialogOpen(false);
    } finally {
      setLoadingResume(false);
    }
  };

  const handleCloseResumeDialog = () => {
    setResumeDialogOpen(false);
    setSelectedUserResume(null);
  };

  const handleDownloadResume = () => {
    if (selectedUserResume) {
      // The ResumePreview component will handle the actual PDF download
      // This function is passed to ResumePreview's onDownload prop
    }
  };

  return (
    <HeaderFooterLayout>
      <Container maxWidth>
        <Box className="page-content">

          <Box className="whitebx" mt={2}>
            {loading ? (
              <Box style={{ width: "100%", height: "60vh", overflow:"auto"  }}>
                <TableSkeleton />
              </Box>
            ) : (
              <>
                <Box>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2} sx={{ flexShrink: 0 }}>
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
                      height: '60vh',
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

      {/* Resume Preview Dialog */}
      <Dialog
        open={resumeDialogOpen}
        onClose={handleCloseResumeDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle id="alert-dialog-title">
          User Resume Preview
          <IconButton
            aria-label="close"
            onClick={handleCloseResumeDialog}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <IoIosCloseCircleOutline className="white" />
          </IconButton>
        </DialogTitle>
        <Box>
          <Divider />
        </Box>
        <DialogContent
          sx={{
            minHeight: "50vh",
            p: 3,
            overflowY: "auto",
            bgcolor: "#f5f5f5",
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: loadingResume ? 'center' : 'flex-start',
          }}
        >
          {loadingResume ? (
            <Box sx={{ width: '100%', maxWidth: 600 }}>
              <Box className="skeleton-shimmer" sx={{ height: 40, mb: 2, borderRadius: 1 }} />
              <Box className="skeleton-shimmer" sx={{ width: '60%', height: 30, mb: 1, borderRadius: 1 }} />
              <Box className="skeleton-shimmer" sx={{ width: '80%', height: 20, mb: 3, borderRadius: 1 }} />
              <Box className="skeleton-shimmer" sx={{ height: 200, mb: 2, borderRadius: 1 }} />
              <Box className="skeleton-shimmer" sx={{ width: '70%', height: 25, mb: 1, borderRadius: 1 }} />
              <Box className="skeleton-shimmer" sx={{ width: '90%', height: 20, mb: 1, borderRadius: 1 }} />
              <Box className="skeleton-shimmer" sx={{ width: '85%', height: 20, mb: 3, borderRadius: 1 }} />
              <Box className="skeleton-shimmer" sx={{ height: 150, mb: 2, borderRadius: 1 }} />
              <Box className="skeleton-shimmer" sx={{ width: '65%', height: 25, mb: 1, borderRadius: 1 }} />
              <Box className="skeleton-shimmer" sx={{ width: '95%', height: 20, mb: 1, borderRadius: 1 }} />
              <Box className="skeleton-shimmer" sx={{ width: '88%', height: 20, borderRadius: 1 }} />
            </Box>
          ) : selectedUserResume ? (
            <ResumePreview
              open={false}
              onClose={handleCloseResumeDialog}
              formData={selectedUserResume}
              onAISuggest={() => {}}
              onDownload={handleDownloadResume}
              aiModifiedFields={{}}
              isAILoading={false}
              hideDialog={true}
              hideAISuggest={true}
            />
          ) : (
            <Typography>No resume data available for this user.</Typography>
          )}
        </DialogContent>
        <DialogActions className="dialog-actions-bar">
          <Button variant="outlined" onClick={handleCloseResumeDialog} className="primary-outline-btn" sx={{ minWidth: "100px" }}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            className="primary-action-btn" 
            sx={{ minWidth: "100px" }}
            onClick={handleDownloadResume}
            disabled={!selectedUserResume || loadingResume}
          >
            Download Resume
          </Button>
        </DialogActions>
      </Dialog>

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

