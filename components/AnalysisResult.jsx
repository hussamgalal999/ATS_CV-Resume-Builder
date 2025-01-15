import { FiCheckCircle } from 'react-icons/fi';

export const AnalysisResult = ({ analysis }) => (
    <div className="mt-8 space-y-6">
        <div className="p-6 bg-green-50 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
                <FiCheckCircle className="text-green-500 mr-2" />
                Analysis Complete
            </h3>
            
            <div className="space-y-4">
                <div>
                    <p className="font-medium">Resume Score</p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                        <div 
                            className="bg-green-500 h-2.5 rounded-full transition-all duration-500" 
                            style={{ width: `${analysis.score}%` }}
                        ></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{analysis.score}/100</p>
                </div>

                {analysis.findings.length > 0 && (
                    <div>
                        <p className="font-medium">Key Findings</p>
                        <ul className="mt-2 space-y-1">
                            {analysis.findings.map((finding, index) => (
                                <li key={index} className="text-gray-700">{finding}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <div>
                    <p className="font-medium">Suggestions for Improvement</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                        {analysis.suggestions.map((suggestion, index) => (
                            <li key={index} className="text-gray-700">{suggestion}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    </div>
);
