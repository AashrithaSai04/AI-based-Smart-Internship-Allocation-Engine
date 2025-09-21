import React, { useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Slider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  PlayArrow,
  Settings,
  Assessment,
  Person,
  Business,
  Star,
  CheckCircle,
  Schedule,
  FilterList,
} from "@mui/icons-material";

const MatchingPortal = () => {
  const [preferences, setPreferences] = useState({
    skillWeight: 70,
    locationWeight: 15,
    socialCategoryWeight: 10,
    pastParticipationWeight: 5,
  });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [matchDialogOpen, setMatchDialogOpen] = useState(false);

  // Mock data for demonstration
  const [students] = useState([
    {
      id: 1,
      name: "Alice Johnson",
      skills: ["React", "Python", "Machine Learning"],
      gpa: 3.8,
      location: "San Francisco",
      social_category: "General",
      past_participation: false,
    },
    {
      id: 2,
      name: "Bob Smith",
      skills: ["Java", "Spring Boot", "SQL"],
      gpa: 3.6,
      location: "New York",
      social_category: "SC",
      past_participation: true,
    },
    {
      id: 3,
      name: "Carol Davis",
      skills: ["UX Design", "Figma", "User Research"],
      gpa: 3.9,
      location: "Austin",
      social_category: "OBC",
      past_participation: false,
    },
  ]);

  const [internships] = useState([
    {
      id: 1,
      title: "Software Developer Intern",
      company: "TechCorp",
      location: "San Francisco",
      required_skills: ["React", "JavaScript", "Python"],
      social_preference: "General",
      capacity: 3,
      allocated: 1,
    },
    {
      id: 2,
      title: "Data Science Intern",
      company: "DataLab",
      location: "New York",
      required_skills: ["Python", "Machine Learning", "SQL"],
      social_preference: "SC",
      capacity: 2,
      allocated: 0,
    },
  ]);

  const [mockMatches] = useState([
    {
      student: "Alice Johnson",
      internship: "Software Developer Intern",
      company: "TechCorp",
      matchScore: 92,
      skillsMatch: 95,
      locationMatch: 100,
      overallFit: "Excellent",
      status: "Recommended",
    },
    {
      student: "Bob Smith",
      internship: "Data Science Intern",
      company: "DataLab",
      matchScore: 87,
      skillsMatch: 80,
      locationMatch: 100,
      overallFit: "Very Good",
      status: "Recommended",
    },
    {
      student: "Carol Davis",
      internship: "Software Developer Intern",
      company: "TechCorp",
      matchScore: 78,
      skillsMatch: 70,
      locationMatch: 85,
      overallFit: "Good",
      status: "Consider",
    },
  ]);

  const handleSliderChange = (name) => (event, newValue) => {
    setPreferences({
      ...preferences,
      [name]: newValue,
    });
  };

  const handleMatch = async () => {
    setLoading(true);
    try {
      // For demo purposes, we'll use mock data
      // const response = await matchStudents(preferences);
      // setResults(response.data);
      
      // Simulate API call delay
      setTimeout(() => {
        setResults(mockMatches);
        setLoading(false);
        setMatchDialogOpen(false);
      }, 3000);
    } catch (error) {
      console.error("Matching failed", error);
      setLoading(false);
    }
  };

  const getMatchColor = (score) => {
    if (score >= 90) return "success";
    if (score >= 80) return "info";
    if (score >= 70) return "warning";
    return "error";
  };

  const getStatusChip = (status) => {
    const colors = {
      "Recommended": "success",
      "Consider": "warning",
      "Not Suitable": "error",
    };
    return <Chip label={status} color={colors[status] || "default"} size="small" />;
  };

  return (
    <Box sx={{ p: 3, bgcolor: "#f8fafc", minHeight: "100vh" }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          AI-Powered Matching Portal
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Configure matching parameters and run the intelligent allocation engine
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Controls Panel */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Settings sx={{ mr: 2, color: "primary.main" }} />
                <Typography variant="h6" fontWeight="bold">
                  Matching Parameters
                </Typography>
              </Box>

              <Box sx={{ mb: 4 }}>
                <Typography gutterBottom>
                  Skills Weight: {preferences.skillWeight}%
                </Typography>
                <Slider
                  value={preferences.skillWeight}
                  onChange={handleSliderChange("skillWeight")}
                  min={0}
                  max={100}
                  valueLabelDisplay="auto"
                  color="primary"
                />
              </Box>

              <Box sx={{ mb: 4 }}>
                <Typography gutterBottom>
                  Location Weight: {preferences.locationWeight}%
                </Typography>
                <Slider
                  value={preferences.locationWeight}
                  onChange={handleSliderChange("locationWeight")}
                  min={0}
                  max={100}
                  valueLabelDisplay="auto"
                  color="secondary"
                />
              </Box>

              <Box sx={{ mb: 4 }}>
                <Typography gutterBottom>
                  Social Category Weight: {preferences.socialCategoryWeight}%
                </Typography>
                <Slider
                  value={preferences.socialCategoryWeight}
                  onChange={handleSliderChange("socialCategoryWeight")}
                  min={0}
                  max={100}
                  valueLabelDisplay="auto"
                  color="info"
                />
              </Box>

              <Box sx={{ mb: 4 }}>
                <Typography gutterBottom>
                  Past Participation Weight: {preferences.pastParticipationWeight}%
                </Typography>
                <Slider
                  value={preferences.pastParticipationWeight}
                  onChange={handleSliderChange("pastParticipationWeight")}
                  min={0}
                  max={100}
                  valueLabelDisplay="auto"
                  color="warning"
                />
              </Box>

              <Button
                variant="contained"
                size="large"
                fullWidth
                startIcon={loading ? <CircularProgress size={20} /> : <PlayArrow />}
                onClick={() => setMatchDialogOpen(true)}
                disabled={loading}
                sx={{
                  py: 1.5,
                  background: "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
                }}
              >
                {loading ? "Running AI Engine..." : "Run Matching Engine"}
              </Button>
            </CardContent>
          </Card>

          {/* Statistics Card */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Current Statistics
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="body2">Total Students:</Typography>
                <Typography variant="body2" fontWeight="bold">{students.length}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="body2">Available Internships:</Typography>
                <Typography variant="body2" fontWeight="bold">{internships.length}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="body2">Successful Matches:</Typography>
                <Typography variant="body2" fontWeight="bold">{results?.length || 0}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Results Panel */}
        <Grid item xs={12} md={8}>
          <Card>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs value={selectedTab} onChange={(_, v) => setSelectedTab(v)}>
                <Tab 
                  label="Match Results" 
                  icon={<Assessment />} 
                  iconPosition="start"
                />
                <Tab 
                  label="Student Pool" 
                  icon={<Person />} 
                  iconPosition="start"
                />
                <Tab 
                  label="Internship Pool" 
                  icon={<Business />} 
                  iconPosition="start"
                />
              </Tabs>
            </Box>

            <CardContent>
              {selectedTab === 0 && (
                <Box>
                  {!results ? (
                    <Box sx={{ textAlign: "center", py: 6 }}>
                      <Assessment sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
                      <Typography variant="h6" gutterBottom>
                        No Matching Results Yet
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Configure parameters and run the AI matching engine to see results
                      </Typography>
                    </Box>
                  ) : (
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Student</TableCell>
                            <TableCell>Internship</TableCell>
                            <TableCell>Company</TableCell>
                            <TableCell>Match Score</TableCell>
                            <TableCell>Skills Match</TableCell>
                            <TableCell>Overall Fit</TableCell>
                            <TableCell>Status</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {results.map((match, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                  <Avatar sx={{ mr: 2, width: 32, height: 32 }}>
                                    {match.student.charAt(0)}
                                  </Avatar>
                                  {match.student}
                                </Box>
                              </TableCell>
                              <TableCell>{match.internship}</TableCell>
                              <TableCell>{match.company}</TableCell>
                              <TableCell>
                                <Chip
                                  icon={<Star />}
                                  label={`${match.matchScore}%`}
                                  color={getMatchColor(match.matchScore)}
                                  variant="outlined"
                                />
                              </TableCell>
                              <TableCell>
                                <LinearProgress
                                  variant="determinate"
                                  value={match.skillsMatch}
                                  sx={{ width: 80, mr: 1 }}
                                />
                                {match.skillsMatch}%
                              </TableCell>
                              <TableCell>{match.overallFit}</TableCell>
                              <TableCell>{getStatusChip(match.status)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </Box>
              )}

              {selectedTab === 1 && (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Student</TableCell>
                        <TableCell>Skills</TableCell>
                        <TableCell>GPA</TableCell>
                        <TableCell>Location</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Past Participation</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {students.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Avatar sx={{ mr: 2, width: 32, height: 32 }}>
                                {student.name.charAt(0)}
                              </Avatar>
                              {student.name}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                              {student.skills.slice(0, 2).map((skill) => (
                                <Chip key={skill} label={skill} size="small" variant="outlined" />
                              ))}
                              {student.skills.length > 2 && (
                                <Chip label={`+${student.skills.length - 2}`} size="small" />
                              )}
                            </Box>
                          </TableCell>
                          <TableCell>{student.gpa}</TableCell>
                          <TableCell>{student.location}</TableCell>
                          <TableCell>{student.social_category}</TableCell>
                          <TableCell>
                            {student.past_participation ? (
                              <CheckCircle color="warning" />
                            ) : (
                              <Schedule color="success" />
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              {selectedTab === 2 && (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Position</TableCell>
                        <TableCell>Company</TableCell>
                        <TableCell>Location</TableCell>
                        <TableCell>Required Skills</TableCell>
                        <TableCell>Capacity</TableCell>
                        <TableCell>Allocated</TableCell>
                        <TableCell>Available</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {internships.map((internship) => (
                        <TableRow key={internship.id}>
                          <TableCell>{internship.title}</TableCell>
                          <TableCell>{internship.company}</TableCell>
                          <TableCell>{internship.location}</TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                              {internship.required_skills.slice(0, 2).map((skill) => (
                                <Chip key={skill} label={skill} size="small" variant="outlined" />
                              ))}
                              {internship.required_skills.length > 2 && (
                                <Chip label={`+${internship.required_skills.length - 2}`} size="small" />
                              )}
                            </Box>
                          </TableCell>
                          <TableCell>{internship.capacity}</TableCell>
                          <TableCell>{internship.allocated}</TableCell>
                          <TableCell>
                            <Chip 
                              label={internship.capacity - internship.allocated}
                              color={internship.capacity - internship.allocated > 0 ? "success" : "error"}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Matching Confirmation Dialog */}
      <Dialog open={matchDialogOpen} onClose={() => !loading && setMatchDialogOpen(false)}>
        <DialogTitle>
          Run AI Matching Engine
        </DialogTitle>
        <DialogContent>
          {loading ? (
            <Box sx={{ textAlign: "center", py: 3 }}>
              <CircularProgress size={60} sx={{ mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Processing Matches...
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Analyzing student profiles and internship requirements
              </Typography>
            </Box>
          ) : (
            <Box>
              <Alert severity="info" sx={{ mb: 2 }}>
                This will run the AI matching algorithm with your current parameter settings.
              </Alert>
              <Typography variant="body2" gutterBottom>
                Current Settings:
              </Typography>
              <Typography variant="body2">• Skills Weight: {preferences.skillWeight}%</Typography>
              <Typography variant="body2">• Location Weight: {preferences.locationWeight}%</Typography>
              <Typography variant="body2">• Social Category Weight: {preferences.socialCategoryWeight}%</Typography>
              <Typography variant="body2">• Past Participation Weight: {preferences.pastParticipationWeight}%</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMatchDialogOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleMatch} variant="contained" disabled={loading}>
            {loading ? "Processing..." : "Start Matching"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MatchingPortal;
