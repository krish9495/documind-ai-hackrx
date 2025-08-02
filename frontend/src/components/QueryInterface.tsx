import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Chip,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
} from "@mui/material";
import { Add, Delete, Send, ExpandMore, Settings } from "@mui/icons-material";
import { QueryInterfaceProps, QueryRequest } from "../types";

const QueryInterface: React.FC<QueryInterfaceProps> = ({
  onSubmit,
  loading,
}) => {
  const [documentPath, setDocumentPath] = useState("");
  const [questions, setQuestions] = useState<string[]>([""]);
  const [domain, setDomain] = useState("");
  const [chunkSize, setChunkSize] = useState(1000);
  const [chunkOverlap, setChunkOverlap] = useState(200);
  const [useMetadata, setUseMetadata] = useState(true);
  const [enableCitations, setEnableCitations] = useState(true);

  const domains = [
    "insurance",
    "legal",
    "hr",
    "compliance",
    "finance",
    "healthcare",
    "general",
  ];

  const addQuestion = () => {
    setQuestions([...questions, ""]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const updateQuestion = (index: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index] = value;
    setQuestions(newQuestions);
  };

  const handleSubmit = () => {
    const validQuestions = questions.filter((q) => q.trim());

    if (!documentPath.trim()) {
      alert("Please specify a document path");
      return;
    }

    if (validQuestions.length === 0) {
      alert("Please add at least one question");
      return;
    }

    const queryRequest: QueryRequest = {
      document_path: documentPath.trim(),
      questions: validQuestions,
      domain: domain || undefined,
      processing_options: {
        chunk_size: chunkSize,
        chunk_overlap: chunkOverlap,
        use_metadata: useMetadata,
        enable_citations: enableCitations,
      },
    };

    onSubmit(queryRequest);
  };

  const loadSampleQuestions = (sampleDomain: string) => {
    const samples: Record<string, string[]> = {
      insurance: [
        "What are the key coverage details for this policy?",
        "What are the exclusions and limitations?",
        "What is the claims process and required documentation?",
        "What are the premium amounts and payment terms?",
      ],
      legal: [
        "What are the main contractual obligations for each party?",
        "What are the termination conditions and notice requirements?",
        "What dispute resolution mechanisms are specified?",
        "What are the liability and indemnification clauses?",
      ],
      hr: [
        "What are the employee benefits and compensation details?",
        "What are the performance evaluation criteria?",
        "What are the disciplinary procedures and policies?",
        "What are the leave and vacation policies?",
      ],
      compliance: [
        "What regulatory requirements must be met?",
        "What are the audit and reporting obligations?",
        "What penalties or sanctions are mentioned?",
        "What compliance deadlines are specified?",
      ],
    };

    if (samples[sampleDomain]) {
      setQuestions(samples[sampleDomain]);
      setDomain(sampleDomain);
    }
  };

  return (
    <Box>
      {/* Document Path */}
      <TextField
        fullWidth
        label="Document Path"
        value={documentPath}
        onChange={(e) => setDocumentPath(e.target.value)}
        placeholder="Enter the path to your uploaded document"
        sx={{ mb: 3 }}
        disabled={loading}
      />

      {/* Domain Selection */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Domain (Optional)</InputLabel>
        <Select
          value={domain}
          label="Domain (Optional)"
          onChange={(e) => setDomain(e.target.value)}
          disabled={loading}
        >
          <MenuItem value="">
            <em>Auto-detect</em>
          </MenuItem>
          {domains.map((d) => (
            <MenuItem key={d} value={d}>
              {d.charAt(0).toUpperCase() + d.slice(1)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Sample Questions */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Quick Start Templates:
        </Typography>
        <Box display="flex" gap={1} flexWrap="wrap">
          {Object.keys(domains.slice(0, 4)).map((sampleDomain) => (
            <Chip
              key={sampleDomain}
              label={
                sampleDomain.charAt(0).toUpperCase() + sampleDomain.slice(1)
              }
              onClick={() => loadSampleQuestions(sampleDomain)}
              variant="outlined"
              size="small"
              disabled={loading}
            />
          ))}
        </Box>
      </Box>

      {/* Questions */}
      <Typography variant="h6" gutterBottom>
        Questions ({questions.filter((q) => q.trim()).length})
      </Typography>

      {questions.map((question, index) => (
        <Box key={index} display="flex" gap={1} sx={{ mb: 2 }}>
          <TextField
            fullWidth
            multiline
            rows={2}
            label={`Question ${index + 1}`}
            value={question}
            onChange={(e) => updateQuestion(index, e.target.value)}
            placeholder="Enter your question about the document..."
            disabled={loading}
          />
          <IconButton
            onClick={() => removeQuestion(index)}
            disabled={questions.length <= 1 || loading}
            color="error"
          >
            <Delete />
          </IconButton>
        </Box>
      ))}

      <Button
        startIcon={<Add />}
        onClick={addQuestion}
        variant="outlined"
        sx={{ mb: 3 }}
        disabled={loading || questions.length >= 10}
      >
        Add Question
      </Button>

      {/* Advanced Settings */}
      <Accordion sx={{ mb: 3 }}>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="advanced-settings-content"
          id="advanced-settings-header"
        >
          <Settings sx={{ mr: 1 }} />
          <Typography>Advanced Processing Options</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Chunk Size"
              type="number"
              value={chunkSize}
              onChange={(e) => setChunkSize(Number(e.target.value))}
              inputProps={{ min: 100, max: 2000 }}
              helperText="Size of text chunks for processing (100-2000)"
              disabled={loading}
            />

            <TextField
              label="Chunk Overlap"
              type="number"
              value={chunkOverlap}
              onChange={(e) => setChunkOverlap(Number(e.target.value))}
              inputProps={{ min: 0, max: 500 }}
              helperText="Overlap between chunks (0-500)"
              disabled={loading}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={useMetadata}
                  onChange={(e) => setUseMetadata(e.target.checked)}
                  disabled={loading}
                />
              }
              label="Use Document Metadata"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={enableCitations}
                  onChange={(e) => setEnableCitations(e.target.checked)}
                  disabled={loading}
                />
              }
              label="Enable Citations"
            />
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Validation Alert */}
      {(!documentPath.trim() ||
        questions.filter((q) => q.trim()).length === 0) && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Please specify a document path and add at least one question to
          proceed.
        </Alert>
      )}

      {/* Submit Button */}
      <Button
        fullWidth
        variant="contained"
        size="large"
        startIcon={<Send />}
        onClick={handleSubmit}
        disabled={
          loading ||
          !documentPath.trim() ||
          questions.filter((q) => q.trim()).length === 0
        }
        sx={{ py: 1.5 }}
      >
        {loading ? "Processing..." : "Submit Query"}
      </Button>
    </Box>
  );
};

export default QueryInterface;
