# DocuMind AI System

A sophisticated Python-based RAG (Retrieval-Augmented Generation) system that processes natural language queries to retrieve and evaluate information from large unstructured documents (PDFs). The system provides structured decisions with clear, citable justifications.

## 🎯 Features

- **Document Ingestion**: Load and process PDF documents with text extraction and intelligent chunking
- **Semantic Search**: Convert text chunks into vector embeddings for efficient semantic retrieval
- **Knowledge Base**: ChromaDB vector store for fast similarity search
- **LLM Reasoning**: Google Gemini Pro for intelligent analysis and decision-making
- **Structured Output**: JSON responses with decisions, amounts, justifications, and source citations
- **Page-Level Citations**: Precise referencing to source document pages

## 🚀 Quick Start

### Prerequisites

1. **Python 3.8+** installed on your system
2. **Google API Key** for Gemini Pro access
3. **PDF Document** named `BAJHLIP23020V012223.pdf` in the project directory

### Installation

1. **Clone or download** this project to your local machine

2. **Install dependencies**:

   ```powershell
   pip install -r requirements.txt
   ```

3. **Set up Google API Key** (Choose one method):

   **Method 1: Using .env file (Recommended)**

   ```powershell
   # Copy the example file
   cp .env.example .env

   # Edit .env file and add your API key:
   # GOOGLE_API_KEY=your_actual_api_key_here
   ```

   **Method 2: Environment variable (Temporary)**

   ```powershell
   # Set for current session only
   $env:GOOGLE_API_KEY = "your_google_api_key_here"
   ```

   **Method 3: Permanent environment variable**

   ```powershell
   # Set permanently (Windows)
   [Environment]::SetEnvironmentVariable("GOOGLE_API_KEY", "your_google_api_key_here", "User")
   ```

4. **Place your PDF document** in the same directory as `documind_ai.py`

### Usage

```powershell
python documind_ai.py
```

## 🏗️ System Architecture

### Core Components

1. **Document Processing Pipeline**

   - `PyPDFLoader`: PDF text extraction
   - `RecursiveCharacterTextSplitter`: Intelligent text chunking
   - Metadata preservation for page-level citations

2. **Embedding & Vector Store**

   - `HuggingFaceEmbeddings`: all-MiniLM-L6-v2 model
   - `ChromaDB`: In-memory vector database
   - Semantic similarity search

3. **LLM Reasoning Engine**
   - `ChatGoogleGenerativeAI`: Gemini Pro integration
   - RAG pattern implementation
   - Structured JSON response generation

### Data Flow

```
PDF Document → Text Extraction → Chunking → Embeddings → Vector Store
                                                              ↓
User Query → Semantic Search → Context Retrieval → LLM Processing → Structured Response
```

## 📋 Output Format

The system returns a structured JSON response:

```json
{
  "Decision": "Approved | Rejected | Conditional Approval | Needs More Info",
  "Amount": "Calculated Amount (e.g., INR 500,000) | N/A | Not Applicable",
  "Justification": "Detailed explanation with citations [Source: Page X]",
  "Relevant_Clauses": [
    {
      "id": "clause_id_1",
      "text_snippet": "Full text of relevant clause...",
      "source": "Page X"
    }
  ]
}
```

## 🔧 Configuration

### Key Parameters

- **Chunk Size**: 1000 characters (adjustable in `load_and_chunk_document`)
- **Chunk Overlap**: 200 characters (for context continuity)
- **Retrieval Count**: Top 7 similar chunks (adjustable in `process_insurance_query`)
- **LLM Temperature**: 0.1 (for consistent responses)

### Customization Options

1. **Different PDF Files**: Change `document_path` in the `main()` function
2. **Custom Queries**: Modify `sample_query` variable
3. **Chunk Parameters**: Adjust `chunk_size` and `chunk_overlap`
4. **Retrieval Depth**: Change `k` parameter in similarity search
5. **LLM Model**: Switch between "gemini-pro" and "gemini-1.5-flash"

## 🛠️ Advanced Usage

### Processing Custom Queries

```python
# Example: Process a specific insurance query
query = "65-year-old female, cardiac surgery, 5-year policy, pre-existing condition"
result = process_insurance_query(query, vector_store, llm)
print(json.dumps(result, indent=2))
```

### Batch Processing

```python
# Process multiple queries
queries = [
    "Emergency surgery coverage for 30-year-old",
    "Maternity benefits for 28-year-old female",
    "Cancer treatment coverage limitations"
]

for query in queries:
    result = process_insurance_query(query, vector_store, llm)
    print(f"Query: {query}")
    print(f"Decision: {result['Decision']}")
    print("-" * 50)
```

## 🐛 Troubleshooting

### Common Issues

1. **API Key Error**

   ```
   Error: GOOGLE_API_KEY environment variable is not set
   ```

   **Solution**: Set your Google API key as an environment variable

2. **PDF Not Found**

   ```
   Error: PDF file 'BAJHLIP23020V012223.pdf' not found
   ```

   **Solution**: Ensure the PDF file is in the same directory as the script

3. **JSON Parsing Error**

   ```
   JSON parsing error: Expecting value: line 1 column 1 (char 0)
   ```

   **Solution**: The LLM response wasn't valid JSON. Check the raw response in debug output

4. **Memory Issues**
   ```
   OutOfMemoryError during embedding generation
   ```
   **Solution**: Reduce chunk_size or process documents in smaller batches

### Debug Mode

Enable detailed logging by checking the console output for:

- Chunk preview information
- Retrieved chunks debug info
- Raw LLM responses
- JSON parsing status

## 📚 Dependencies

| Package                | Version | Purpose                                   |
| ---------------------- | ------- | ----------------------------------------- |
| langchain              | 0.1.20  | Document processing and RAG orchestration |
| langchain-community    | 0.0.38  | Community integrations                    |
| langchain-google-genai | 1.0.3   | Google Gemini integration                 |
| sentence-transformers  | 2.7.0   | Text embeddings                           |
| chromadb               | 0.5.0   | Vector database                           |
| pypdf                  | 4.2.0   | PDF processing                            |
| google-generativeai    | 0.5.4   | Google AI API                             |

## 🚧 Future Enhancements

- [ ] Support for multiple document formats (DOCX, TXT, HTML)
- [ ] Advanced query parsing with Pydantic models
- [ ] LangGraph orchestration for complex workflows
- [ ] Persistent vector store storage
- [ ] Web interface for easy interaction
- [ ] Batch document processing
- [ ] Custom embedding models
- [ ] Performance optimization and caching

## 📄 License

This project is part of the Bajaj Finserv AI initiative. Please refer to your organization's guidelines for usage and distribution.

## 🤝 Support

For technical support or questions about the DocuMind AI system, please contact the development team or refer to the internal documentation portal.
