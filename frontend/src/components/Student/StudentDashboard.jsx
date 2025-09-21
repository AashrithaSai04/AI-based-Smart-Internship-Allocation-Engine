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
  Paper,
  TextField,
  CircularProgress,
  Alert,
  Chip,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import { Upload as UploadIcon, Search as SearchIcon } from "@mui/icons-material";
import { getInternships, uploadResumeAndMatch } from "../../api/api";

const StudentDashboard = () => {
  const [tab, setTab] = useState(0);
  const [internships, setInternships] = useState([]);
  const [resumeText, setResumeText] = useState("");
  const [matchedInternships, setMatchedInternships] = useState([]);
  const [isMatching, setIsMatching] = useState(false);
  const [matchError, setMatchError] = useState("");
  const [showMatchDialog, setShowMatchDialog] = useState(false);

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

  const handleResumeMatch = async () => {
    if (!resumeText.trim()) {
      setMatchError("Please enter your resume text");
      return;
    }

    setIsMatching(true);
    setMatchError("");
    
    try {
      const matches = await uploadResumeAndMatch(resumeText);
      setMatchedInternships(matches);
      setShowMatchDialog(true);
    } catch (error) {
      console.error("Error matching resume:", error);
      setMatchError("Failed to match resume. Please try again.");
    } finally {
      setIsMatching(false);
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
            <Tab label="AI Resume Matching" />
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
              AI-Powered Resume Matching
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Upload your resume text and get personalized internship recommendations based on AI analysis
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  multiline
                  rows={12}
                  variant="outlined"
                  label="Paste your resume text here..."
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Copy and paste your resume content here for AI analysis..."
                  sx={{ mb: 2 }}
                />
                
                {matchError && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {matchError}
                  </Alert>
                )}
                
                <Button
                  variant="contained"
                  startIcon={isMatching ? <CircularProgress size={20} /> : <SearchIcon />}
                  onClick={handleResumeMatch}
                  disabled={isMatching || !resumeText.trim()}
                  size="large"
                  sx={{ mb: 2 }}
                >
                  {isMatching ? "Finding Matches..." : "Find Best Matches"}
                </Button>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card variant="outlined" sx={{ bgcolor: "primary.light", color: "primary.contrastText" }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      <UploadIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                      How it works
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      Our AI analyzes your resume and matches it with internships based on:
                    </Typography>
                    <ul style={{ margin: 0, paddingLeft: 20 }}>
                      <li>Skills and technologies</li>
                      <li>Educational background</li>
                      <li>Location preferences</li>
                      <li>Industry experience</li>
                    </ul>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </CardContent>
        )}
        
        {tab === 2 && (
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

        {/* AI Match Results Dialog */}
        <Dialog 
          open={showMatchDialog} 
          onClose={() => setShowMatchDialog(false)}
          maxWidth="lg"
          fullWidth
        >
          <DialogTitle>
            Your Top Internship Matches
          </DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Based on your resume analysis, here are your best-matched internships:
            </Typography>
            
            <Grid container spacing={2}>
              {matchedInternships.map((match, index) => (
                <Grid item xs={12} key={index}>
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} md={8}>
                        <Typography variant="h6">{match.Role}</Typography>
                        <Typography color="text.secondary" sx={{ mb: 1 }}>
                          {match["Company Name"]} • {match.Location}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          <strong>Stipend:</strong> {match.Stipend}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Skills:</strong> {match.Skills}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={4} sx={{ textAlign: "center" }}>
                        <Typography variant="body2" color="text.secondary">
                          AI Match Score
                        </Typography>
                        <Rating 
                          value={(match.Final_Score || 0) * 5} 
                          readOnly 
                          precision={0.1}
                          sx={{ mb: 1 }}
                        />
                        <Typography variant="body2">
                          {((match.Final_Score || 0) * 100).toFixed(1)}% match
                        </Typography>
                        <Chip 
                          label={match.Sector} 
                          size="small" 
                          sx={{ mt: 1 }}
                        />
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowMatchDialog(false)}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Card>
    </Box>
  );
};

export default StudentDashboard;
