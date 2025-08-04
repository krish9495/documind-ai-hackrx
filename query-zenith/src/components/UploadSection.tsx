import { useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  FileText,
  File,
  Mail,
  CheckCircle,
  AlertCircle,
  X,
  Cloud,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { apiService, UploadResponse } from "@/lib/api";
import { toast } from "sonner";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: "uploading" | "processing" | "completed" | "error";
  progress: number;
  filePath?: string;
  uploadResponse?: UploadResponse;
}

export const UploadSection = () => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  }, []);

  const handleFiles = (fileList: FileList) => {
    Array.from(fileList).forEach((file) => {
      // Check file type
      const allowedTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/msword",
        "text/plain",
        "message/rfc822",
      ];

      if (
        !allowedTypes.some(
          (type) =>
            file.type === type ||
            file.name.toLowerCase().endsWith(".pdf") ||
            file.name.toLowerCase().endsWith(".docx") ||
            file.name.toLowerCase().endsWith(".doc")
        )
      ) {
        toast.error(
          `Unsupported file type: ${file.name}. Please upload PDF, DOCX, or email files.`
        );
        return;
      }

      const newFile: UploadedFile = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        status: "uploading",
        progress: 0,
      };

      setFiles((prev) => [...prev, newFile]);

      // Upload to backend
      uploadFile(file, newFile.id);
    });
  };

  const uploadFile = async (file: File, fileId: string) => {
    try {
      // Start upload
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId ? { ...f, status: "uploading", progress: 10 } : f
        )
      );

      // Simulate progress during upload - faster and more responsive
      const progressInterval = setInterval(() => {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileId && f.progress < 85
              ? {
                  ...f,
                  progress: Math.min(f.progress + Math.random() * 8 + 3, 85),
                }
              : f
          )
        );
      }, 200);

      // Reduce timeout to 15 seconds for better UX
      const timeoutId = setTimeout(() => {
        clearInterval(progressInterval);
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileId ? { ...f, status: "error", progress: 0 } : f
          )
        );
        toast.error(
          `Upload timeout for ${file.name}. Please check your connection and try again.`
        );
      }, 15000);

      // Upload to backend
      const response = await apiService.uploadDocument(file);

      clearInterval(progressInterval);
      clearTimeout(timeoutId);

      // Mark as completed
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId
            ? {
                ...f,
                status: "completed",
                progress: 100,
                filePath: response.file_path,
                uploadResponse: response,
              }
            : f
        )
      );

      toast.success(`Successfully uploaded ${file.name}`);
    } catch (error) {
      // Clear any running intervals/timeouts
      clearInterval(progressInterval);
      clearTimeout(timeoutId);

      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId ? { ...f, status: "error", progress: 0 } : f
        )
      );

      const errorMessage =
        error instanceof Error ? error.message : "Upload failed";
      toast.error(`Failed to upload ${file.name}: ${errorMessage}`);
      console.error("Upload error:", error);
    }
  };

  const removeFile = (fileId: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== fileId));
  };

  const getFileIcon = (type: string) => {
    if (type.includes("pdf")) return FileText;
    if (type.includes("word") || type.includes("document")) return File;
    if (type.includes("email")) return Mail;
    return File;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-8">
      {/* Upload Area */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="h-5 w-5 text-primary" />
            Document Upload
          </CardTitle>
          <CardDescription>
            Upload PDF, DOCX, or email files to your knowledge base
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={cn(
              "relative border-2 border-dashed rounded-xl p-8 transition-all duration-300",
              dragActive
                ? "border-primary bg-primary/10 scale-105"
                : "border-border hover:border-primary/50 hover:bg-muted/30"
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="file-upload"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleChange}
              multiple
              accept=".pdf,.docx,.doc,.eml,.msg"
            />

            <div className="text-center">
              <div className="mx-auto mb-4 p-3 bg-primary/20 rounded-full w-fit animate-pulse-glow">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Drop your documents here
              </h3>
              <p className="text-muted-foreground mb-4">
                or{" "}
                <span className="text-primary font-medium cursor-pointer hover:underline">
                  browse files
                </span>
              </p>
              <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
                <Badge variant="outline">PDF</Badge>
                <Badge variant="outline">DOCX</Badge>
                <Badge variant="outline">Email</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* File List */}
      {files.length > 0 && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Processing Files</CardTitle>
            <CardDescription>
              {files.filter((f) => f.status === "completed").length} of{" "}
              {files.length} files processed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {files.map((file) => {
                const FileIcon = getFileIcon(file.type);

                return (
                  <div
                    key={file.id}
                    className="flex items-center space-x-4 p-4 rounded-lg bg-muted/30 border border-border"
                  >
                    <div className="flex-shrink-0">
                      <div className="p-2 rounded-lg bg-primary/20">
                        <FileIcon className="h-5 w-5 text-primary" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)}
                      </p>

                      {file.status === "uploading" && (
                        <div className="mt-2">
                          <Progress value={file.progress} className="h-1" />
                          <p className="text-xs text-muted-foreground mt-1">
                            Uploading... {Math.round(file.progress)}%
                          </p>
                        </div>
                      )}

                      {file.status === "processing" && (
                        <div className="mt-2">
                          <div className="flex items-center gap-2">
                            <div className="w-1 h-1 bg-primary rounded-full animate-pulse"></div>
                            <p className="text-xs text-muted-foreground">
                              Processing document...
                            </p>
                          </div>
                        </div>
                      )}

                      {file.status === "completed" && file.uploadResponse && (
                        <div className="mt-2">
                          <p className="text-xs text-green-600">
                            ✓ Successfully processed -{" "}
                            {file.uploadResponse.message}
                          </p>
                        </div>
                      )}

                      {file.status === "error" && (
                        <div className="mt-2">
                          <p className="text-xs text-destructive">
                            ✗ Upload failed - Please try again
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      {file.status === "completed" && (
                        <CheckCircle className="h-5 w-5 text-accent" />
                      )}
                      {file.status === "error" && (
                        <AlertCircle className="h-5 w-5 text-destructive" />
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(file.id)}
                        className="h-8 w-8 p-0 hover:bg-destructive/20"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 rounded-lg bg-accent/20">
                <FileText className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Documents</p>
                <p className="text-2xl font-bold">
                  {files.filter((f) => f.status === "completed").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 rounded-lg bg-primary/20">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Processing</p>
                <p className="text-2xl font-bold">
                  {
                    files.filter(
                      (f) =>
                        f.status === "uploading" || f.status === "processing"
                    ).length
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 rounded-lg bg-accent/20">
                <CheckCircle className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold">
                  {files.length > 0
                    ? Math.round(
                        (files.filter((f) => f.status === "completed").length /
                          files.length) *
                          100
                      )
                    : 0}
                  %
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
