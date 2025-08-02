import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Rating,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  Alert,
  IconButton,
  Tooltip,
  Button,
} from "@mui/material";
import {
  ExpandMore,
  ContentCopy,
  Timer,
  Speed,
  Psychology,
  Assessment,
} from "@mui/icons-material";
import { ResultsDisplayProps } from "../types";

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  const formatTime = (milliseconds: number): string => {
    if (milliseconds < 1000) return `${milliseconds}ms`;
    const seconds = (milliseconds / 1000).toFixed(1);
    return `${seconds}s`;
  };

  const getConfidenceColor = (confidence: number): string => {
    if (confidence >= 0.8) return "success";
    if (confidence >= 0.6) return "warning";
    return "error";
  };

  if (!results) {
    return (
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            No Results
          </Typography>
          <Typography color="text.secondary">
            Submit a query to see results here.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box>
      {/* Summary Card */}
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            📊 Query Summary
          </Typography>

          <Box display="flex" gap={2} flexWrap="wrap" sx={{ mb: 2 }}>
            <Chip
              icon={<Psychology />}
              label={`${results.answers.length} Questions Processed`}
              color="primary"
            />
            <Chip
              icon={<Timer />}
              label={`${formatTime(results.total_processing_time)}`}
              color="secondary"
            />
            <Chip
              icon={<Assessment />}
              label={`Session: ${results.session_id.slice(0, 8)}...`}
              variant="outlined"
            />
            <Chip
              label={results.status}
              color={results.status === "success" ? "success" : "error"}
            />
          </Box>

          {/* Performance Metrics */}
          <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
            Performance Metrics:
          </Typography>
          <Box display="flex" gap={3} flexWrap="wrap">
            <Typography variant="body2">
              <strong>Processing Time:</strong>{" "}
              {formatTime(results.total_processing_time)}
            </Typography>
            <Typography variant="body2">
              <strong>Total Tokens:</strong>{" "}
              {Object.values(results.total_token_usage).reduce(
                (a, b) => a + b,
                0
              )}
            </Typography>
            <Typography variant="body2">
              <strong>Documents:</strong>{" "}
              {results.document_statistics.document_count || 1}
            </Typography>
          </Box>

          {/* Document Statistics */}
          {results.document_statistics && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Document Statistics:
              </Typography>
              <Typography variant="body2">
                Average Confidence:{" "}
                {(results.document_statistics.average_confidence * 100).toFixed(
                  1
                )}
                %
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Detailed Results */}
      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
        🔍 Detailed Results ({results.answers.length})
      </Typography>

      {results.answers.map((answer, index) => (
        <Accordion key={index} sx={{ mb: 2 }}>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls={`result-${index}-content`}
            id={`result-${index}-header`}
          >
            <Box display="flex" alignItems="center" gap={2} width="100%">
              <Typography variant="h6" sx={{ flex: 1 }}>
                Q{index + 1}: {answer.question.slice(0, 80)}
                {answer.question.length > 80 && "..."}
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <Rating
                  value={answer.confidence_score}
                  max={1}
                  precision={0.1}
                  size="small"
                  readOnly
                />
                <Chip
                  icon={<Timer />}
                  label={formatTime(answer.processing_time)}
                  size="small"
                  variant="outlined"
                />
              </Box>
            </Box>
          </AccordionSummary>

          <AccordionDetails>
            <Box>
              {/* Question */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  📝 Question:
                </Typography>
                <Card
                  variant="outlined"
                  sx={{ p: 2, bgcolor: "background.paper" }}
                >
                  <Typography>{answer.question}</Typography>
                </Card>
              </Box>

              {/* Answer */}
              <Box sx={{ mb: 2 }}>
                <Box display="flex" alignItems="center" gap={1} sx={{ mb: 1 }}>
                  <Typography variant="subtitle2">💡 Answer:</Typography>
                  <Tooltip
                    title={copiedIndex === index ? "Copied!" : "Copy answer"}
                  >
                    <IconButton
                      size="small"
                      onClick={() => copyToClipboard(answer.answer, index)}
                    >
                      <ContentCopy fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Card
                  variant="outlined"
                  sx={{ p: 2, bgcolor: "background.default" }}
                >
                  <Typography>{answer.answer}</Typography>
                </Card>
              </Box>

              {/* Citations */}
              {answer.source_citations &&
                answer.source_citations.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      📚 Citations ({answer.source_citations.length}):
                    </Typography>
                    <Box sx={{ pl: 2 }}>
                      {answer.source_citations.map((citation, citIndex) => (
                        <Typography
                          key={citIndex}
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 0.5 }}
                        >
                          • {citation}
                        </Typography>
                      ))}
                    </Box>
                  </Box>
                )}

              {/* Metadata */}
              {answer.metadata && Object.keys(answer.metadata).length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    📋 Metadata:
                  </Typography>
                  <Box sx={{ pl: 2 }}>
                    {Object.entries(answer.metadata).map(([key, value]) => (
                      <Typography
                        key={key}
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 0.5 }}
                      >
                        <strong>{key}:</strong> {String(value)}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              )}

              {/* Performance Details */}
              <Divider sx={{ my: 2 }} />
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  ⚡ Performance Details:
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell>Confidence Score</TableCell>
                        <TableCell align="right">
                          <Box display="flex" alignItems="center" gap={1}>
                            <LinearProgress
                              variant="determinate"
                              value={answer.confidence_score * 100}
                              sx={{ width: 100, height: 8 }}
                              color={
                                getConfidenceColor(
                                  answer.confidence_score
                                ) as any
                              }
                            />
                            <Typography variant="body2">
                              {(answer.confidence_score * 100).toFixed(0)}%
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Processing Time</TableCell>
                        <TableCell align="right">
                          {formatTime(answer.processing_time)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Query Type</TableCell>
                        <TableCell align="right">{answer.query_type}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Context Chunks</TableCell>
                        <TableCell align="right">
                          {answer.context_chunks_used}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Citations Count</TableCell>
                        <TableCell align="right">
                          {answer.source_citations?.length || 0}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>
      ))}

      {/* Actions */}
      <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<ContentCopy />}
          onClick={() => {
            const allResults = results.answers
              .map(
                (r, i) => `Q${i + 1}: ${r.question}\nA${i + 1}: ${r.answer}\n`
              )
              .join("\n");
            copyToClipboard(allResults, -1);
          }}
        >
          Copy All Results
        </Button>
      </Box>
    </Box>
  );
};

export default ResultsDisplay;
