import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Visibility as VisibilityIcon,
  GetApp as DownloadIcon,
  Schedule as ScheduleIcon,
  Assignment as AssignmentIcon,
  TrendingUp as TrendingUpIcon,
  Groups as GroupsIcon,
} from "@mui/icons-material";
import { getApplications, setApplicationDeadline, triggerBatchMatching } from "../../api/api";

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showApplicationDialog, setShowApplicationDialog] = useState(false);
  const [showDeadlineDialog, setShowDeadlineDialog] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [deadline, setDeadline] = useState("");
  const [maxApplications, setMaxApplications] = useState(100);
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", severity: "info" });

  // Mock data for demonstration
  const mockApplications = [
    {
      id: 1,
      student_name: "Alice Johnson",
      student_email: "alice@example.com",
      internship_title: "Software Development Intern",
      company: "TechCorp",
      location: "Mumbai",
      social_category: "General",
      past_participation: 1,
      submitted_at: "2025-09-20T10:30:00Z",
      status: "pending",
      ai_score: 0.87
    },
    {
      id: 2,
      student_name: "Bob Smith",
      student_email: "bob@example.com",
      internship_title: "Data Science Intern",
      company: "DataLab",
      location: "Delhi",
      social_category: "OBC",
      past_participation: 0,
      submitted_at: "2025-09-19T14:20:00Z",
      status: "pending",
      ai_score: 0.92
    },
    {
      id: 3,
      student_name: "Carol Davis",
      student_email: "carol@example.com",
      internship_title: "UI/UX Design Intern",
      company: "DesignStudio",
      location: "Bangalore",
      social_category: "SC",
      past_participation: 2,
      submitted_at: "2025-09-18T09:15:00Z",
      status: "accepted",
      ai_score: 0.95
    }
  ];

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      // In a real app, this would fetch from backend
      // const data = await getApplications();
      // setApplications(data);
      
      // For now, use mock data
      setApplications(mockApplications);
    } catch (error) {
      console.error("Error loading applications:", error);
      showAlert("Error loading applications", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleViewApplication = (application) => {
    setSelectedApplication(application);
    setShowApplicationDialog(true);
  };

  const handleSetDeadline = (internship) => {
    setSelectedInternship(internship);
    setShowDeadlineDialog(true);
  };

  const handleSaveDeadline = async () => {
    try {
      setLoading(true);
      // In a real app, call backend API
      // await setApplicationDeadline({
      //   internship_id: selectedInternship.id,
      //   deadline: deadline,
      //   max_applications: maxApplications
      // });
      
      showAlert(`Deadline set for ${selectedInternship} successfully!`, "success");
      setShowDeadlineDialog(false);
      setDeadline("");
      setMaxApplications(100);
    } catch (error) {
      console.error("Error setting deadline:", error);
      showAlert("Error setting deadline", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerMatching = async () => {
    try {
      setLoading(true);
      // In a real app, call backend API
      // await triggerBatchMatching();
      
      showAlert("Batch matching triggered successfully!", "success");
      loadApplications(); // Refresh data
    } catch (error) {
      console.error("Error triggering matching:", error);
      showAlert("Error triggering batch matching", "error");
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (message, severity) => {
    setAlert({ show: true, message, severity });
    setTimeout(() => setAlert({ show: false, message: "", severity: "info" }), 5000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "warning";
      case "accepted": return "success";
      case "rejected": return "error";
      default: return "default";
    }
  };

  const filteredApplications = applications.filter(app => 
    filterStatus === "all" || app.status === filterStatus
  );

  const stats = {
    total: applications.length,
    pending: applications.filter(app => app.status === "pending").length,
    accepted: applications.filter(app => app.status === "accepted").length,
    rejected: applications.filter(app => app.status === "rejected").length,
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ color: "#1976d2", fontWeight: "bold" }}>
        Application Management
      </Typography>

      {alert.show && (
        <Alert severity={alert.severity} sx={{ mb: 3 }}>
          {alert.message}
        </Alert>
      )}

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <CardContent sx={{ textAlign: "center" }}>
              <AssignmentIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4">{stats.total}</Typography>
              <Typography variant="body2">Total Applications</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
            <CardContent sx={{ textAlign: "center" }}>
              <ScheduleIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4">{stats.pending}</Typography>
              <Typography variant="body2">Pending Review</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
            <CardContent sx={{ textAlign: "center" }}>
              <TrendingUpIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4">{stats.accepted}</Typography>
              <Typography variant="body2">Accepted</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: 'white' }}>
            <CardContent sx={{ textAlign: "center" }}>
              <GroupsIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4">{stats.rejected}</Typography>
              <Typography variant="body2">Rejected</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Box sx={{ mb: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
        <Button
          variant="contained"
          onClick={handleTriggerMatching}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : <TrendingUpIcon />}
        >
          Trigger Batch Matching
        </Button>
        <Button
          variant="outlined"
          onClick={() => setShowDeadlineDialog(true)}
          startIcon={<ScheduleIcon />}
        >
          Set Deadline
        </Button>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Filter Status</InputLabel>
          <Select
            value={filterStatus}
            label="Filter Status"
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="accepted">Accepted</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Applications Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Applications ({filteredApplications.length})
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Student</TableCell>
                  <TableCell>Position</TableCell>
                  <TableCell>Company</TableCell>
                  <TableCell>AI Score</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Submitted</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredApplications.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {application.student_name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {application.student_email}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{application.internship_title}</TableCell>
                    <TableCell>{application.company}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography variant="body2">
                          {(application.ai_score * 100).toFixed(1)}%
                        </Typography>
                        <Box
                          sx={{
                            width: 50,
                            height: 6,
                            backgroundColor: "#e0e0e0",
                            borderRadius: 3,
                            overflow: "hidden",
                          }}
                        >
                          <Box
                            sx={{
                              width: `${application.ai_score * 100}%`,
                              height: "100%",
                              backgroundColor: application.ai_score > 0.8 ? "#4caf50" : application.ai_score > 0.6 ? "#ff9800" : "#f44336",
                            }}
                          />
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={application.status}
                        color={getStatusColor(application.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(application.submitted_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          onClick={() => handleViewApplication(application)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Download Resume">
                        <IconButton size="small">
                          <DownloadIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredApplications.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} sx={{ textAlign: "center", py: 3 }}>
                      No applications found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Application Details Dialog */}
      <Dialog
        open={showApplicationDialog}
        onClose={() => setShowApplicationDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Application Details</DialogTitle>
        <DialogContent>
          {selectedApplication && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Student Information</Typography>
                <Typography><strong>Name:</strong> {selectedApplication.student_name}</Typography>
                <Typography><strong>Email:</strong> {selectedApplication.student_email}</Typography>
                <Typography><strong>Location:</strong> {selectedApplication.location}</Typography>
                <Typography><strong>Social Category:</strong> {selectedApplication.social_category}</Typography>
                <Typography><strong>Past Participation:</strong> {selectedApplication.past_participation}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Application Details</Typography>
                <Typography><strong>Position:</strong> {selectedApplication.internship_title}</Typography>
                <Typography><strong>Company:</strong> {selectedApplication.company}</Typography>
                <Typography><strong>AI Match Score:</strong> {(selectedApplication.ai_score * 100).toFixed(1)}%</Typography>
                <Typography><strong>Status:</strong> 
                  <Chip
                    label={selectedApplication.status}
                    color={getStatusColor(selectedApplication.status)}
                    size="small"
                    sx={{ ml: 1 }}
                  />
                </Typography>
                <Typography><strong>Submitted:</strong> {new Date(selectedApplication.submitted_at).toLocaleString()}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Resume Preview</Typography>
                <Paper sx={{ p: 2, bgcolor: "#f5f5f5", maxHeight: 200, overflow: "auto" }}>
                  <Typography variant="body2">
                    Resume content would be displayed here...
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowApplicationDialog(false)}>Close</Button>
          <Button variant="outlined" color="error">Reject</Button>
          <Button variant="contained">Accept</Button>
        </DialogActions>
      </Dialog>

      {/* Set Deadline Dialog */}
      <Dialog
        open={showDeadlineDialog}
        onClose={() => setShowDeadlineDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Set Application Deadline</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="datetime-local"
                label="Application Deadline"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="number"
                label="Maximum Applications"
                value={maxApplications}
                onChange={(e) => setMaxApplications(parseInt(e.target.value) || 0)}
                inputProps={{ min: 1 }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeadlineDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSaveDeadline}
            disabled={!deadline || loading}
          >
            Set Deadline
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Applications;