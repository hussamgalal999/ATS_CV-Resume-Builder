import test from "node:test";
import assert from "node:assert/strict";
import { analyzeResume } from "../utils/analyzeResume.js";
import { validateResumeData } from "../utils/validateResumeData.js";

test("analyzer identifies common English CV sections without claiming ATS pass probability", () => {
  const text = [
    "John Doe email john@example.com phone +1 555 555 5555",
    "Professional Summary",
    "Work Experience",
    "Education",
    "Technical Skills",
    "Projects",
    "Certifications",
    "Languages",
    "Increased customer conversion by 25% and supported 18 clients."
  ].join("\n") + "\n" + "work skills experience education projects ".repeat(60);
  const result = analyzeResume(text);
  assert.ok(result.score > 0 && result.score <= 100);
  assert.equal(result.scoreType, "heuristic_structure_check");
  assert.match(result.disclaimer, /not an ATS pass probability/i);
  assert.equal(result.metrics.detectedSectionCount, 8);
});

test("analyzer detects Arabic CV section headings", () => {
  const result = analyzeResume([
    "بيانات التواصل والبريد والهاتف",
    "الملخص المهني",
    "الخبرات العملية",
    "المؤهلات",
    "المهارات التقنية",
    "المشروعات",
    "الشهادات",
    "اللغات"
  ].join("\n"));
  assert.equal(result.metrics.detectedSectionCount, 8);
});

test("analyzer rejects empty, non-string, and excessive input", () => {
  assert.throws(() => analyzeResume("   "), /empty/i);
  assert.throws(() => analyzeResume({}), /plain text/i);
  assert.throws(() => analyzeResume("x".repeat(50001)), /too large/i);
});

test("resume backup validation strips unknown fields and preserves supported sections", () => {
  const result = validateResumeData({
    name: "Alex Example",
    summary: "Operations professional",
    projects: [{ name: "Portfolio", link: "https://example.com", description: "", keyAchievements: "", startYear: "", endYear: "" }],
    skills: [{ title: "Technical Skills", skills: ["Python", "SQL"] }],
    unknown_admin_flag: true
  });
  assert.equal(result.name, "Alex Example");
  assert.equal(result.projects[0].name, "Portfolio");
  assert.deepEqual(result.skills[0].skills, ["Python", "SQL"]);
  assert.equal("unknown_admin_flag" in result, false);
});

test("resume backup validation rejects malformed lists and non-string fields", () => {
  assert.throws(() => validateResumeData([]), /JSON object/i);
  assert.throws(() => validateResumeData({ socialMedia: "not-a-list" }), /Invalid list/i);
  assert.throws(() => validateResumeData({ name: 123 }), /Invalid field/i);
});

test("resume backup validation restricts profile image data URLs", () => {
  assert.throws(() => validateResumeData({ profilePicture: "javascript:alert(1)" }), /Profile picture/i);
  assert.throws(() => validateResumeData({ profilePicture: "data:image/png;base64," + "a".repeat(3_000_001) }), /Profile picture/i);
});

test("resume backup validation enforces list count and field length caps", () => {
  assert.throws(() => validateResumeData({ languages: Array(51).fill("English") }), /maximum 50 items/i);
  assert.throws(() => validateResumeData({ summary: "x".repeat(10001) }), /too long/i);
});
