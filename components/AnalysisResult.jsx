import { FiCheckCircle, FiAlertCircle } from "react-icons/fi";

export const AnalysisResult = ({ analysis }) => (
  <div className="mt-8 space-y-6">
    <div className="p-6 bg-green-50 rounded-lg">
      <h3 className="text-xl font-semibold mb-4 flex items-center">
        <FiCheckCircle className="text-green-500 mr-2" />
        Structure check complete
      </h3>

      <div className="space-y-4">
        <div>
          <p className="font-medium">Structure checklist score</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2" role="progressbar"
            aria-label="Structure checklist score" aria-valuemin="0" aria-valuemax="100" aria-valuenow={analysis.score}>
            <div className="bg-green-500 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${analysis.score}%` }} />
          </div>
          <p className="text-sm text-gray-600 mt-1">{analysis.score}/100 · Heuristic checklist only</p>
        </div>

        {analysis.fileName && <p className="text-sm text-gray-600">File: {analysis.fileName}</p>}

        <div>
          <p className="font-medium">Section checks</p>
          <ul className="mt-2 space-y-1">
            {analysis.findings.map((finding) => (
              <li key={finding.key} className="text-gray-700 flex items-start gap-2">
                {finding.status === "found"
                  ? <FiCheckCircle className="text-green-600 mt-1 shrink-0" />
                  : <FiAlertCircle className="text-amber-600 mt-1 shrink-0" />}
                <span>{finding.label}: {finding.status === "found" ? "detected" : "not detected"}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-medium">Suggestions</p>
          {analysis.suggestions.length ? (
            <ul className="list-disc list-inside mt-2 space-y-1">
              {analysis.suggestions.map((suggestion, index) => <li key={index} className="text-gray-700">{suggestion}</li>)}
            </ul>
          ) : <p className="text-sm text-gray-600 mt-2">No basic structure suggestions were generated. A human review is still recommended.</p>}
        </div>

        <div className="text-sm text-gray-600 border-t pt-3">
          <p>Word count: {analysis.metrics.wordCount}</p>
          <p>Detected sections: {analysis.metrics.detectedSectionCount}/{analysis.metrics.totalSectionsChecked}</p>
          <p>Measurable evidence pattern: {analysis.metrics.hasQuantifiedEvidence ? "detected" : "not detected"}</p>
        </div>
      </div>
    </div>
    <p className="text-xs text-gray-500" role="note">{analysis.disclaimer}</p>
  </div>
);
