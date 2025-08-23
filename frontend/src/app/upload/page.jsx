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
import { IconSquareRoundedX } from "@tabler/icons-react";
import { MultiStepLoader } from "./../../components/ui/multi-step-loader";

const loadingStates = [
  { text: "Got your PDF/image" },
  { text: "Extracting text" },
  { text: "Processing input" },
  { text: "Sending response to LLM" },
  { text: "Generating response" },
  { text: "Successfully" },
];

export default function ReportUpload() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [loader, setLoader] = useState(false);

  // TTS state
  const [selectedLang, setSelectedLang] = useState("en-US");

  // Speak function
  const speakText = (text) => {
    if (!text) {
      alert("No text available to speak.");
      return;
    }
    if ("speechSynthesis" in window) {
      const speech = new SpeechSynthesisUtterance(text);
      speech.lang = selectedLang;
      speech.rate = 1;
      speech.pitch = 1;
      window.speechSynthesis.speak(speech);
    } else {
      alert("Sorry, your browser does not support text-to-speech.");
    }
  };

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
      const response = await axios.post(`
        ${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ai/analyze-report`,
        formData,
        { withCredentials: true }
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
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Upload Medical Report
              </h2>
              <p className="text-gray-600">
                Upload your medical report for AI-powered analysis and insights
              </p>
            </div>

            {/* File Upload */}
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
            </div>

            {/* Error */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg mt-4">
                <AlertCircle className="w-5 h-5 text-red-500 inline-block mr-2" />
                <span className="text-red-700">{error}</span>
              </div>
            )}

            {/* Loader */}
            <div className="w-full h-[30vh] flex items-center justify-center">
              <MultiStepLoader
                loadingStates={loadingStates}
                loading={loader}
                duration={2000}
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleSubmit(e);
                  setLoader(true);
                }}
                disabled={!file || loading}
                className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50"
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
                  className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200"
                >
                  Reset Upload
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Analysis Results + TTS */}
        {analysisResult && (
          <div className="mt-8 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white flex items-center">
                <Brain className="w-6 h-6 mr-3" />
                Analysis Results
              </h3>
              <div className="flex items-center space-x-2">
                <select
                  value={selectedLang}
                  onChange={(e) => setSelectedLang(e.target.value)}
                  className="rounded-lg px-2 py-1 text-sm"
                >
                  <option value="en-US">English</option>
                  <option value="hi-IN">Hindi</option>
                </select>
                <button
                  onClick={() =>
                    speakText(analysisResult.llmAnalysis?.summary || "")
                  }
                  className="bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-1 rounded-lg text-sm"
                >
                  🔊 Speak
                </button>
              </div>
            </div>

            <div className="p-8">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono leading-relaxed">
                {analysisResult.llmAnalysis?.summary || "No summary available."}
              </pre>
            </div>
          </div>
        )}
      </div>
    </>
  );
}