import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import QueryInterface from "./components/QueryInterface";
import ResultsDisplay from "./components/ResultsDisplay";
import SystemMetrics from "./components/SystemMetrics";
import DocumentUpload from "./components/DocumentUpload";
import ApiTest from "./components/ApiTest";
import { QueryRequest, QueryResponse, SystemHealth } from "./types";
import { apiService } from "./services/apiService";

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<QueryResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    checkSystemHealth();
    const interval = setInterval(checkSystemHealth, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const checkSystemHealth = async () => {
    try {
      const health = await apiService.getSystemHealth();
      setSystemHealth(health);
    } catch (err) {
      console.error("Failed to check system health:", err);
    }
  };

  const handleQuerySubmit = async (queryRequest: QueryRequest) => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await apiService.processQuery(queryRequest);
      setResults(response);
      setSuccessMessage(
        `Successfully processed ${queryRequest.questions.length} questions!`
      );
    } catch (err: any) {
      setError(err.message || "An error occurred while processing your query");
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentUpload = async (file: File) => {
    try {
      const response = await apiService.uploadDocument(file);
      setSuccessMessage(`Document "${file.name}" uploaded successfully!`);
      return response.file_path;
    } catch (err: any) {
      setError(err.message || "Failed to upload document");
      throw err;
    }
  };

  const handleCloseSnackbar = () => {
    setError(null);
    setSuccessMessage(null);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box textAlign="center" mb={4}>
        <Typography variant="h1" component="h1" gutterBottom>
          🤖 Intelligent Query-Retrieval System
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Advanced LLM-powered document analysis for insurance, legal, HR, and
          compliance domains
        </Typography>

        {systemHealth && (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            gap={2}
            mt={2}
          >
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor:
                  systemHealth.status === "healthy" ? "#4caf50" : "#f44336",
              }}
            />
            <Typography variant="body2" color="text.secondary">
              System {systemHealth.status} • {systemHealth.active_sessions}{" "}
              active sessions
            </Typography>
          </Box>
        )}
      </Box>

      {/* API Test Component */}
      <ApiTest />

      <Grid container spacing={4}>
        {/* Left Column - Input */}
        <Grid item xs={12} lg={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                📄 Document Upload
              </Typography>
              <DocumentUpload onUpload={handleDocumentUpload} />
            </CardContent>
          </Card>

          <Card elevation={3} sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                ❓ Query Interface
              </Typography>
              <QueryInterface onSubmit={handleQuerySubmit} loading={loading} />
            </CardContent>
          </Card>

          {systemHealth && (
            <Card elevation={3} sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  📊 System Metrics
                </Typography>
                <SystemMetrics health={systemHealth} />
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* Right Column - Results */}
        <Grid item xs={12} lg={6}>
          <Card elevation={3} sx={{ minHeight: "600px" }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                📋 Results
              </Typography>

              {loading && (
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  py={8}
                >
                  <CircularProgress size={60} />
                  <Typography variant="h6" sx={{ ml: 2 }}>
                    Processing your query...
                  </Typography>
                </Box>
              )}

              {!loading && !results && (
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  py={8}
                  flexDirection="column"
                >
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Ready to process your documents
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Upload documents and submit questions to get started
                  </Typography>
                </Box>
              )}

              {results && <ResultsDisplay results={results} />}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Snackbars for notifications */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default App;
