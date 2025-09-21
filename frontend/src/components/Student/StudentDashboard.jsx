
import React, { useState, useEffect } from "react";
import { getInternships } from "../../api/api";
import { Box, Tabs, Tab, Paper, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

// Mock applied opportunities and status
const MOCK_APPLIED = [
  {
    _id: "1",
    title: "Software Development Intern",
    company: "Innovate Solutions Inc.",
    status: "Under Review",
  },
  {
    _id: "2",
    title: "Data Science Intern",
    company: "DataGenius Corp.",
    status: "Accepted",
  },
];

const StudentDashboard = () => {
  const [tab, setTab] = useState(0);
  const [internships, setInternships] = useState([]);

  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    try {
      const response = await getInternships();
      setInternships(response.data);
    } catch (error) {
      console.error("Failed to fetch internships", error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" mb={3} align="center">
        Student Dashboard
      </Typography>
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} centered>
          <Tab label="Opportunities to Apply" />
          <Tab label="Applied Opportunities" />
          <Tab label="Application Status" />
        </Tabs>
      </Paper>
      {tab === 0 && (
        <Box>
          <Typography variant="h6" mb={2}>Available Internships</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Company</TableCell>
                  <TableCell>Skills</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {internships.map((internship) => (
                  <TableRow key={internship._id}>
                    <TableCell>{internship.title}</TableCell>
                    <TableCell>{internship.company}</TableCell>
                    <TableCell>{internship.requiredSkills.join(", ")}</TableCell>
                    <TableCell>{internship.location}</TableCell>
                    <TableCell>
                      <Button variant="contained" color="primary" size="small">
                        Apply
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
      {tab === 1 && (
        <Box>
          <Typography variant="h6" mb={2}>Applied Opportunities</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Company</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {MOCK_APPLIED.map((app) => (
                  <TableRow key={app._id}>
                    <TableCell>{app.title}</TableCell>
                    <TableCell>{app.company}</TableCell>
                    <TableCell>{app.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
      {tab === 2 && (
        <Box>
          <Typography variant="h6" mb={2}>Application Status</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Company</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {MOCK_APPLIED.map((app) => (
                  <TableRow key={app._id}>
                    <TableCell>{app.title}</TableCell>
                    <TableCell>{app.company}</TableCell>
                    <TableCell>{app.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Box>
  );
};

export default StudentDashboard;
