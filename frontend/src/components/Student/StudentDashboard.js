import React, { useState, useEffect } from "react";
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Button,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from "@mui/material";
import { getInternships } from "../../api/api";

const StudentDashboard = () => {
  const [tab, setTab] = useState(0);
  const [internships, setInternships] = useState([]);

  const mockApplied = [
    { id: 1, title: "Software Development Intern", company: "Tech Corp", status: "Under Review" },
    { id: 2, title: "Data Science Intern", company: "Data Lab", status: "Accepted" },
  ];

  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    try {
      const response = await getInternships();
      setInternships(response.data || []);
    } catch (error) {
      console.error("Failed to fetch internships", error);
      // Use mock data
      setInternships([
        { id: 1, title: "Frontend Developer", company: "TechStart", location: "Remote" },
        { id: 2, title: "Backend Developer", company: "DataCorp", location: "NYC" },
      ]);
    }
  };

  return (
    <Box sx={{ p: 3, minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      <Typography variant="h4" gutterBottom>
        Student Dashboard
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="h3" color="primary">3</Typography>
              <Typography variant="body2">Applications</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="h3" color="warning.main">2</Typography>
              <Typography variant="body2">Interviews</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="h3" color="success.main">1</Typography>
              <Typography variant="body2">Offers</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tab} onChange={(_, newValue) => setTab(newValue)}>
            <Tab label="Available Internships" />
            <Tab label="My Applications" />
          </Tabs>
        </Box>
        
        {tab === 0 && (
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recommended Internships
            </Typography>
            <Grid container spacing={2}>
              {internships.map((internship) => (
                <Grid item xs={12} md={6} key={internship.id || internship._id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6">{internship.title}</Typography>
                      <Typography color="text.secondary">{internship.company}</Typography>
                      <Typography variant="body2">{internship.location}</Typography>
                      <Button variant="contained" size="small" sx={{ mt: 2 }}>
                        Apply Now
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        )}
        
        {tab === 1 && (
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Application Status
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Position</TableCell>
                    <TableCell>Company</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mockApplied.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell>{app.title}</TableCell>
                      <TableCell>{app.company}</TableCell>
                      <TableCell>{app.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        )}
      </Card>
    </Box>
  );
};

export default StudentDashboard;
