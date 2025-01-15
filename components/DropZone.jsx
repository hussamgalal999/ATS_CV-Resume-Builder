import { useDropzone } from 'react-dropzone';
import { FiUpload } from 'react-icons/fi';

export const DropZone = ({ onDrop, accept }) => {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept,
        maxFiles: 1
    });

    return (
        <div {...getRootProps()} className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
            transition-colors duration-200 ease-in-out
            ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}
        `}>
            <input {...getInputProps()} />
            <FiUpload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600">
                {isDragActive ? 'Drop your resume here...' : 'Drag & drop your resume, or click to select'}
            </p>
            <p className="text-sm text-gray-500 mt-2">Supported formats: PDF, DOCX (Max 5MB)</p>
        </div>
    );
};
