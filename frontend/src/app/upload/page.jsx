"use client";
import axios from "axios";
import React, { useState } from "react";
import {
  Upload,
  FileText,
  Brain,
  CheckCircle,
  AlertCircle,
  Loader,
  X,
  File,
} from "lucide-react";
import UploadHero from "./../../components/uploadhero";
// import MultiStepLoaderDemo from "./../../components/multiloader";
import { IconSquareRoundedX } from "@tabler/icons-react";
import { MultiStepLoader } from "./../../components/ui/multi-step-loader";

const loadingStates = [
  {
    text: "Got your PDF/image",
  },
  {
    text: "Extracting text",
  },
  {
    text: "Processing input",
  },
  {
    text: "Sending response to LLM",
  },
  {
    text: "Generating response",
  },
  {
    text: "Successfully",
  },
];
export default function ReportUpload() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [loader, setLoader] = useState(false);

  const handleChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      validateAndSetFile(selectedFile);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/jpg",
    ];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(selectedFile.type)) {
      setError("Please select a PDF or image file (PNG, JPG, JPEG).");
      return;
    }

    if (selectedFile.size > maxSize) {
      setError("File size must be less than 10MB.");
      return;
    }

    setFile(selectedFile);
    setError("");
    setSuccess(false);
    setAnalysisResult(null);
  };

  const handleDrag = (e) => {
    // e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    setLoading(true);
    setSuccess(false);
    setError("");
    setAnalysisResult(null);

    try {
      const formData = new FormData();
      formData.append("report", file);

      // Replace with your actual backend URL
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ai/analyze-report`,
        formData,
        {
          withCredentials: true,
        }
      );

      const data = response.data;

      if (data.success) {
        setSuccess(true);
        setAnalysisResult(data);
      } else {
        setError(data.error || "Analysis failed. Please try again.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError(
        "Failed to analyze report. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setError("");
    setSuccess(false);
    setAnalysisResult(null);
    setLoading(false);
  };

  const removeFile = () => {
    setFile(null);
    setError("");
    setSuccess(false);
    setAnalysisResult(null);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <>
      <UploadHero />

      <div className="max-w-4xl mx-auto p-6 mt-10">
        {/* Upload Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Upload Medical Report
              </h2>
              <p className="text-gray-600">
                Upload your medical report for AI-powered analysis and insights
              </p>
            </div>

            {/* File Upload Area */}
            <div className="space-y-6">
              <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                  dragActive
                    ? "border-blue-500 bg-blue-50 scale-105"
                    : file
                    ? "border-green-500 bg-green-50"
                    : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  onChange={handleChange}
                  accept=".pdf,.png,.jpg,.jpeg"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={loading}
                />

                <div className="space-y-4">
                  {file ? (
                    <div className="flex items-center justify-center space-x-4">
                      <div className="flex items-center space-x-3 bg-white rounded-lg p-4 shadow-sm border">
                        <File className="w-8 h-8 text-blue-500" />
                        <div className="text-left">
                          <p className="font-medium text-gray-900 truncate max-w-xs">
                            {file.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                        <button
                          onClick={removeFile}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                          disabled={loading}
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload
                        className={`w-12 h-12 mx-auto transition-colors ${
                          dragActive ? "text-blue-500" : "text-gray-400"
                        }`}
                      />
                      <div>
                        <p className="text-lg font-medium text-gray-700">
                          {dragActive
                            ? "Drop your file here"
                            : "Drag & drop your medical report"}
                        </p>
                        <p className="text-gray-500 mt-1">
                          or{" "}
                          <span className="text-blue-600 font-medium">
                            click to browse
                          </span>
                        </p>
                      </div>
                    </>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-center space-x-6 text-xs text-gray-500">
                  <span className="flex items-center">
                    <FileText className="w-4 h-4 mr-1" />
                    PDF, PNG, JPG
                  </span>
                  <span>Max 10MB</span>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-start space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-800 font-medium">Upload Error</p>
                    <p className="text-red-700 text-sm mt-1">{error}</p>
                  </div>
                </div>
              )}

              {/* Success Message */}
              {success && !analysisResult && (
                <div className="flex items-start space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-green-800 font-medium">
                      Analysis Complete
                    </p>
                    <p className="text-green-700 text-sm mt-1">
                      Your medical report has been successfully analyzed.
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="w-full h-[30vh] flex items-center justify-center">
                <MultiStepLoader
                  loadingStates={loadingStates}
                  loading={loader}
                  duration={2000}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={(e) => {
                    e.preventDefault(); // Prevent default button behavior
                    handleSubmit(e); // Pass the event to your handler
                    setLoader(true);
                  }}
                  disabled={!file || loading}
                  className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Brain className="w-5 h-5" />
                      <span>Analyze Report</span>
                    </>
                  )}
                </button>

                {loader && (
                  <button
                    className="fixed top-4 right-4 text-black z-[120]"
                    onClick={() => setLoader(false)}
                  >
                    <IconSquareRoundedX className="h-10 w-10" />
                  </button>
                )}

                {(file || success || error) && (
                  <button
                    onClick={resetForm}
                    disabled={loading}
                    className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-all duration-200 disabled:opacity-50"
                  >
                    Reset Upload
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Analysis Results */}
        {analysisResult && (
          <div className="mt-8 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
              <h3 className="text-xl font-bold text-white flex items-center">
                <Brain className="w-6 h-6 mr-3" />
                Analysis Results
              </h3>
            </div>

            <div className="p-8">
              {/* Processing Stats Grid */}

              {/* Processing Method */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Processing Method
                </h4>
                <p className="text-gray-700">
                  {analysisResult.processingMethod}
                </p>
              </div>

              {/* AI Analysis */}
              {analysisResult.llmAnalysis?.success && (
  <div className="mb-8 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
    <div className="flex items-center mb-4 pb-3 border-b border-gray-100">
      <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
      <h3 className="text-lg font-semibold text-gray-800">Lab Results Analysis</h3>
    </div>

    <div className="space-y-3">
      {analysisResult.llmAnalysis.summary
        .split('\n')
        .filter(line => line.trim().length > 0)
        .map((line, index) => {
          // Clean the line by removing asterisks and extra spaces
          const cleanedLine = line.replace(/^\*\s*/, '').trim();
          
          // Check if this is a section header
          const isSectionHeader = cleanedLine.endsWith(':');
          const isValueLine = /:\s*\d/.test(cleanedLine);

          return (
            <div 
              key={index} 
              className={
                isSectionHeader 
                  ? "pt-3 font-medium text-blue-700" 
                  : isValueLine 
                    ? "pl-4 text-gray-800"
                    : "pl-4 text-gray-700"
              }
            >
              {isSectionHeader ? (
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  {cleanedLine}
                </div>
              ) : (
                <div className="flex">
                  <span className="mr-2">•</span>
                  <span>{cleanedLine}</span>
                </div>
              )}
            </div>
          );
        })}
    </div>

    <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500">
      <div className="flex justify-between">
        <span>Model: {analysisResult.llmAnalysis.modelUsed}</span>
        <span>Processed: {new Date().toLocaleDateString()}</span>
      </div>
    </div>
  </div>
)}

              {/* LLM Analysis Failed */}
              {analysisResult.llmAnalysis &&
                !analysisResult.llmAnalysis.success && (
                  <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="font-semibold text-yellow-800 mb-2">
                      AI Analysis Unavailable
                    </h4>
                    <p className="text-yellow-700 text-sm">
                      {analysisResult.llmAnalysis.summary}
                    </p>
                  </div>
                )}

              {/* Extracted Text Preview */}
              {analysisResult.extractedText &&
                analysisResult.extractedText !== "[No text after cleaning]" && (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <FileText className="w-5 h-5 text-gray-600 mr-2" />
                      Extracted Text
                    </h4>
                    <div className="bg-white rounded-lg p-4 max-h-64 overflow-y-auto border border-gray-200">
                      <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono leading-relaxed">
                        {analysisResult.extractedText.length > 2000
                          ? `${analysisResult.extractedText.substring(
                              0,
                              2000
                            )}...\n\n[Text truncated - ${
                              analysisResult.extractedText.length
                            } total characters]`
                          : analysisResult.extractedText}
                      </pre>
                    </div>
                  </div>
                )}

              {/* No text extracted */}
              {(!analysisResult.extractedText ||
                analysisResult.extractedText ===
                  "[No text after cleaning]") && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
                    <p className="text-yellow-800 font-medium">
                      No readable text found in the uploaded file.
                    </p>
                  </div>
                  <p className="text-yellow-700 text-sm mt-1">
                    The file may be too low quality, handwritten, or contain no
                    text content.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
