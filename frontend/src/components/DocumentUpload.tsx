import React, { useState, useCallback } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  LinearProgress,
  Alert,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
} from "@mui/material";
import {
  CloudUpload,
  Description,
  PictureAsPdf,
  Email,
  Delete,
} from "@mui/icons-material";
import { DocumentUploadProps } from "../types";

const DocumentUpload: React.FC<DocumentUploadProps> = ({ onUpload }) => {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    await handleFiles(files);
  }, []);

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const files = Array.from(e.target.files);
        await handleFiles(files);
      }
    },
    []
  );

  const handleFiles = async (files: File[]) => {
    setError(null);
    setUploading(true);

    try {
      for (const file of files) {
        // Validate file type
        const allowedTypes = [
          "application/pdf",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "application/msword",
          "message/rfc822",
          "text/plain",
        ];

        if (!allowedTypes.includes(file.type) && !file.name.endsWith(".eml")) {
          throw new Error(
            `Unsupported file type: ${file.type}. Please upload PDF, DOCX, or EML files.`
          );
        }

        // Validate file size (50MB limit)
        if (file.size > 50 * 1024 * 1024) {
          throw new Error(
            `File too large: ${file.name}. Maximum size is 50MB.`
          );
        }

        const filePath = await onUpload(file);
        setUploadedFiles((prev) => [...prev, filePath]);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith(".pdf")) return <PictureAsPdf color="error" />;
    if (fileName.endsWith(".docx") || fileName.endsWith(".doc"))
      return <Description color="primary" />;
    if (fileName.endsWith(".eml")) return <Email color="info" />;
    return <Description />;
  };

  const handleRemoveFile = (filePath: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f !== filePath));
  };

  return (
    <Box>
      <Paper
        variant="outlined"
        sx={{
          p: 3,
          textAlign: "center",
          backgroundColor: dragOver ? "action.hover" : "background.paper",
          border: dragOver ? "2px dashed" : "1px solid",
          borderColor: dragOver ? "primary.main" : "divider",
          cursor: "pointer",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            backgroundColor: "action.hover",
          },
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById("file-input")?.click()}
      >
        <input
          id="file-input"
          type="file"
          multiple
          accept=".pdf,.docx,.doc,.eml"
          style={{ display: "none" }}
          onChange={handleFileSelect}
        />

        <CloudUpload sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />

        <Typography variant="h6" gutterBottom>
          Upload Documents
        </Typography>

        <Typography variant="body2" color="text.secondary" paragraph>
          Drag and drop files here, or click to select
        </Typography>

        <Box display="flex" justifyContent="center" gap={1} flexWrap="wrap">
          <Chip label="PDF" size="small" />
          <Chip label="DOCX" size="small" />
          <Chip label="EML" size="small" />
        </Box>

        <Typography
          variant="caption"
          display="block"
          sx={{ mt: 1 }}
          color="text.secondary"
        >
          Maximum file size: 50MB
        </Typography>
      </Paper>

      {uploading && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" gutterBottom>
            Uploading files...
          </Typography>
          <LinearProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {uploadedFiles.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Uploaded Files ({uploadedFiles.length}):
          </Typography>
          <List dense>
            {uploadedFiles.map((filePath, index) => (
              <ListItem
                key={index}
                sx={{
                  backgroundColor: "background.paper",
                  borderRadius: 1,
                  mb: 1,
                  border: "1px solid",
                  borderColor: "divider",
                }}
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleRemoveFile(filePath)}
                    size="small"
                  >
                    <Delete />
                  </IconButton>
                }
              >
                <ListItemIcon>{getFileIcon(filePath)}</ListItemIcon>
                <ListItemText
                  primary={filePath.split("/").pop() || filePath}
                  secondary={`Path: ${filePath}`}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
};

export default DocumentUpload;
