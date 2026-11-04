import { FaCloudUploadAlt, FaCloudDownloadAlt } from "react-icons/fa";
import React, { useContext } from "react";
import { ResumeContext } from "../../pages/builder";
import { validateResumeData } from "../../utils/validateResumeData";

const LoadUnload = () => {
  const { resumeData, setResumeData } = useContext(ResumeContext);

  const handleLoad = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (file.size <= 0 || file.size > 2 * 1024 * 1024) {
      window.alert("Backup JSON must be non-empty and no larger than 2MB.");
      return;
    }
    try {
      const parsed = JSON.parse(await file.text());
      const validated = validateResumeData(parsed);
      setResumeData(validated);
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "This backup file is invalid.");
    }
  };

  const handleDownload = (event) => {
    event.preventDefault();
    const blob = new Blob([JSON.stringify(resumeData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${(resumeData.name || "resume").replace(/[^a-z0-9_-]/gi, "_")}-backup.json`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="flex flex-wrap gap-4 mb-2 justify-center">
      <div className="inline-flex flex-row items-center gap-2">
        <h2 className="text-[1.2rem] text-white">Load Data</h2>
        <label className="p-2 text-white bg-blue-700 rounded cursor-pointer">
          <FaCloudUploadAlt className="text-[1.2rem] text-white" />
          <input aria-label="Load Data" type="file" className="hidden"
            onChange={handleLoad} accept=".json,application/json" />
        </label>
      </div>
      <div className="inline-flex flex-row items-center gap-2">
        <h2 className="text-[1.2rem] text-white">Save Data</h2>
        <button type="button" aria-label="Save Data" className="p-2 text-white bg-blue-700 rounded"
          onClick={handleDownload}>
          <FaCloudDownloadAlt className="text-[1.2rem] text-white" />
        </button>
      </div>
    </div>
  );
};

export default LoadUnload;
