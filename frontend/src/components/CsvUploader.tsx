import { useState, useRef } from "react";
import { Upload, X, FileText, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CsvUploaderProps {
  onEmailsExtracted: (emails: string[]) => void;
  onClose: () => void;
}

const CsvUploader = ({ onEmailsExtracted, onClose }: CsvUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string>("");
  const [emails, setEmails] = useState<string[]>([]);
  const [error, setError] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  const parseCSV = (content: string): string[] => {
    const lines = content.split(/\r?\n/);
    const extractedEmails: string[] = [];

    lines.forEach((line) => {
      // Try to find email patterns in each line
      const cells = line.split(',').map(cell => cell.trim().replace(/['"]/g, ''));
      
      cells.forEach((cell) => {
        if (validateEmail(cell)) {
          extractedEmails.push(cell.toLowerCase());
        }
      });
    });

    // Remove duplicates
    return [...new Set(extractedEmails)];
  };

  const handleFile = (file: File) => {
    setError("");
    setIsProcessing(true);

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      setIsProcessing(false);
      return;
    }

    // Check if it's a text-based file
    if (!file.type.includes('text') && !file.type.includes('csv') && !file.name.endsWith('.csv') && !file.name.endsWith('.txt')) {
      setError("Please upload a CSV or text file");
      setIsProcessing(false);
      return;
    }

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsedEmails = parseCSV(content);

        if (parsedEmails.length === 0) {
          setError("No valid email addresses found in the CSV file");
          setEmails([]);
        } else {
          setEmails(parsedEmails);
          setError("");
        }
      } catch (err) {
        setError("Failed to parse CSV file");
        setEmails([]);
      } finally {
        setIsProcessing(false);
      }
    };

    reader.onerror = () => {
      setError("Failed to read file");
      setIsProcessing(false);
    };

    reader.readAsText(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleConfirm = () => {
    if (emails.length > 0) {
      onEmailsExtracted(emails);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Upload CSV File</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-auto">
          {/* File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv,application/csv"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Drag & Drop Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleUploadClick}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
              isDragging
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary hover:bg-primary/5"
            }`}
          >
            <div className="flex flex-col items-center gap-3">
              <Upload className={`h-12 w-12 ${isDragging ? "text-primary" : "text-muted-foreground"}`} />
              <div>
                <p className="text-foreground font-medium">
                  {isDragging ? "Drop your CSV file here" : "Click to upload or drag and drop"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  CSV file with email addresses (max 5MB)
                </p>
              </div>
            </div>
          </div>

          {/* Processing State */}
          {isProcessing && (
            <div className="mt-4 p-4 bg-muted rounded-lg flex items-center gap-3">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              <p className="text-sm text-foreground">Processing CSV file...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="mt-4 p-4 bg-destructive/10 border border-destructive rounded-lg">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Success State */}
          {fileName && !error && emails.length > 0 && (
            <div className="mt-4 space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-green-600" />
                    <p className="text-sm font-medium text-green-900">{fileName}</p>
                  </div>
                  <p className="text-sm text-green-700 mt-1">
                    Found {emails.length} valid email address{emails.length !== 1 ? 'es' : ''}
                  </p>
                </div>
              </div>

              {/* Email Preview */}
              <div className="border border-border rounded-lg">
                <div className="px-4 py-3 bg-muted border-b border-border">
                  <p className="text-sm font-medium text-foreground">Email Addresses Preview</p>
                </div>
                <div className="p-4 max-h-48 overflow-auto">
                  <div className="flex flex-wrap gap-2">
                    {emails.slice(0, 50).map((email, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary text-xs rounded-full"
                      >
                        {email}
                      </span>
                    ))}
                    {emails.length > 50 && (
                      <span className="inline-flex items-center px-3 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                        +{emails.length - 50} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CSV Format Tips */}
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-sm font-medium text-foreground mb-2">CSV Format Tips:</p>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Each row can contain one or more email addresses</li>
              <li>Emails can be in any column</li>
              <li>Duplicate emails will be automatically removed</li>
              <li>Example: email@example.com, user@domain.com</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border flex items-center justify-end gap-3">
          <Button
            variant="ghost"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={emails.length === 0}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Add {emails.length} Email{emails.length !== 1 ? 's' : ''}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CsvUploader;
