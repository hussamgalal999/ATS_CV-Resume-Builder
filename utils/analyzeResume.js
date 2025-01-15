const defaultKeywords = ['experience', 'skills', 'education', 'projects', 'achievements'];
const defaultSections = ['summary', 'work experience', 'education', 'skills'];

export const analyzeResume = (content) => {
    const analysis = {
        score: 0,
        findings: [],
        suggestions: []
    };

    const wordCount = content.split(/\s+/).length;
    let keywordMatches = 0;
    let sectionMatches = 0;

    // Using default keywords if KEYWORDS is undefined
    const keywords = Array.isArray(defaultKeywords) ? defaultKeywords : [];
    const sections = Array.isArray(defaultSections) ? defaultSections : [];

    keywords.forEach(keyword => {
        if (content.toLowerCase().includes(keyword)) {
            analysis.score += 10;
            keywordMatches++;
            analysis.findings.push(`✓ Found ${keyword} section`);
        } else {
            analysis.suggestions.push(`Consider adding a ${keyword} section`);
        }
    });

    sections.forEach(section => {
        if (content.toLowerCase().includes(section)) {
            analysis.score += 5;
            sectionMatches++;
        }
    });

    if (content.length < 1000) {
        analysis.suggestions.push('Resume content seems too brief. Consider adding more details.');
    }

    return {
        score: Math.min(analysis.score, 100),
        findings: analysis.findings,
        suggestions: analysis.suggestions,
        metrics: {
            wordCount,
            keywordMatches,
            sectionMatches
        }
    };
};