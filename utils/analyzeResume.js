const SECTION_RULES = [
  { key: "contact", label: "Contact information", weight: 10, patterns: [/\b(email|phone|mobile|contact)\b/i, /البريد|الهاتف|التواصل/] },
  { key: "summary", label: "Professional summary", weight: 10, patterns: [/\b(professional summary|career summary|profile|objective|summary)\b/i, /الملخص المهني|نبذة مهنية|الهدف الوظيفي/] },
  { key: "experience", label: "Work experience", weight: 20, patterns: [/\b(work experience|professional experience|employment history|experience)\b/i, /الخبرات العملية|الخبرة المهنية|الخبرة العملية/] },
  { key: "education", label: "Education", weight: 15, patterns: [/\b(education|academic background|academic history)\b/i, /التعليم|المؤهل الدراسي|المؤهلات/] },
  { key: "skills", label: "Skills", weight: 15, patterns: [/\b(technical skills|core skills|skills|competencies)\b/i, /المهارات|المهارات التقنية/] },
  { key: "projects", label: "Projects", weight: 10, patterns: [/\b(projects|selected projects|personal projects)\b/i, /المشروعات|المشاريع/] },
  { key: "certifications", label: "Certifications", weight: 5, patterns: [/\b(certifications|certificates|licenses)\b/i, /الشهادات|التراخيص/] },
  { key: "languages", label: "Languages", weight: 5, patterns: [/\b(languages|language proficiency)\b/i, /اللغات/] },
];

const countWords = (text) => (text.match(/[\p{L}\p{N}][\p{L}\p{N}+#./'-]*/gu) || []).length;

export const analyzeResume = (content) => {
  if (typeof content !== "string") {
    throw new TypeError("Resume content must be plain text.");
  }

  const normalized = content
    .replace(/\r\n?/g, "\n")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, " ")
    .trim();

  if (!normalized) {
    throw new Error("The uploaded text file is empty.");
  }
  if (normalized.length > 50000) {
    throw new Error("The resume text is too large to analyze.");
  }

  const wordCount = countWords(normalized);
  const findings = [];
  const suggestions = [];
  let score = 0;
  const detectedSections = [];

  for (const section of SECTION_RULES) {
    const found = section.patterns.some((pattern) => pattern.test(normalized));
    if (found) {
      score += section.weight;
      detectedSections.push(section.key);
      findings.push({ key: section.key, label: section.label, status: "found" });
    } else {
      findings.push({ key: section.key, label: section.label, status: "missing" });
      suggestions.push(`Consider adding a clearly labelled ${section.label.toLowerCase()} section when relevant.`);
    }
  }

  const hasQuantifiedEvidence = /(?:\d+\s?%|\$\s?\d+|\b\d{1,3}(?:,\d{3})+\b|\b\d+\s?(?:users|clients|customers|projects|years|hours|teams)\b)/i.test(normalized);
  if (hasQuantifiedEvidence) {
    score += 10;
    findings.push({ key: "evidence", label: "Measurable evidence", status: "found" });
  } else {
    suggestions.push("Where truthful and verifiable, add measurable outcomes to relevant experience or project bullets.");
  }

  if (wordCount >= 150 && wordCount <= 900) {
    score += 10;
    findings.push({ key: "length", label: "Text length within a broad review range", status: "found" });
  } else if (wordCount < 150) {
    suggestions.push("The extracted text is short. Check whether sections or content were omitted before editing the CV.");
  } else {
    suggestions.push("The extracted text is lengthy. Consider removing repetition while preserving relevant evidence.");
  }

  if (detectedSections.includes("experience") && detectedSections.includes("skills")) {
    findings.push({ key: "role_content", label: "Experience and skills sections both detected", status: "found" });
  }

  return {
    score: Math.min(100, score),
    scoreType: "heuristic_structure_check",
    disclaimer: "This is a basic text-structure checklist, not an ATS pass probability, employer assessment, or guarantee of interview selection.",
    findings,
    suggestions,
    metrics: {
      wordCount,
      detectedSectionCount: detectedSections.length,
      totalSectionsChecked: SECTION_RULES.length,
      hasQuantifiedEvidence,
    },
  };
};
