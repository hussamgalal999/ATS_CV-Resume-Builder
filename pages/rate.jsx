import React, { useState, useCallback } from 'react';
import { FiAlertCircle } from 'react-icons/fi';
import constants from '../utils/constants';
import { analyzeResume } from '../utils/analyzeResume';
import { DropZone } from '../components/DropZone';
import { AnalysisResult } from '../components/AnalysisResult';

const Rate = () => {
    const [fileData, setFileData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState(null);

    const handleDrop = useCallback(async (acceptedFiles) => {
        const file = acceptedFiles[0];
        
        if (!file || file.size > constants.MAX_FILE_SIZE) {
            setError('Please upload a file under 5MB');
            return;
        }

        setLoading(true);
        setError(null);

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            const result = analyzeResume(content);
            
            setAnalysis({
                fileName: file.name,
                ...result
            });
            setLoading(false);
        };
        reader.readAsText(file);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl">
                <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Smart Resume Analysis</h1>
                
                <DropZone 
                    onDrop={handleDrop}
                    accept={{
                        'application/pdf': ['.pdf'],
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
                    }}
                />

                {error && (
                    <div className="mt-4 p-4 bg-red-50 rounded-lg flex items-center">
                        <FiAlertCircle className="text-red-500 mr-2" />
                        <p className="text-red-600">{error}</p>
                    </div>
                )}

                {loading && (
                    <div className="mt-8 text-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Analyzing your resume...</p>
                    </div>
                )}

                {analysis && <AnalysisResult analysis={analysis} />}
            </div>
        </div>
    );
};

export default Rate;