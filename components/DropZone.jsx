import { useDropzone } from "react-dropzone";
import { FiUpload } from "react-icons/fi";

export const DropZone = ({ onDrop, onDropRejected, accept, maxSize }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    accept,
    maxFiles: 1,
    maxSize,
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-200 ease-in-out ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400"}`}
    >
      <input {...getInputProps()} />
      <FiUpload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
      <p className="text-gray-600">
        {isDragActive ? "Drop your .txt resume here..." : "Drag & drop a plain-text CV (.txt), or click to select"}
      </p>
      <p className="text-sm text-gray-500 mt-2">TXT only for now · Max 5MB · PDF/DOCX extraction is not enabled yet</p>
    </div>
  );
};
