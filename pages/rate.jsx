import React, { useCallback, useState } from "react";
import { FiAlertCircle } from "react-icons/fi";
import constants from "../utils/constants";
import { analyzeResume } from "../utils/analyzeResume";
import { DropZone } from "../components/DropZone";
import { AnalysisResult } from "../components/AnalysisResult";

const Rate = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const handleDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles?.[0];
    setAnalysis(null);
    setError("");

    if (!file) {
      setError("Choose a plain-text .txt file to continue.");
      return;
    }
    const extension = file.name.toLowerCase().split(".").pop();
    if (extension !== "txt" || (file.type && file.type !== "text/plain")) {
      setError("Only .txt files can be assessed accurately by this version. PDF/DOCX parsing is not available yet.");
      return;
    }
    if (file.size <= 0 || file.size > constants.MAX_FILE_SIZE) {
      setError("The file must contain data and be no larger than 5MB.");
      return;
    }

    setLoading(true);
    try {
      const content = await file.text();
      const result = analyzeResume(content);
      setAnalysis({ fileName: file.name, ...result });
    } catch (err) {
      setError(err instanceof Error ? err.message : "The resume could not be read.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRejected = useCallback((rejections) => {
    const message = rejections?.[0]?.errors?.[0]?.message;
    setAnalysis(null);
    setError(message || "The selected file was rejected. Please upload one .txt file under 5MB.");
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-center mb-3 text-gray-800">CV Structure Check</h1>
        <p className="text-sm text-gray-600 text-center mb-8">
          A transparent text-structure checklist. It does not predict ATS success or guarantee an interview.
        </p>
        <DropZone
          onDrop={handleDrop}
          onDropRejected={handleRejected}
          maxSize={constants.MAX_FILE_SIZE}
          accept={constants.ACCEPTED_MIME_TYPES}
        />

        {error && (
          <div role="alert" className="mt-4 p-4 bg-red-50 rounded-lg flex items-center">
            <FiAlertCircle className="text-red-500 mr-2 shrink-0" />
            <p className="text-red-600">{error}</p>
          </div>
        )}
        {loading && (
          <div className="mt-8 text-center" role="status" aria-live="polite">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Analyzing extracted text…</p>
          </div>
        )}
        {analysis && <AnalysisResult analysis={analysis} />}
      </div>
    </div>
  );
};

export default Rate;
