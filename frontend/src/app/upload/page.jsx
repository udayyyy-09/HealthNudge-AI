"use client";
import axios from "axios";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Upload,
  FileText,
  Brain,
  CheckCircle,
  AlertCircle,
  Loader,
  X,
  File,
  Sparkles,
  History,
} from "lucide-react";
import UploadHero from "./../../components/uploadhero";
import { IconSquareRoundedX } from "@tabler/icons-react";
import { MultiStepLoader } from "./../../components/ui/multi-step-loader";
import Chatbot from './../../components/chatbot';

const loadingStates = [
  { text: "Got your PDF/image" },
  { text: "Extracting text" },
  { text: "Processing input" },
  { text: "Sending response to LLM" },
  { text: "Generating response" },
  { text: "Successfully" },
];

export default function ReportUpload() {
  const router = useRouter();
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

  // Stop speech function
  const stopSpeech = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  };

  // Pause speech function
  const pauseSpeech = () => {
    if ("speechSynthesis" in window && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
    }
  };

  // Resume speech function
  const resumeSpeech = () => {
    if ("speechSynthesis" in window && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
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
        <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-3xl">
          <div className="p-10">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-pulse">
                <FileText className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight flex items-center justify-center gap-2">
                <Sparkles className="w-7 h-7 text-purple-500 animate-bounce" />
                Upload Medical Report
              </h2>
              <p className="text-gray-600 text-lg">
                Get instant AI-powered analysis and insights from your medical
                report.
              </p>
            </div>

            {/* File Upload */}
            <div
              className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 ${
                dragActive
                  ? "border-blue-500 bg-blue-100 scale-105"
                  : file
                  ? "border-green-500 bg-green-100"
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
                    <div className="flex items-center space-x-3 bg-white rounded-lg p-4 shadow-md border border-green-200">
                      <File className="w-8 h-8 text-blue-500" />
                      <div className="text-left">
                        <p className="font-semibold text-gray-900 truncate max-w-xs">
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
                        aria-label="Remove file"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload
                      className={`w-14 h-14 mx-auto transition-colors ${
                        dragActive ? "text-blue-500" : "text-gray-400"
                      }`}
                    />
                    <div>
                      <p className="text-xl font-semibold text-gray-700">
                        {dragActive
                          ? "Drop your file here"
                          : "Drag & drop your medical report"}
                      </p>
                      <p className="text-gray-500 mt-1">
                        or{" "}
                        <span className="text-blue-600 font-bold underline cursor-pointer">
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
              <div className="p-4 bg-red-100 border border-red-300 rounded-lg mt-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <span className="text-red-700 font-medium">{error}</span>
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
                className="flex items-center justify-center space-x-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50"
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
              
              <button
                onClick={() => router.push('/reports')}
                className="flex items-center justify-center space-x-2 px-8 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white font-bold rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
              >
                <History className="w-5 h-5" />
                <span>See Medical Report History</span>
              </button>
              
              {loader && (
                <button
                  className="fixed top-4 right-4 text-black z-[120]"
                  onClick={() => setLoader(false)}
                  aria-label="Close loader"
                >
                  <IconSquareRoundedX className="h-10 w-10" />
                </button>
              )}
              {(file || success || error) && (
                <button
                  onClick={resetForm}
                  disabled={loading}
                  className="px-8 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 shadow"
                >
                  Reset Upload
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Analysis Results + TTS */}
        {analysisResult && (
          <div className="mt-10 bg-gradient-to-br from-purple-50 via-blue-50 to-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="bg-white p-8 flex flex-col md:flex-row justify-between items-center">
              <h3 className="text-2xl font-extrabold text-black flex items-center gap-3">
                <Brain className="B-7 h-7 mr-2" />
                Analysis Results
              </h3>
              <div className="flex items-center space-x-2 mt-4 md:mt-0">
                <select
                  value={selectedLang}
                  onChange={(e) => setSelectedLang(e.target.value)}
                  className="rounded-lg px-2 py-1 text-sm font-semibold bg-black"
                >
                  <option value="en-US" className="text-black">English</option>
                  <option value="hi-IN">Hindi</option>
                </select>
                <button
                  onClick={() =>
                    speakText(analysisResult.llmAnalysis?.summary || "")
                  }
                  className="bg-black hover:bg-gray-900 text-white px-4 py-1 rounded-lg text-sm font-bold shadow"
                >
                  🔊 Speak
                </button>
                <button
                  onClick={pauseSpeech}
                  className="bg-black hover:bg-gray-900 text-white px-4 py-1 rounded-lg text-sm font-bold shadow"
                >
                  ⏸️ Pause
                </button>
                <button
                  onClick={resumeSpeech}
                  className="bg-black hover:bg-gray-900 text-white px-4 py-1 rounded-lg text-sm font-bold shadow"
                >
                  ▶️ Resume
                </button>
              </div>
            </div>

            <div className="p-10">
              <pre className="text-lg text-gray-800 whitespace-pre-wrap font-mono leading-relaxed bg-white rounded-xl p-6 shadow-inner border border-gray-100">
                {analysisResult.llmAnalysis?.summary || "No summary available."}
              </pre>
            </div>
          </div>
        )}
        <Chatbot/>
      </div>
    </>
  );
}