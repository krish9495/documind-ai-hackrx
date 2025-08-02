import React from "react";
import { Box, Typography, Button } from "@mui/material";

const SimpleApp: React.FC = () => {
  const [message, setMessage] = React.useState("Frontend is working!");

  const testAPI = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/health", {
        headers: {
          Authorization:
            "Bearer 03e834fbe3091bbd057af6a74fc056c509bf3a5a5a730b9e628d357d675b22a5",
        },
      });
      const data = await response.json();
      setMessage(`✅ API Connected! Status: ${data.status}`);
    } catch (error) {
      setMessage(`❌ API Error: ${error}`);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        p: 3,
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <Typography
        variant="h2"
        gutterBottom
        sx={{ color: "white", textAlign: "center" }}
      >
        🤖 Query-Retrieval System
      </Typography>

      <Typography
        variant="h6"
        sx={{ color: "white", mb: 3, textAlign: "center" }}
      >
        {message}
      </Typography>

      <Button
        variant="contained"
        onClick={testAPI}
        sx={{
          px: 4,
          py: 1.5,
          fontSize: "1.1rem",
          background: "rgba(255,255,255,0.2)",
          backdropFilter: "blur(10px)",
          "&:hover": {
            background: "rgba(255,255,255,0.3)",
          },
        }}
      >
        Test API Connection
      </Button>

      <Box sx={{ mt: 4, color: "white", textAlign: "center" }}>
        <Typography variant="body2">
          • Backend: http://localhost:8000
        </Typography>
        <Typography variant="body2">
          • Frontend: http://localhost:5173 (Vite) or http://localhost:3000 (if
          using different setup)
        </Typography>
      </Box>
    </Box>
  );
};

export default SimpleApp;
