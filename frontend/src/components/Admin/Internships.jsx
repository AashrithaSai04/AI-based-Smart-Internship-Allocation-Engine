// Manage internship postings
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  MonetizationOn as MoneyIcon,
} from "@mui/icons-material";
import InternshipForm from "./InternshipForm";

const Internships = () => {
  const [internships, setInternships] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [internshipToDelete, setInternshipToDelete] = useState(null);

  // Mock data for demonstration
  useEffect(() => {
    setInternships([
      {
        id: 1,
        role: "Software Development Intern",
        company: "Infosys",
        location: "Bangalore",
        duration: "3 months",
        stipend: "₹20,000/month",
        skills: ["React", "Node.js", "JavaScript"],
        status: "Active",
        applications: 45,
        maxApplications: 100,
        deadline: "2025-10-15",
        socialPreference: "General",
      },
      {
        id: 2,
        role: "Data Science Intern",
        company: "Tata Consultancy Services",
        location: "Mumbai",
        duration: "6 months",
        stipend: "₹25,000/month",
        skills: ["Python", "Machine Learning", "SQL"],
        status: "Active",
        applications: 23,
        maxApplications: 50,
        deadline: "2025-10-20",
        socialPreference: "SC/ST",
      },
      {
        id: 3,
        role: "UX Design Intern",
        company: "Wipro",
        location: "Hyderabad",
        duration: "4 months",
        stipend: "₹18,000/month",
        skills: ["Figma", "Adobe XD", "User Research"],
        status: "Draft",
        applications: 0,
        maxApplications: 30,
        deadline: "2025-11-01",
        socialPreference: "General",
      },
    ]);
  }, []);

  const handleAddInternship = () => {
    setSelectedInternship(null);
    setFormOpen(true);
  };

  const handleEditInternship = (internship) => {
    setSelectedInternship(internship);
    setFormOpen(true);
  };

  const handleDeleteInternship = (internship) => {
    setInternshipToDelete(internship);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    setInternships(internships.filter(i => i.id !== internshipToDelete.id));
    setDeleteDialogOpen(false);
    setInternshipToDelete(null);
  };

  const handleSubmitInternship = async (formData) => {
    try {
      if (selectedInternship) {
        // Update existing internship
        setInternships(internships.map(i => 
          i.id === selectedInternship.id 
            ? { ...formData, id: selectedInternship.id, applications: selectedInternship.applications }
            : i
        ));
      } else {
        // Add new internship
        const newInternship = {
          ...formData,
          id: Date.now(),
          applications: 0,
          status: 'Draft'
        };
        setInternships([...internships, newInternship]);
      }
      setFormOpen(false);
    } catch (error) {
      console.error("Error saving internship:", error);
      throw error;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Draft': return 'warning';
      case 'Closed': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Internship Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddInternship}
          size="large"
        >
          Post New Internship
        </Button>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <BusinessIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" color="primary">
                {internships.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Internships
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <ViewIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h4" color="success.main">
                {internships.filter(i => i.status === 'Active').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Postings
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <EditIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h4" color="warning.main">
                {internships.filter(i => i.status === 'Draft').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Draft Postings
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <MoneyIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
              <Typography variant="h4" color="info.main">
                {internships.reduce((sum, i) => sum + i.applications, 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Applications
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Internships Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            All Internship Postings
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Role</TableCell>
                  <TableCell>Company</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Stipend</TableCell>
                  <TableCell>Applications</TableCell>
                  <TableCell>Deadline</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {internships.map((internship) => (
                  <TableRow key={internship.id}>
                    <TableCell>
                      <Typography variant="subtitle2">{internship.role}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {internship.skills.slice(0, 3).join(', ')}
                        {internship.skills.length > 3 && '...'}
                      </Typography>
                    </TableCell>
                    <TableCell>{internship.company}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LocationIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                        {internship.location}
                      </Box>
                    </TableCell>
                    <TableCell>{internship.stipend}</TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {internship.applications}/{internship.maxApplications}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {Math.round((internship.applications / internship.maxApplications) * 100)}% filled
                      </Typography>
                    </TableCell>
                    <TableCell>{new Date(internship.deadline).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Chip 
                        label={internship.status} 
                        color={getStatusColor(internship.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton 
                        size="small" 
                        onClick={() => handleEditInternship(internship)}
                        title="Edit"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        onClick={() => handleDeleteInternship(internship)}
                        title="Delete"
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Floating Action Button for mobile */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 16, right: 16, display: { xs: 'flex', sm: 'none' } }}
        onClick={handleAddInternship}
      >
        <AddIcon />
      </Fab>

      {/* Internship Form Dialog */}
      <InternshipForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmitInternship}
        internship={selectedInternship}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Are you sure you want to delete this internship posting?
          </Alert>
          {internshipToDelete && (
            <Typography>
              <strong>{internshipToDelete.role}</strong> at {internshipToDelete.company}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Internships;
