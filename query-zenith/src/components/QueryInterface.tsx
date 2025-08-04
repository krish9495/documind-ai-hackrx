import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  Plus,
  Minus,
  Settings,
  Send,
  Sparkles,
  Brain,
  Target,
  Loader2,
  X,
} from "lucide-react";
import { apiService, QueryResponse } from "@/lib/api";
import { toast } from "sonner";

interface Question {
  id: string;
  text: string;
}

interface QueryResult {
  question: string;
  answer: string;
  confidence: number;
  sources: string[];
}

export const QueryInterface = () => {
  const [questions, setQuestions] = useState<Question[]>([
    { id: "1", text: "" },
  ]);
  const [domain, setDomain] = useState<string>("");
  const [chunkSize, setChunkSize] = useState("1000");
  const [overlap, setOverlap] = useState("200");
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [semanticSearch, setSemanticSearch] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<QueryResult[]>([]);

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      text: "",
    };
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (id: string) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((q) => q.id !== id));
    }
  };

  const updateQuestion = (id: string, text: string) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, text } : q)));
  };

  const handleSubmit = async () => {
    // Validate questions
    const validQuestions = questions.filter((q) => q.text.trim());
    if (validQuestions.length === 0) {
      toast.error("Please enter at least one question");
      return;
    }

    setIsProcessing(true);
    setResults([]);

    try {
      const queryResults: QueryResult[] = [];

      // Process each question
      for (const question of validQuestions) {
        const response = await apiService.submitQuery({
          query: question.text,
          domain: domain || undefined,
          chunk_size: parseInt(chunkSize),
          overlap: parseInt(overlap),
          include_metadata: includeMetadata,
          semantic_search: semanticSearch,
        });

        queryResults.push({
          question: question.text,
          answer: response.answer,
          confidence: response.confidence || 0.95,
          sources: response.sources || [],
        });
      }

      setResults(queryResults);
      toast.success(
        `Successfully processed ${queryResults.length} question(s)`
      );
    } catch (error) {
      toast.error("Failed to process questions. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const domains = [
    { value: "insurance", label: "Insurance" },
    { value: "legal", label: "Legal" },
    { value: "hr", label: "Human Resources" },
    { value: "compliance", label: "Compliance" },
    { value: "finance", label: "Finance" },
    { value: "general", label: "General" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI Document Query
          </CardTitle>
          <CardDescription>
            Ask intelligent questions about your document knowledge base
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Query Interface */}
        <div className="lg:col-span-2 space-y-6">
          {/* Questions Section */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Your Questions
              </CardTitle>
              <CardDescription>
                Ask multiple questions to get comprehensive insights
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {questions.map((question, index) => (
                <div key={question.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor={`question-${question.id}`}
                      className="text-sm font-medium"
                    >
                      Question {index + 1}
                    </Label>
                    {questions.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeQuestion(question.id)}
                        className="h-8 w-8 p-0 hover:bg-destructive/20"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <Textarea
                    id={`question-${question.id}`}
                    placeholder="What would you like to know about your documents?"
                    value={question.text}
                    onChange={(e) =>
                      updateQuestion(question.id, e.target.value)
                    }
                    className="min-h-[80px] bg-muted/30 border-border focus:border-primary/50 transition-all"
                  />
                </div>
              ))}

              <Button
                variant="outline"
                onClick={addQuestion}
                className="w-full border-dashed border-border hover:border-primary/50 hover:bg-primary/10"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Another Question
              </Button>
            </CardContent>
          </Card>

          {/* Domain Selection */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-accent" />
                Domain Context
              </CardTitle>
              <CardDescription>
                Select your industry domain for specialized analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={domain} onValueChange={setDomain}>
                <SelectTrigger className="w-full bg-muted/30 border-border">
                  <SelectValue placeholder="Select your domain" />
                </SelectTrigger>
                <SelectContent className="glass-card">
                  {domains.map((d) => (
                    <SelectItem key={d.value} value={d.value}>
                      {d.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="space-y-3">
                <Button
                  onClick={handleSubmit}
                  disabled={
                    isProcessing || questions.every((q) => !q.text.trim())
                  }
                  className="w-full h-12 text-base font-medium bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing Questions...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      Submit Questions
                    </>
                  )}
                </Button>

                {isProcessing && (
                  <Button
                    onClick={() => {
                      setIsProcessing(false);
                      toast.info("Processing cancelled");
                    }}
                    variant="outline"
                    className="w-full h-10 text-sm"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancel Processing
                  </Button>
                )}

                {isProcessing && (
                  <div className="text-xs text-muted-foreground text-center space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-accent"></div>
                      <p>⏳ Processing large document (25 pages, 143 chunks)</p>
                    </div>
                    <p>Complex analysis typically takes 30-90 seconds</p>
                    <div className="w-full bg-muted rounded-full h-1.5 mt-2">
                      <div
                        className="bg-accent h-1.5 rounded-full animate-pulse"
                        style={{ width: "45%" }}
                      ></div>
                    </div>
                    <p className="text-green-600">
                      ✅ System timeout increased to 90 seconds for complex
                      documents
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          {results.length > 0 && (
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-accent" />
                  AI Analysis Results
                </CardTitle>
                <CardDescription>
                  Here are the insights from your document analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {results.map((result, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex items-start justify-between">
                      <h3 className="font-medium text-sm text-muted-foreground">
                        Question {index + 1}:
                      </h3>
                      <Badge variant="outline" className="text-xs">
                        {Math.round(result.confidence * 100)}% confidence
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground italic">
                      {result.question}
                    </p>
                    <div className="p-4 rounded-lg bg-muted/30 border border-border">
                      <p className="text-sm leading-relaxed">{result.answer}</p>
                    </div>
                    {result.sources.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">
                          Sources:
                        </Label>
                        <div className="flex flex-wrap gap-1">
                          {result.sources.map((source, sourceIndex) => (
                            <Badge
                              key={sourceIndex}
                              variant="outline"
                              className="text-xs"
                            >
                              {source}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Advanced Options */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-muted-foreground" />
                Advanced Options
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible>
                <AccordionItem value="processing" className="border-border">
                  <AccordionTrigger className="text-sm">
                    Processing Settings
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="chunk-size" className="text-xs">
                        Chunk Size
                      </Label>
                      <Select value={chunkSize} onValueChange={setChunkSize}>
                        <SelectTrigger id="chunk-size" className="h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="500">500 tokens</SelectItem>
                          <SelectItem value="1000">1000 tokens</SelectItem>
                          <SelectItem value="1500">1500 tokens</SelectItem>
                          <SelectItem value="2000">2000 tokens</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="overlap" className="text-xs">
                        Overlap Size
                      </Label>
                      <Select value={overlap} onValueChange={setOverlap}>
                        <SelectTrigger id="overlap" className="h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="100">100 tokens</SelectItem>
                          <SelectItem value="200">200 tokens</SelectItem>
                          <SelectItem value="300">300 tokens</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="features" className="border-border">
                  <AccordionTrigger className="text-sm">
                    Feature Toggles
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="metadata" className="text-xs">
                        Include Metadata
                      </Label>
                      <Switch
                        id="metadata"
                        checked={includeMetadata}
                        onCheckedChange={setIncludeMetadata}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="semantic" className="text-xs">
                        Semantic Search
                      </Label>
                      <Switch
                        id="semantic"
                        checked={semanticSearch}
                        onCheckedChange={setSemanticSearch}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* Quick Tips */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-sm">Quick Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Badge
                  variant="outline"
                  className="w-full justify-start text-xs py-1"
                >
                  💡 Be specific in your questions
                </Badge>
                <Badge
                  variant="outline"
                  className="w-full justify-start text-xs py-1"
                >
                  🎯 Use domain context for better results
                </Badge>
                <Badge
                  variant="outline"
                  className="w-full justify-start text-xs py-1"
                >
                  📋 Ask multiple related questions
                </Badge>
                <Badge
                  variant="outline"
                  className="w-full justify-start text-xs py-1"
                >
                  ⚙️ Adjust settings for complex docs
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Recent Queries */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-sm">Recent Queries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-xs">
                <div className="p-2 rounded bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors">
                  What are the key risk factors mentioned?
                </div>
                <div className="p-2 rounded bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors">
                  Summarize compliance requirements
                </div>
                <div className="p-2 rounded bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors">
                  Extract financial data points
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
