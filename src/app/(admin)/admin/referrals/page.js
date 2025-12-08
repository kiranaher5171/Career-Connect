"use client";
import { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Snackbar,
  Alert,
  Stack,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
  Divider,
  Autocomplete,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EmailIcon from "@mui/icons-material/Email";
import { IoIosCloseCircleOutline } from "react-icons/io";
import PersonIcon from "@mui/icons-material/Person";
import WorkIcon from "@mui/icons-material/Work";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PhoneIcon from "@mui/icons-material/Phone";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import DownloadIcon from "@mui/icons-material/Download";
import HeaderFooterLayout from "@/components/layouts/header-footer-layout/HeaderFooterLayout";
import { useRouter } from "next/navigation";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { TableSkeleton } from "@/components/common/table";

ModuleRegistry.registerModules([AllCommunityModule]);

const ManageReferrals = () => {
  const router = useRouter();
  const [referrals, setReferrals] = useState([]);
  const [allReferrals, setAllReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedReferral, setSelectedReferral] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [downloadingResume, setDownloadingResume] = useState(false);

  useEffect(() => {
    checkAuth();
    fetchReferrals();
  }, []);

  // Filter referrals based on search query and status
  useEffect(() => {
    let filtered = allReferrals;

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((ref) => ref.status === statusFilter);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((ref) => {
        return (
          (ref.friendName && ref.friendName.toLowerCase().includes(query)) ||
          (ref.friendEmail && ref.friendEmail.toLowerCase().includes(query)) ||
          (ref.phoneNumber && ref.phoneNumber.toLowerCase().includes(query)) ||
          (ref.jobRole && ref.jobRole.toLowerCase().includes(query)) ||
          (ref.referrerName &&
            ref.referrerName.toLowerCase().includes(query)) ||
          (ref.referrerEmail &&
            ref.referrerEmail.toLowerCase().includes(query)) ||
          (ref.job?.title && ref.job.title.toLowerCase().includes(query)) ||
          (ref.job?.company && ref.job.company.toLowerCase().includes(query)) ||
          (ref.resumeFileName &&
            ref.resumeFileName.toLowerCase().includes(query)) ||
          (ref.message && ref.message.toLowerCase().includes(query))
        );
      });
    }

    setReferrals(filtered);
  }, [searchQuery, allReferrals, statusFilter]);

  const checkAuth = () => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      router.push("/auth/login");
      return false;
    }

    try {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== "admin") {
        router.push("/auth/login");
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error parsing user data:", error);
      router.push("/auth/login");
      return false;
    }
  };

  useEffect(() => {
    const handleLogout = () => {
      router.push("/");
    };

    const handleRouteChange = () => {
      if (!checkAuth()) {
        return;
      }
    };

    window.addEventListener("userLogout", handleLogout);
    window.addEventListener("storage", (e) => {
      if (e.key === "token" || e.key === "user") {
        handleRouteChange();
      }
    });

    handleRouteChange();

    return () => {
      window.removeEventListener("userLogout", handleLogout);
    };
  }, [router]);

  const fetchReferrals = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/auth/login");
        return;
      }

      const response = await fetch("/api/referrals", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setAllReferrals(data.data || []);
        setReferrals(data.data || []);
      } else {
        if (response.status === 401 || response.status === 403) {
          router.push("/auth/login");
        } else {
          showSnackbar(data.error || "Failed to fetch referrals", "error");
        }
      }
    } catch (error) {
      console.error("Error fetching referrals:", error);
      showSnackbar("Failed to fetch referrals", "error");
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
    if (!date) return "N/A";
    try {
      const d = new Date(date);
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "N/A";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "warning";
      case "contacted":
        return "info";
      case "hired":
        return "success";
      case "rejected":
        return "error";
      default:
        return "default";
    }
  };

  const handleViewDetails = (referral) => {
    setSelectedReferral(referral);
    setDetailDialogOpen(true);
  };

  const handleCloseDetailDialog = () => {
    setDetailDialogOpen(false);
    setSelectedReferral(null);
  };

  const [colDefs] = useState([
    {
      field: "friendName",
      headerName: "Referred Friend",
      minWidth: 180,
      cellRenderer: (params) => {
        return params.data.friendName || "N/A";
      },
    },
    {
      field: "friendEmail",
      headerName: "Friend Email",
      minWidth: 220,
    },
    {
      field: "phoneNumber",
      headerName: "Phone Number",
      minWidth: 150,
      cellRenderer: (params) => {
        return params.data.phoneNumber || "N/A";
      },
    },
    {
      field: "jobRole",
      headerName: "Job Role",
      minWidth: 200,
      cellRenderer: (params) => {
        return params.data.jobRole || params.data.job?.title || "N/A";
      },
    },
    {
      field: "referrerName",
      headerName: "Referred By",
      minWidth: 180,
      cellRenderer: (params) => {
        return (
          params.data.referrerName ||
          params.data.referrer?.firstName +
            " " +
            params.data.referrer?.lastName ||
          "N/A"
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 120,
      cellRenderer: (params) => {
        const status = params.data?.status || "pending";
        return (
          <Chip
            label={status.charAt(0).toUpperCase() + status.slice(1)}
            color={getStatusColor(status)}
            size="small"
          />
        );
      },
    },
    {
      field: "createdAt",
      headerName: "Referred Date",
      minWidth: 180,
      cellRenderer: (params) => {
        return formatDate(params.data?.createdAt);
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 120,
      cellRenderer: (params) => {
        return (
          <Button
            variant="text"
            disableRipple
            size="small"
            onClick={() => handleViewDetails(params.data)}
            sx={{ textTransform: "none" }}
            className="link-text-btn"
          >
            View Details
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

  return (
    <HeaderFooterLayout>
      <Container maxWidth>
        <Box className="page-content">
          <Box className="whitebx" mt={2}>
            {loading ? (
              <Box style={{ width: "100%", height: "60vh", overflow: "auto" }}>
                <TableSkeleton />
              </Box>
            ) : (
              <>
                <Box>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    mb={2}
                    sx={{ flexShrink: 0 }}
                  >
                    <Typography variant="h" className="fw6">
                      Manage Referrals
                    </Typography>
                    <Box
                      className="table-search"
                      sx={{ display: "flex", gap: 2, alignItems: "center" }}
                    >
                      <TextField
                        sx={{ width: "300px" }}
                        placeholder="Search referrals..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                          startAdornment: (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                mr: 1,
                              }}
                            >
                              <SearchIcon
                                sx={{ color: "text.secondary", fontSize: 20 }}
                              />
                            </Box>
                          ),
                        }}
                      />
                    </Box>
                  </Stack>
                  <div
                    className="ag-theme-alpine"
                    style={{
                      width: "100%",
                      height: "60vh",
                      minHeight: 0,
                    }}
                  >
                    <AgGridReact
                      rowData={referrals}
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

      {/* Referral Details Dialog */}
      <Dialog
        open={detailDialogOpen}
        onClose={handleCloseDetailDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2, maxHeight: "90vh" },
        }}
      >
        <DialogTitle id="alert-dialog-title">
          Referral Details
          <IconButton
            aria-label="close"
            onClick={handleCloseDetailDialog}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <IoIosCloseCircleOutline className="white" />
          </IconButton>
        </DialogTitle>
        <Box>
          <Divider />
        </Box>
        <DialogContent sx={{ minHeight: "50vh" }}>
          {selectedReferral ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 3 }}>
              {/* Job Information */}
              <Box className="textfield auto-complete">
                <Typography variant="h6" className="h5 black">
                  Job Information
                </Typography>
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2, mt: 2 }}>
                  <Typography variant="body2" className="fw4 text" sx={{ mt: 0.5 }}>
                    <strong>Job Role:</strong> {selectedReferral.jobRole || selectedReferral.job?.title || "N/A"}
                  </Typography>
                  {selectedReferral.job?.title &&
                    selectedReferral.job.title !== selectedReferral.jobRole && (
                      <Typography variant="body2" className="fw4 text" sx={{ mt: 0.5 }}>
                        <strong>Title:</strong> {selectedReferral.job.title}
                      </Typography>
                    )}
                  {selectedReferral.job?.company && (
                    <Typography variant="body2" className="fw4 text" sx={{ mt: 0.5 }}>
                      <strong>Company:</strong> {selectedReferral.job.company}
                    </Typography>
                  )}
                  {selectedReferral.job?.location && (
                    <Typography variant="body2" className="fw4 text" sx={{ mt: 0.5 }}>
                      <strong>Location:</strong> {selectedReferral.job.location}
                    </Typography>
                  )}
                  {selectedReferral.job?._id && (
                    <Typography variant="body2" className="fw4 text" sx={{ mt: 0.5 }}>
                      <strong>Job ID:</strong> {selectedReferral.job._id.toString()}
                    </Typography>
                  )}
                </Box>
              </Box>

              {/* Referred Friend Information */}
              <Box className="textfield auto-complete">
                <Typography variant="h6" className="h5 black" sx={{ mb: 1 }}>
                  Referred Friend
                </Typography>
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2, mt: 2 }}>
                  <Typography variant="body2" className="fw4 text" sx={{ mt: 0.5 }}>
                    <strong>Name:</strong> {selectedReferral.friendName || "N/A"}
                  </Typography>
                  <Typography variant="body2" className="fw4 text" sx={{ mt: 0.5 }}>
                    <strong>Email:</strong> {selectedReferral.friendEmail || "N/A"}
                  </Typography>
                  {selectedReferral.phoneNumber && (
                    <Typography variant="body2" className="fw4 text" sx={{ mt: 0.5 }}>
                      <strong>Phone:</strong> {selectedReferral.phoneNumber}
                    </Typography>
                  )}
                </Box>
              </Box>

              {/* Referrer Information */}
              <Box className="textfield auto-complete">
                <Typography variant="h6" className="h5 black" sx={{ mb: 1 }}>
                  Referred By
                </Typography>
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2, mt: 2 }}>
                  <Typography variant="body2" className="fw4 text" sx={{ mt: 0.5 }}>
                    <strong>Name:</strong>{" "}
                    {selectedReferral.referrerName ||
                      ((selectedReferral.referrer?.firstName || "") +
                        (selectedReferral.referrer?.lastName ? " " + selectedReferral.referrer?.lastName : "")) ||
                      "N/A"}
                  </Typography>
                  <Typography variant="body2" className="fw4 text" sx={{ mt: 0.5 }}>
                    <strong>Email:</strong> {selectedReferral.referrerEmail || selectedReferral.referrer?.email || "N/A"}
                  </Typography>
                </Box>
              </Box>

              {/* Resume Information */}
              {(selectedReferral.resumeFile || selectedReferral.resumeFileName) && (
                <Box className="textfield auto-complete">
                  <Typography variant="h6" className="h5 black" sx={{ mb: 1 }}>
                    Resume Information
                  </Typography>
                  <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2, mt: 2 }}>
                    {selectedReferral.resumeFileName && (
                      <Typography variant="body2" className="fw4 text" sx={{ mt: 0.5 }}>
                        <strong>File Name:</strong> {selectedReferral.resumeFileName}
                      </Typography>
                    )}
                    {selectedReferral.resumeFile && (
                      <Typography variant="body2" className="fw4 text" sx={{ mt: 0.5 }}>
                        <strong>Resume File:</strong> {selectedReferral.resumeFile}
                      </Typography>
                    )}
                  </Box>
                </Box>
              )}

              {/* Message */}
              {selectedReferral.message && (
                <Box className="textfield auto-complete">
                  <Typography variant="h6" className="h5 black" sx={{ mb: 1 }}>
                    Message
                  </Typography>
                  <Typography variant="body2" className="fw4 text" sx={{ mt: 0.5, whiteSpace: "pre-line" }}>
                    {selectedReferral.message}
                  </Typography>
                </Box>
              )}

              {/* Status and Dates */}
              <Box className="textfield auto-complete">
                <Typography variant="h6" className="h5 black" sx={{ mb: 1 }}>
                  Status & Dates
                </Typography>
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2, mt: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="body2" className="fw4 text" sx={{ mt: 0.5 }}>
                      <strong>Status:</strong>
                    </Typography>
                    <Chip
                      label={
                        selectedReferral.status?.charAt(0).toUpperCase() +
                          selectedReferral.status?.slice(1) || "Pending"
                      }
                      color={getStatusColor(selectedReferral.status)}
                      size="small"
                    />
                  </Box>
                  <Typography variant="body2" className="fw4 text" sx={{ mt: 0.5 }}>
                    <strong>Referred Date:</strong> {formatDate(selectedReferral.createdAt)}
                  </Typography>
                  {selectedReferral.updatedAt && (
                    <Typography variant="body2" className="fw4 text" sx={{ mt: 0.5 }}>
                      <strong>Last Updated:</strong> {formatDate(selectedReferral.updatedAt)}
                    </Typography>
                  )}
                  {selectedReferral._id && (
                    <Typography variant="body2" className="fw4 text" sx={{ mt: 0.5 }}>
                      <strong>Referral ID:</strong> {selectedReferral._id.toString()}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "200px",
              }}
            >
              <Typography variant="body2" className="fw4 text" sx={{ mt: 0.5 }}>
                No referral data available
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions className="dialog-actions-bar">
          <Button
            onClick={handleCloseDetailDialog}
            variant="outlined"
            className="primary-outline-btn"
            sx={{ minWidth: "100px" }}
          >
            Close
          </Button>
          {(selectedReferral?.resumeFile || selectedReferral?.resumeFileName) && (
            <Button
              variant="contained"
              className="primary-action-btn"
              sx={{ minWidth: "100px" }}
              disabled={downloadingResume}
              onClick={async () => {
                try {
                  setDownloadingResume(true);
                  const token = localStorage.getItem("token");
                  if (!token) {
                    showSnackbar(
                      "Please login to download resume",
                      "error"
                    );
                    return;
                  }
                  const referralId =
                    selectedReferral._id?.toString() ||
                    selectedReferral._id;
                  if (!referralId) {
                    showSnackbar("Referral ID not found", "error");
                    return;
                  }
                  
                  // Download the resume file
                  const response = await fetch(
                    `/api/referrals/${referralId}/resume`,
                    {
                      method: "GET",
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  );
                  
                  // Check content type first to determine if it's an error
                  const contentType = response.headers.get("content-type") || "";
                  
                  // If response is JSON, it's an error - handle it before trying to get blob
                  if (contentType.includes("application/json") || !response.ok) {
                    let errorMessage = "Failed to download resume";
                    try {
                      const errorData = await response.json();
                      errorMessage = errorData.error || errorData.message || errorMessage;
                      // Add more context if available
                      if (errorData.details) {
                        console.error("Download error details:", errorData.details);
                      }
                    } catch (e) {
                      errorMessage = `Server error: ${response.status} ${response.statusText}`;
                    }
                    showSnackbar(errorMessage, "error");
                    return;
                  }
                  
                  // Get the file blob only if response is ok and not JSON
                  const blob = await response.blob();
                  
                  // Check if blob is empty or too small (might be an error message)
                  if (blob.size === 0) {
                    showSnackbar("Resume file is empty or not available", "error");
                    return;
                  }

                  // Create download link
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download =
                    selectedReferral.resumeFileName || "resume.pdf";
                  document.body.appendChild(a);
                  a.click();
                  
                  // Clean up
                  setTimeout(() => {
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                  }, 100);

                  showSnackbar(
                    "Resume downloaded successfully!",
                    "success"
                  );
                } catch (error) {
                  console.error("Error downloading resume:", error);
                  showSnackbar(
                    error.message || "Failed to download resume",
                    "error"
                  );
                } finally {
                  setDownloadingResume(false);
                }
              }}
            >
              {downloadingResume ? "Downloading..." : "Download Resume"}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
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

export default ManageReferrals;
