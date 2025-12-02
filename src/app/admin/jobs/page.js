"use client";
import { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
  Divider,
  Autocomplete,
  Stack,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import HeaderFooterLayout from '@/layouts/header-footer-layout/HeaderFooterLayout';
import { useRouter } from 'next/navigation';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { VscCircleFilled } from 'react-icons/vsc';
import { RiEdit2Fill } from 'react-icons/ri';
import { MdDeleteOutline } from 'react-icons/md';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import { FaEye } from 'react-icons/fa';
import AgGridInfo from '@/components/table_components/AgGridInfo';
import AgGridPagination from '@/components/table_components/AgGridPagination';
import TableSkeleton from '@/components/table_components/TableSkeleton';

ModuleRegistry.registerModules([AllCommunityModule]);

const ManageJobs = () => {
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewingJob, setViewingJob] = useState(null);
  const [editingJob, setEditingJob] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    jobRole: '',
    designation: '',
    teamName: '',
    jobType: '',
    location: '',
    experience: '',
    salary: '',
    skills: '',
    keyResponsibilities: '',
    minimumQualifications: '',
    benefits: '',
    jobDescription: '',
    status: 'active',
  });

  useEffect(() => {
    checkAuth();
    fetchJobs();
  }, []);

  // Filter jobs based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setJobs(allJobs);
      return;
    }

    const filtered = allJobs.filter((job) => {
      const query = searchQuery.toLowerCase();
      return (
        (job.jobRole && job.jobRole.toLowerCase().includes(query)) ||
        (job.designation && job.designation.toLowerCase().includes(query)) ||
        (job.location && job.location.toLowerCase().includes(query)) ||
        (job.jobType && job.jobType.toLowerCase().includes(query)) ||
        (job.experience && job.experience.toLowerCase().includes(query)) ||
        (job.teamName && job.teamName.toLowerCase().includes(query)) ||
        (job.salary && job.salary.toLowerCase().includes(query))
      );
    });
    setJobs(filtered);
  }, [searchQuery, allJobs]);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/auth/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'admin') {
      router.push('/auth/login');
      return;
    }
  };

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/jobs?status=all');
      const data = await response.json();
      
      if (data.success) {
        setAllJobs(data.data);
        setJobs(data.data);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      showSnackbar('Failed to fetch jobs', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (job = null) => {
    if (job) {
      setEditingJob(job);
      setFormData({
        jobRole: job.jobRole || '',
        designation: job.designation || '',
        teamName: job.teamName || '',
        jobType: job.jobType || '',
        location: job.location || '',
        experience: job.experience || '',
        salary: job.salary || '',
        skills: Array.isArray(job.skills) ? job.skills.join(', ') : (job.skills || ''),
        keyResponsibilities: job.keyResponsibilities || '',
        minimumQualifications: job.minimumQualifications || '',
        benefits: job.benefits || '',
        jobDescription: job.jobDescription || '',
        status: job.status || 'active',
      });
    } else {
      setEditingJob(null);
      setFormData({
        jobRole: '',
        designation: '',
        teamName: '',
        jobType: '',
        location: '',
        experience: '',
        salary: '',
        skills: '',
        keyResponsibilities: '',
        minimumQualifications: '',
        benefits: '',
        jobDescription: '',
        status: 'active',
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingJob(null);
  };

  const handleOpenViewDialog = (job) => {
    setViewingJob(job);
    setViewDialogOpen(true);
  };

  const handleCloseViewDialog = () => {
    setViewDialogOpen(false);
    setViewingJob(null);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleStatusChange = (event, newValue) => {
    setFormData({
      ...formData,
      status: newValue?.value || 'active',
    });
  };

  const handleJobTypeChange = (event, newValue) => {
    setFormData({
      ...formData,
      jobType: newValue?.value || '',
    });
  };

  const handleExperienceChange = (event, newValue) => {
    setFormData({
      ...formData,
      experience: newValue?.value || '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingJob ? `/api/jobs/${editingJob._id}` : '/api/jobs';
      const method = editingJob ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        showSnackbar(
          editingJob ? 'Job updated successfully' : 'Job created successfully',
          'success'
        );
        handleCloseDialog();
        fetchJobs();
      } else {
        showSnackbar(data.error || 'Failed to save job', 'error');
      }
    } catch (error) {
      console.error('Error saving job:', error);
      showSnackbar('Failed to save job', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job?')) {
      return;
    }

    try {
      const response = await fetch(`/api/jobs/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        showSnackbar('Job deleted successfully', 'success');
        fetchJobs();
      } else {
        showSnackbar(data.error || 'Failed to delete job', 'error');
      }
    } catch (error) {
      console.error('Error deleting job:', error);
      showSnackbar('Failed to delete job', 'error');
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const [colDefs] = useState([
    { field: "jobRole", headerName: "Job Title", minWidth: 200 },
    { field: "designation", headerName: "Role", minWidth: 200 },
    { field: "location", headerName: "Location", minWidth: 200 },
    { field: "jobType", headerName: "Job Type", minWidth: 150 },
    { field: "experience", headerName: "Experience", minWidth: 150 },
    {
      headerName: "Status",
      headerClass: "fx_c center",
      field: "status",
      minWidth: 150,
      maxWidth: 150,
      cellClass: "center status-cell",
      cellRenderer: (params) => {
        const status = params.data?.status || 'active';
        const statusMap = {
          active: { class: "green-btn", label: "Active" },
          draft: { class: "yellow-btn", label: "Draft" },
          closed: { class: "red-btn", label: "Closed" },
        };
        const statusInfo = statusMap[status] || statusMap.active;
        return (
          <span className={`${statusInfo.class} center`}>
            <VscCircleFilled style={{ position: "relative", top: 2 }} />{" "}
            {statusInfo.label}
          </span>
        );
      },
    },
    {
      headerName: "Action",
      field: "action",
      minWidth: 160,
      maxWidth:160,
      cellRenderer: (params) => {
        return (
          <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <IconButton
              size="small"
            //   className="ico-btn"
              onClick={() => handleOpenViewDialog(params.data)}
            >
              <FaEye className="col1" />
            </IconButton>
            <IconButton
              size="small"
            //   className="ico-btn"
              onClick={() => handleOpenDialog(params.data)}
            >
              <RiEdit2Fill className="col1" />
            </IconButton>
            <IconButton
              size="small"
            //   className="ico-btn"
              onClick={() => handleDelete(params.data._id)}
            >
              <MdDeleteOutline className="col1" />
            </IconButton>
          </span>
        );
      },
    },
  ]);

  const defaultColDef = {
    sortable: false,
    filter: false,
    resizable: false,
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
          <Box display="flex" justifyContent="space-between" alignItems="center" my={4}>
            <Typography variant="h4" className="fw6">
              Manage Jobs
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              className="primary-action-btn"
              disableRipple
            >
              Add New Job
            </Button>
          </Box>

          <Box className="whitebx">
            {loading ? (
              <Box style={{ width: "100%", height: "50vh" }}>
                <TableSkeleton />
              </Box>
            ) : (
              <>
                <Box style={{ width: "100%", height: "50vh" }}>
                  <Stack direction="row" justifyContent="space-between" mb={1}>
                    <Box />
                    <Box className="table-search">
                      <TextField
                        fullWidth
                        placeholder="Search jobs by title, role, location, type, experience..."
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

                  <AgGridReact
                    rowData={jobs}
                    columnDefs={colDefs}
                    defaultColDef={defaultColDef}
                    getRowStyle={getRowStyle}
                    headerHeight={40}
                    rowHeight={40}
                    domLayout="normal"
                  />
                </Box>
                {/* Pagination and info section is commented out (could add here if needed) */}
              </>
            )}
          </Box>
        </Box>
      </Container>

      {/* Add/Edit Job Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle id="alert-dialog-title">
            {editingJob ? 'Edit Job' : 'Add New Job'}
            <IconButton
              aria-label="close"
              onClick={handleCloseDialog}
              sx={{ position: "absolute", right: 8, top: 8 }}
            >
              <IoIosCloseCircleOutline className="white" />
            </IconButton>
          </DialogTitle>
          <Box>
            <Divider />
          </Box>
          <DialogContent sx={{ minHeight: "50vh" }}>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid size={{ lg: 6, md: 6, sm: 12, xs: 12 }}>
                <Box className="textfield auto-complete">
                  <TextField
                    fullWidth
                    label="Job Title *"
                    name="jobRole"
                    value={formData.jobRole}
                    onChange={handleChange}
                    required
                  />
                </Box>
              </Grid>
              <Grid size={{ lg: 6, md: 6, sm: 12, xs: 12 }}>
                <Box className="textfield auto-complete">
                  <TextField
                    fullWidth
                    label="Designation/Role"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                  />
                </Box>
              </Grid>
              <Grid size={{ lg: 6, md: 6, sm: 12, xs: 12 }}>
                <Box className="textfield auto-complete">
                  <TextField
                    fullWidth
                    label="Team Name"
                    name="teamName"
                    value={formData.teamName}
                    onChange={handleChange}
                  />
                </Box>
              </Grid>
              <Grid size={{ lg: 6, md: 6, sm: 12, xs: 12 }}>
                <Box className="textfield auto-complete">
                  <Autocomplete
                    options={[
                      { label: 'Full Time', value: 'Full Time' },
                      { label: 'Part Time', value: 'Part Time' },
                      { label: 'Contract', value: 'Contract' },
                      { label: 'Internship', value: 'Internship' },
                      { label: 'Freelance', value: 'Freelance' },
                    ]}
                    getOptionLabel={(option) => option.label || ''}
                    value={[
                      { label: 'Full Time', value: 'Full Time' },
                      { label: 'Part Time', value: 'Part Time' },
                      { label: 'Contract', value: 'Contract' },
                      { label: 'Internship', value: 'Internship' },
                      { label: 'Freelance', value: 'Freelance' },
                    ].find(opt => opt.value === formData.jobType) || null}
                    onChange={handleJobTypeChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Job Type *"
                        fullWidth
                        required
                      />
                    )}
                  />
                </Box>
              </Grid>
              <Grid size={{ lg: 6, md: 6, sm: 12, xs: 12 }}>
                <Box className="textfield auto-complete">
                  <TextField
                    fullWidth
                    label="Location *"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </Box>
              </Grid>
              <Grid size={{ lg: 6, md: 6, sm: 12, xs: 12 }}>
                <Box className="textfield auto-complete">
                  <Autocomplete
                    options={[
                      { label: '0-1 years', value: '0-1 years' },
                      { label: '1-2 years', value: '1-2 years' },
                      { label: '2-3 years', value: '2-3 years' },
                      { label: '3-5 years', value: '3-5 years' },
                      { label: '5-7 years', value: '5-7 years' },
                      { label: '7-10 years', value: '7-10 years' },
                      { label: '10+ years', value: '10+ years' },
                    ]}
                    getOptionLabel={(option) => option.label || ''}
                    value={[
                      { label: '0-1 years', value: '0-1 years' },
                      { label: '1-2 years', value: '1-2 years' },
                      { label: '2-3 years', value: '2-3 years' },
                      { label: '3-5 years', value: '3-5 years' },
                      { label: '5-7 years', value: '5-7 years' },
                      { label: '7-10 years', value: '7-10 years' },
                      { label: '10+ years', value: '10+ years' },
                    ].find(opt => opt.value === formData.experience) || null}
                    onChange={handleExperienceChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Experience Level *"
                        fullWidth
                        required
                      />
                    )}
                  />
                </Box>
              </Grid>
              <Grid size={{ lg: 6, md: 6, sm: 12, xs: 12 }}>
                <Box className="textfield auto-complete">
                  <TextField
                    fullWidth
                    label="Salary"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    placeholder="e.g., $8-12 Lakhs"
                  />
                </Box>
              </Grid>
              <Grid size={{ lg: 6, md: 6, sm: 12, xs: 12 }}>
                <Box className="textfield auto-complete">
                  <Autocomplete
                    options={[
                      { label: 'Active', value: 'active' },
                      { label: 'Draft', value: 'draft' },
                      { label: 'Closed', value: 'closed' },
                    ]}
                    getOptionLabel={(option) => option.label || ''}
                    value={[
                      { label: 'Active', value: 'active' },
                      { label: 'Draft', value: 'draft' },
                      { label: 'Closed', value: 'closed' },
                    ].find(opt => opt.value === formData.status) || null}
                    onChange={handleStatusChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Status"
                        fullWidth
                      />
                    )}
                  />
                </Box>
              </Grid>
              <Grid size={{ lg: 12, md: 12, sm: 12, xs: 12 }}>
                <Box className="textfield auto-complete">
                  <TextField
                    fullWidth
                    label="Skills (comma-separated)"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    placeholder="e.g., React, Node.js, MongoDB"
                  />
                </Box>
              </Grid>
              <Grid size={{ lg: 12, md: 12, sm: 12, xs: 12 }}>
                <Box className="textfield auto-complete">
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    label="Job Description *"
                    name="jobDescription"
                    value={formData.jobDescription}
                    onChange={handleChange}
                    required
                  />
                </Box>
              </Grid>
              <Grid size={{ lg: 12, md: 12, sm: 12, xs: 12 }}>
                <Box className="textfield auto-complete">
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    label="Key Responsibilities"
                    name="keyResponsibilities"
                    value={formData.keyResponsibilities}
                    onChange={handleChange}
                  />
                </Box>
              </Grid>
              <Grid size={{ lg: 12, md: 12, sm: 12, xs: 12 }}>
                <Box className="textfield auto-complete">
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    label="Minimum Qualifications"
                    name="minimumQualifications"
                    value={formData.minimumQualifications}
                    onChange={handleChange}
                  />
                </Box>
              </Grid>
              <Grid size={{ lg: 12, md: 12, sm: 12, xs: 12 }}>
                <Box className="textfield auto-complete">
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Benefits"
                    name="benefits"
                    value={formData.benefits}
                    onChange={handleChange}
                    placeholder="e.g., Health Insurance, Flexible Working Hours"
                  />
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions className="dialog-actions-bar" sx={{ p: 2 }}>
            <Button onClick={handleCloseDialog} className="primary-outline-btn" variant="outlined" sx={{ minWidth: "100px" }}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              className="primary-action-btn"
              sx={{ minWidth: "100px" }}
            >
              {editingJob ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* View Job Details Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={handleCloseViewDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle id="alert-dialog-title">
          Job Details
          <IconButton
            aria-label="close"
            onClick={handleCloseViewDialog}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <IoIosCloseCircleOutline className="white" />
          </IconButton>
        </DialogTitle>
        <Box>
          <Divider />
        </Box>
        <DialogContent sx={{ minHeight: "50vh" }}>
          {viewingJob && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid size={{ lg: 6, md: 6, sm: 12, xs: 12 }}>
                <Box>
                  <Typography variant="caption" className="text-secondary">
                    Job Title
                  </Typography>
                  <Typography variant="body1" className="fw5 text" sx={{ mt: 0.5 }}>
                    {viewingJob.jobRole || 'N/A'}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ lg: 6, md: 6, sm: 12, xs: 12 }}>
                <Box>
                  <Typography variant="caption" className="text-secondary">
                    Designation/Role
                  </Typography>
                  <Typography variant="body1" className="fw5 text" sx={{ mt: 0.5 }}>
                    {viewingJob.designation || 'N/A'}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ lg: 6, md: 6, sm: 12, xs: 12 }}>
                <Box>
                  <Typography variant="caption" className="text-secondary">
                    Team Name
                  </Typography>
                  <Typography variant="body1" className="fw5 text" sx={{ mt: 0.5 }}>
                    {viewingJob.teamName || 'N/A'}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ lg: 6, md: 6, sm: 12, xs: 12 }}>
                <Box>
                  <Typography variant="caption" className="text-secondary">
                    Job Type
                  </Typography>
                  <Typography variant="body1" className="fw5 text" sx={{ mt: 0.5 }}>
                    {viewingJob.jobType || 'N/A'}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ lg: 6, md: 6, sm: 12, xs: 12 }}>
                <Box>
                  <Typography variant="caption" className="text-secondary">
                    Location
                  </Typography>
                  <Typography variant="body1" className="fw5 text" sx={{ mt: 0.5 }}>
                    {viewingJob.location || 'N/A'}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ lg: 6, md: 6, sm: 12, xs: 12 }}>
                <Box>
                  <Typography variant="caption" className="text-secondary">
                    Experience Level
                  </Typography>
                  <Typography variant="body1" className="fw5 text" sx={{ mt: 0.5 }}>
                    {viewingJob.experience || 'N/A'}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ lg: 6, md: 6, sm: 12, xs: 12 }}>
                <Box>
                  <Typography variant="caption" className="text-secondary">
                    Salary
                  </Typography>
                  <Typography variant="body1" className="fw5 text" sx={{ mt: 0.5 }}>
                    {viewingJob.salary || 'N/A'}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ lg: 6, md: 6, sm: 12, xs: 12 }}>
                <Box>
                  <Typography variant="caption" className="text-secondary">
                    Status
                  </Typography>
                  <Typography variant="body1" className="fw5 text" sx={{ mt: 0.5, textTransform: 'capitalize' }}>
                    {viewingJob.status || 'active'}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ lg: 12, md: 12, sm: 12, xs: 12 }}>
                <Box>
                  <Typography variant="caption" className="text-secondary">
                    Skills
                  </Typography>
                  <Typography variant="body1" className="fw5 text" sx={{ mt: 0.5 }}>
                    {Array.isArray(viewingJob.skills) 
                      ? viewingJob.skills.join(', ') 
                      : (viewingJob.skills || 'N/A')}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ lg: 12, md: 12, sm: 12, xs: 12 }}>
                <Box>
                  <Typography variant="caption" className="text-secondary">
                    Job Description
                  </Typography>
                  <Typography variant="body1" className="text" sx={{ mt: 0.5, whiteSpace: 'pre-line' }}>
                    {viewingJob.jobDescription || 'N/A'}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ lg: 12, md: 12, sm: 12, xs: 12 }}>
                <Box>
                  <Typography variant="caption" className="text-secondary">
                    Key Responsibilities
                  </Typography>
                  <Typography variant="body1" className="text" sx={{ mt: 0.5, whiteSpace: 'pre-line' }}>
                    {viewingJob.keyResponsibilities || 'N/A'}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ lg: 12, md: 12, sm: 12, xs: 12 }}>
                <Box>
                  <Typography variant="caption" className="text-secondary">
                    Minimum Qualifications
                  </Typography>
                  <Typography variant="body1" className="text" sx={{ mt: 0.5, whiteSpace: 'pre-line' }}>
                    {viewingJob.minimumQualifications || 'N/A'}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ lg: 12, md: 12, sm: 12, xs: 12 }}>
                <Box>
                  <Typography variant="caption" className="text-secondary">
                    Benefits
                  </Typography>
                  <Typography variant="body1" className="text" sx={{ mt: 0.5, whiteSpace: 'pre-line' }}>
                    {viewingJob.benefits || 'N/A'}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions className="dialog-actions-bar" sx={{ p: 2 }}>
          <Button onClick={handleCloseViewDialog} className="primary-outline-btn" variant="outlined" sx={{ minWidth: "100px" }}>
            Close
          </Button>
          {viewingJob && (
            <Button
              onClick={() => {
                handleCloseViewDialog();
                handleOpenDialog(viewingJob);
              }}
              variant="contained"
              className="primary-action-btn"
              sx={{ minWidth: "100px" }}
            >
              Edit
            </Button>
          )}
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

export default ManageJobs;

