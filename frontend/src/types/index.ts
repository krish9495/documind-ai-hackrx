// Types for the Query-Retrieval System

export interface QueryRequest {
  document_path: string;
  questions: string[];
  domain?: string;
  processing_options?: {
    chunk_size?: number;
    chunk_overlap?: number;
    use_metadata?: boolean;
    enable_citations?: boolean;
  };
}

export interface Citation {
  page: number;
  chunk_index: number;
  text: string;
  confidence_score: number;
}

export interface QueryResult {
  question: string;
  answer: string;
  confidence_score: number;
  processing_time: number;
  citations: Citation[];
  explanation: string;
}

export interface DetailedAnswer {
  question: string;
  answer: string;
  confidence_score: number;
  query_type: string;
  source_citations: string[];
  processing_time: number;
  context_chunks_used: number;
  metadata: Record<string, any>;
}

export interface QueryResponse {
  session_id: string;
  answers: DetailedAnswer[];
  total_processing_time: number;
  total_token_usage: Record<string, number>;
  document_statistics: Record<string, any>;
  performance_metrics: Record<string, number>;
  status: string;
  timestamp: string;
}

export interface DocumentUploadResponse {
  file_path: string;
  file_size: number;
  document_type: string;
  processed_at: string;
  pages_count?: number;
  chunks_count?: number;
}

export interface SystemHealth {
  status: string;
  uptime: number;
  memory_usage: {
    rss: number;
    vms: number;
    cpu_percent: number;
  };
  active_sessions: number;
  total_requests: number;
  average_response_time: number;
}

export interface SessionInfo {
  session_id: string;
  created_at: string;
  documents_processed: number;
  queries_processed: number;
  last_activity: string;
}

export interface ErrorResponse {
  error: string;
  message: string;
  timestamp: string;
  session_id?: string;
}

// Component Props Types
export interface DocumentUploadProps {
  onUpload: (file: File) => Promise<string>;
}

export interface QueryInterfaceProps {
  onSubmit: (query: QueryRequest) => void;
  loading: boolean;
}

export interface ResultsDisplayProps {
  results: QueryResponse;
}

export interface SystemMetricsProps {
  health: SystemHealth;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  timestamp: string;
}

// Chart Data Types
export interface MetricDataPoint {
  timestamp: string;
  value: number;
  label: string;
}

export interface PerformanceMetrics {
  accuracy_scores: MetricDataPoint[];
  response_times: MetricDataPoint[];
  token_usage: MetricDataPoint[];
  query_volume: MetricDataPoint[];
}
