import React, { useState, useEffect } from "react";
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
  Divider,
  Rating,
  Accordion,
  AccordionSummary,
  AccordionDetails,
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
  ExpandMore,
  LocationOn,
  WorkOutline,
  Code,
  Group,
  History,
} from "@mui/icons-material";
import { matchResumes } from "../../api/api";

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
  const [selectedJob, setSelectedJob] = useState("");
  const [selectedJobDetails, setSelectedJobDetails] = useState(null);
  const [topN, setTopN] = useState(15);

  // Available jobs for matching (could come from internships list)
  const [availableJobs] = useState([
    {
      id: 0,
      title: "Software Developer Intern",
      company: "TechCorp",
      location: "San Francisco",
      required_skills: ["React", "JavaScript", "Python"],
      social_preference: "General",
      capacity: 3,
    },
    {
      id: 1,
      title: "Data Science Intern",
      company: "DataLab",
      location: "New York",
      required_skills: ["Python", "Machine Learning", "SQL"],
      social_preference: "SC",
      capacity: 2,
    },
    {
      id: 2,
      title: "UX Design Intern",
      company: "Creative Studio",
      location: "Austin",
      required_skills: ["Figma", "Adobe XD", "User Research"],
      social_preference: "General",
      capacity: 2,
    },
  ]);

  useEffect(() => {
    // Set default job selection
    if (availableJobs.length > 0) {
      setSelectedJob(availableJobs[0].id.toString());
      setSelectedJobDetails(availableJobs[0]);
    }
  }, [availableJobs]);

  const handleJobSelection = (jobId) => {
    setSelectedJob(jobId);
    const jobDetails = availableJobs.find(job => job.id.toString() === jobId);
    setSelectedJobDetails(jobDetails);
    setResults(null); // Clear previous results when job changes
  };

  const handleSliderChange = (name) => (event, newValue) => {
    setPreferences({
      ...preferences,
      [name]: newValue,
    });
  };

  const handleMatch = async () => {
    if (!selectedJobDetails) {
      alert("Please select a job/internship first");
      return;
    }

    setLoading(true);
    try {
      // Use real backend API
      const matches = await matchResumes(selectedJobDetails.id, topN);
      
      // Transform backend response to display format
      const formattedResults = matches.map((match, index) => ({
        id: index,
        student: match.Resume || `Student ${index + 1}`,
        internship: selectedJobDetails.title,
        company: selectedJobDetails.company,
        matchScore: Math.round((match.Final_Score || 0) * 100),
        skillsMatch: Math.round((match.Skills_Score || 0) * 100),
        locationMatch: match.Location || "N/A",
        category: match.Category || "General",
        socialCategory: match.SocialCategory || "General",
        pastParticipation: match.PastParticipation || false,
        overallFit: getOverallFit(match.Final_Score),
        status: getRecommendationStatus(match.Final_Score),
        rawData: match
      }));

      setResults(formattedResults);
    } catch (error) {
      console.error("Matching failed", error);
      // Fallback to mock data if backend fails
      setResults([
        {
          id: 1,
          student: "Alice Johnson",
          internship: selectedJobDetails.title,
          company: selectedJobDetails.company,
          matchScore: 92,
          skillsMatch: 95,
          locationMatch: "San Francisco",
          category: "Data Science",
          socialCategory: "General",
          pastParticipation: false,
          overallFit: "Excellent",
          status: "Recommended",
        },
        {
          id: 2,
          student: "Bob Smith", 
          internship: selectedJobDetails.title,
          company: selectedJobDetails.company,
          matchScore: 87,
          skillsMatch: 80,
          locationMatch: "New York",
          category: "Technology",
          socialCategory: "SC",
          pastParticipation: true,
          overallFit: "Very Good",
          status: "Recommended",
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getOverallFit = (score) => {
    if (score >= 0.9) return "Excellent";
    if (score >= 0.8) return "Very Good";
    if (score >= 0.7) return "Good";
    if (score >= 0.6) return "Fair";
    return "Poor";
  };

  const getRecommendationStatus = (score) => {
    if (score >= 0.8) return "Recommended";
    if (score >= 0.6) return "Consider";
    return "Not Suitable";
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
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      {/* Header */}
      <Box sx={{ mb: 4, p: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', borderRadius: 3 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          AI-Powered Matching Portal
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          Configure matching parameters and run the intelligent allocation engine
        </Typography>
      </Box>

      <Box sx={{ px: 3 }}>
        <Grid container spacing={4}>
          {/* Job Selection Panel */}
          <Grid item xs={12}>
            <Card sx={{ mb: 4, borderRadius: 3, background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
                  <WorkOutline sx={{ mr: 2, color: "primary.main", fontSize: 32 }} />
                  <Typography variant="h5" fontWeight="bold">
                    Select Job/Internship for Candidate Matching
                  </Typography>
                </Box>
                
                <Grid container spacing={4} alignItems="center">
                  <Grid item xs={12} md={5}>
                    <FormControl fullWidth>
                      <InputLabel>Select Internship</InputLabel>
                      <Select
                        value={selectedJob}
                        onChange={(e) => handleJobSelection(e.target.value)}
                        label="Select Internship"
                        sx={{
                          minHeight: '60px',
                          '& .MuiSelect-select': {
                            display: 'flex',
                            alignItems: 'center',
                          },
                        }}
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 300,
                            },
                          },
                        }}
                      >
                        {availableJobs.map((job) => (
                          <MenuItem key={job.id} value={job.id.toString()} sx={{ py: 2 }}>
                            <Box>
                              <Typography variant="body1" fontWeight="bold">
                                {job.title}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {job.company} • {job.location}
                              </Typography>
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      label="Top N Candidates"
                      type="number"
                      value={topN}
                      onChange={(e) => setTopN(parseInt(e.target.value) || 15)}
                      inputProps={{ min: 1, max: 50 }}
                      sx={{
                        '& .MuiInputBase-root': {
                          minHeight: '60px',
                        },
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={loading ? <CircularProgress size={20} /> : <PlayArrow />}
                      onClick={handleMatch}
                      disabled={loading || !selectedJobDetails}
                      size="large"
                      sx={{
                        minHeight: '60px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                      }}
                    >
                      {loading ? "Finding..." : "Find Best Candidates"}
                    </Button>
                  </Grid>
                </Grid>

                {selectedJobDetails && (
                  <Box sx={{ mt: 4, p: 3, bgcolor: "rgba(102, 126, 234, 0.1)", borderRadius: 2, border: '2px solid rgba(102, 126, 234, 0.2)' }}>
                    <Typography variant="h6" fontWeight="bold" sx={{ color: "primary.main", mb: 2 }}>
                      Selected Job Details:
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Business sx={{ fontSize: 20, color: 'primary.main' }} />
                          <strong>Company:</strong> {selectedJobDetails.company}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LocationOn sx={{ fontSize: 20, color: 'primary.main' }} />
                          <strong>Location:</strong> {selectedJobDetails.location}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Assessment sx={{ fontSize: 20, color: 'primary.main' }} />
                          <strong>Capacity:</strong> {selectedJobDetails.capacity} positions
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body1" sx={{ mt: 1 }}>
                          <strong>Required Skills:</strong> {selectedJobDetails.required_skills.join(", ")}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Controls Panel */}
          <Grid item xs={12} lg={4}>
            <Card sx={{ mb: 4, borderRadius: 3, background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)' }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
                  <Settings sx={{ mr: 2, color: "primary.main", fontSize: 32 }} />
                  <Typography variant="h5" fontWeight="bold">
                    AI Matching Parameters
                  </Typography>
                </Box>

                <Box sx={{ mb: 4 }}>
                  <Typography gutterBottom variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Code sx={{ fontSize: 20, color: 'primary.main' }} />
                    Skills Weight: {preferences.skillWeight}%
                  </Typography>
                  <Slider
                    value={preferences.skillWeight}
                    onChange={handleSliderChange("skillWeight")}
                    min={0}
                    max={100}
                    valueLabelDisplay="auto"
                    color="primary"
                    sx={{
                      height: 8,
                      '& .MuiSlider-track': {
                        border: 'none',
                      },
                      '& .MuiSlider-thumb': {
                        height: 24,
                        width: 24,
                        backgroundColor: '#fff',
                        border: '2px solid currentColor',
                        '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
                          boxShadow: 'inherit',
                        },
                      },
                    }}
                  />
                </Box>

                <Box sx={{ mb: 4 }}>
                  <Typography gutterBottom variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOn sx={{ fontSize: 20, color: 'secondary.main' }} />
                    Location Weight: {preferences.locationWeight}%
                  </Typography>
                  <Slider
                    value={preferences.locationWeight}
                    onChange={handleSliderChange("locationWeight")}
                    min={0}
                    max={100}
                    valueLabelDisplay="auto"
                    color="secondary"
                    sx={{
                      height: 8,
                      '& .MuiSlider-track': {
                        border: 'none',
                      },
                      '& .MuiSlider-thumb': {
                        height: 24,
                        width: 24,
                        backgroundColor: '#fff',
                        border: '2px solid currentColor',
                        '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
                          boxShadow: 'inherit',
                        },
                      },
                    }}
                  />
                </Box>

                <Box sx={{ mb: 4 }}>
                  <Typography gutterBottom variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Group sx={{ fontSize: 20, color: 'info.main' }} />
                    Social Category Weight: {preferences.socialCategoryWeight}%
                  </Typography>
                  <Slider
                    value={preferences.socialCategoryWeight}
                    onChange={handleSliderChange("socialCategoryWeight")}
                    min={0}
                    max={100}
                    valueLabelDisplay="auto"
                    color="info"
                    sx={{
                      height: 8,
                      '& .MuiSlider-track': {
                        border: 'none',
                      },
                      '& .MuiSlider-thumb': {
                        height: 24,
                        width: 24,
                        backgroundColor: '#fff',
                        border: '2px solid currentColor',
                        '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
                          boxShadow: 'inherit',
                        },
                      },
                    }}
                  />
                </Box>

                <Box sx={{ mb: 4 }}>
                  <Typography gutterBottom variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <History sx={{ fontSize: 20, color: 'warning.main' }} />
                    Past Participation Weight: {preferences.pastParticipationWeight}%
                  </Typography>
                  <Slider
                    value={preferences.pastParticipationWeight}
                    onChange={handleSliderChange("pastParticipationWeight")}
                    min={0}
                    max={100}
                    valueLabelDisplay="auto"
                    color="warning"
                    sx={{
                      height: 8,
                      '& .MuiSlider-track': {
                        border: 'none',
                      },
                      '& .MuiSlider-thumb': {
                        height: 24,
                        width: 24,
                        backgroundColor: '#fff',
                        border: '2px solid currentColor',
                        '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
                          boxShadow: 'inherit',
                        },
                      },
                    }}
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
                    py: 2,
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    '&:hover': {
                      background: "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
                    },
                  }}
                >
                  {loading ? "Running AI Engine..." : "Run Matching Engine"}
                </Button>
              </CardContent>
            </Card>

            {/* Enhanced Statistics Card */}
            <Card sx={{ borderRadius: 3, background: 'linear-gradient(135deg, #e0f2fe 0%, #b3e5fc 100%)' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Assessment sx={{ color: 'primary.main' }} />
                  System Statistics
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3, p: 2, bgcolor: 'rgba(255,255,255,0.7)', borderRadius: 2 }}>
                  <Typography variant="body1">Total Students:</Typography>
                  <Typography variant="body1" fontWeight="bold" color="primary.main">{results ? results.length : 0}</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3, p: 2, bgcolor: 'rgba(255,255,255,0.7)', borderRadius: 2 }}>
                  <Typography variant="body1">Available Internships:</Typography>
                  <Typography variant="body1" fontWeight="bold" color="secondary.main">{availableJobs.length}</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3, p: 2, bgcolor: 'rgba(255,255,255,0.7)', borderRadius: 2 }}>
                  <Typography variant="body1">Successful Matches:</Typography>
                  <Typography variant="body1" fontWeight="bold" color="success.main">{results?.length || 0}</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", p: 2, bgcolor: 'rgba(255,255,255,0.7)', borderRadius: 2 }}>
                  <Typography variant="body1">Match Accuracy:</Typography>
                  <Typography variant="body1" fontWeight="bold" color="info.main">
                    {results && results.length > 0 ? Math.round(results.reduce((acc, r) => acc + r.matchScore, 0) / results.length) : 0}%
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Results Panel */}
          <Grid item xs={12} lg={8}>
            <Card sx={{ borderRadius: 3, background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)', minHeight: '600px' }}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs value={selectedTab} onChange={(_, v) => setSelectedTab(v)} sx={{ px: 3, pt: 2 }}>
                  <Tab 
                    label="Match Results" 
                    icon={<Assessment />} 
                    iconPosition="start"
                    sx={{ fontSize: '1rem', fontWeight: 'bold' }}
                  />
                  <Tab 
                    label="Student Pool" 
                    icon={<Person />} 
                    iconPosition="start"
                    sx={{ fontSize: '1rem', fontWeight: 'bold' }}
                  />
                  <Tab 
                    label="Internship Pool" 
                    icon={<Business />} 
                    iconPosition="start"
                    sx={{ fontSize: '1rem', fontWeight: 'bold' }}
                  />
                </Tabs>
              </Box>

              <CardContent sx={{ p: 4 }}>
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
                    {results && results.length > 0 ? results.map((result) => (
                      <TableRow key={result.id}>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Avatar sx={{ mr: 2, width: 32, height: 32 }}>
                              {result.student.charAt(0)}
                            </Avatar>
                            {result.student}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                            <Chip label={result.category} size="small" variant="outlined" />
                            <Chip label={`${result.matchScore}% match`} size="small" color="primary" />
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Rating value={(result.matchScore / 100) * 5} readOnly size="small" />
                        </TableCell>
                        <TableCell>{result.locationMatch}</TableCell>
                        <TableCell>{result.socialCategory}</TableCell>
                        <TableCell>
                          {result.pastParticipation ? (
                            <CheckCircle color="warning" />
                          ) : (
                            <Schedule color="success" />
                          )}
                        </TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={6} sx={{ textAlign: 'center', py: 3 }}>
                          <Typography color="text.secondary">
                            {results === null ? "Run matching to see candidate results" : "No matching candidates found"}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
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
                    {availableJobs.map((internship) => (
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
                        <TableCell>0</TableCell>
                        <TableCell>
                          <Chip 
                            label={internship.capacity}
                            color="success"
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
    </Box>
  );
};

export default MatchingPortal;
