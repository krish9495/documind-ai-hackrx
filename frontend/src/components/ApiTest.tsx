// Simple test component to debug API connection
import React, { useState } from "react";

const ApiTest: React.FC = () => {
  const [testResult, setTestResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setTestResult("Testing...");

    try {
      // Test 1: Basic health check (no auth required)
      const healthResponse = await fetch("http://localhost:8000/api/v1/health");
      if (!healthResponse.ok) {
        throw new Error(`Health check failed: ${healthResponse.status}`);
      }
      const healthData = await healthResponse.json();

      // Test 2: Authenticated endpoint
      const authResponse = await fetch(
        "http://localhost:8000/api/v1/sessions",
        {
          headers: {
            Authorization:
              "Bearer 03e834fbe3091bbd057af6a74fc056c509bf3a5a5a730b9e628d357d675b22a5",
            "Content-Type": "application/json",
          },
        }
      );

      if (!authResponse.ok) {
        throw new Error(`Auth test failed: ${authResponse.status}`);
      }
      const authData = await authResponse.json();

      setTestResult(`✅ Connection successful!
Health: ${healthData.status}
Sessions: ${authData.active_sessions}
Backend URL: http://localhost:8000`);
    } catch (error: any) {
      setTestResult(`❌ Connection failed: ${error.message}
      
Please check:
1. Backend server is running on http://localhost:8000
2. No firewall blocking the connection
3. CORS is properly configured

Try running: python api_server.py`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        border: "1px solid #ccc",
        margin: "20px",
        borderRadius: "8px",
      }}
    >
      <h3>🔧 API Connection Test</h3>
      <button
        onClick={testConnection}
        disabled={loading}
        style={{
          padding: "10px 20px",
          backgroundColor: loading ? "#ccc" : "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Testing..." : "Test API Connection"}
      </button>

      {testResult && (
        <pre
          style={{
            marginTop: "10px",
            padding: "10px",
            backgroundColor: "#f8f9fa",
            border: "1px solid #ddd",
            borderRadius: "4px",
            whiteSpace: "pre-wrap",
            fontSize: "12px",
          }}
        >
          {testResult}
        </pre>
      )}
    </div>
  );
};

export default ApiTest;
