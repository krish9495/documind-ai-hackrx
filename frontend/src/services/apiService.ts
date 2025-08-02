// API Service for communicating with the backend

import {
  QueryRequest,
  QueryResponse,
  DocumentUploadResponse,
  SystemHealth,
  SessionInfo,
  ErrorResponse,
} from "../types";

class ApiService {
  private baseUrl: string;
  private sessionId: string | null = null;
  private authToken: string =
    "03e834fbe3091bbd057af6a74fc056c509bf3a5a5a730b9e628d357d675b22a5";

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
  }

  // Set session ID for authenticated requests
  setSessionId(sessionId: string) {
    this.sessionId = sessionId;
  }

  // Generic API request method
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.authToken}`,
      ...options.headers,
    };

    if (this.sessionId) {
      headers["X-Session-ID"] = this.sessionId;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      try {
        const errorData: ErrorResponse = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        // Use default error message if JSON parsing fails
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }

  // Upload document
  async uploadDocument(file: File): Promise<DocumentUploadResponse> {
    const formData = new FormData();
    formData.append("file", file);

    const headers: HeadersInit = {
      Authorization: `Bearer ${this.authToken}`,
    };

    if (this.sessionId) {
      headers["X-Session-ID"] = this.sessionId;
    }

    const response = await fetch(`${this.baseUrl}/api/v1/upload`, {
      method: "POST",
      body: formData,
      headers,
    });

    if (!response.ok) {
      let errorMessage = `Upload failed: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        // Use default error message
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }

  // Process query using the main hackathon endpoint
  async processQuery(queryRequest: QueryRequest): Promise<QueryResponse> {
    // Transform frontend QueryRequest to backend EnhancedQueryRequest format
    const enhancedRequest = {
      documents: [queryRequest.document_path], // Convert single path to array
      questions: queryRequest.questions,
      document_format: "auto", // Auto-detect format
      processing_options: {
        chunk_size: queryRequest.processing_options?.chunk_size || 1000,
        chunk_overlap: queryRequest.processing_options?.chunk_overlap || 200,
        top_k_retrieval: 7,
        include_metadata: queryRequest.processing_options?.use_metadata || true,
        optimize_for_speed: false,
        enable_caching: true,
      },
      session_id: this.sessionId,
    };

    return this.request<QueryResponse>("/api/v1/hackrx/run", {
      method: "POST",
      body: JSON.stringify(enhancedRequest),
    });
  }

  // Get system health
  async getSystemHealth(): Promise<SystemHealth> {
    return this.request<SystemHealth>("/api/v1/health");
  }

  // Get session info
  async getSessionInfo(): Promise<SessionInfo> {
    return this.request<SessionInfo>("/api/v1/session/info");
  }

  // Create new session
  async createSession(): Promise<{ session_id: string }> {
    const response = await this.request<{ session_id: string }>(
      "/api/v1/session/create",
      {
        method: "POST",
      }
    );
    this.setSessionId(response.session_id);
    return response;
  }

  // Clear session
  async clearSession(): Promise<{ message: string }> {
    return this.request<{ message: string }>("/api/v1/session/clear", {
      method: "POST",
    });
  }

  // Get available documents
  async getDocuments(): Promise<string[]> {
    return this.request<string[]>("/api/v1/documents");
  }

  // Delete document
  async deleteDocument(documentPath: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(
      `/api/v1/documents/${encodeURIComponent(documentPath)}`,
      {
        method: "DELETE",
      }
    );
  }

  // Get performance metrics
  async getMetrics(): Promise<any> {
    return this.request<any>("/api/v1/metrics");
  }

  // Test connection
  async testConnection(): Promise<{ status: string }> {
    return this.request<{ status: string }>("/api/v1/test");
  }
}

export const apiService = new ApiService();

// Initialize session on app start
export const initializeSession = async (): Promise<string> => {
  try {
    const response = await apiService.createSession();
    return response.session_id;
  } catch (error) {
    console.error("Failed to initialize session:", error);
    throw error;
  }
};
