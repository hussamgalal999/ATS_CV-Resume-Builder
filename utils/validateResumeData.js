const MAX_ITEMS = 50;
const MAX_FIELD_LENGTH = 10000;
const STRING_FIELDS = ["name", "position", "contactInformation", "email", "address", "summary"];

const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);

const safeText = (value, field) => {
  if (typeof value !== "string") throw new Error(`Invalid field: ${field}`);
  if (value.length > MAX_FIELD_LENGTH) throw new Error(`Field is too long: ${field}`);
  return value;
};

const validateArray = (value, field) => {
  if (!Array.isArray(value) || value.length > MAX_ITEMS) {
    throw new Error(`Invalid list: ${field} (maximum ${MAX_ITEMS} items)`);
  }
  return value;
};

const validateObjectList = (value, field, fields) =>
  validateArray(value, field).map((item, index) => {
    if (!isObject(item)) throw new Error(`Invalid item: ${field}[${index}]`);
    const clean = {};
    for (const key of fields) {
      clean[key] = item[key] === undefined ? "" : safeText(item[key], `${field}[${index}].${key}`);
    }
    return clean;
  });

export const validateResumeData = (input) => {
  if (!isObject(input)) throw new Error("Resume backup must be a JSON object.");

  const result = {};
  for (const field of STRING_FIELDS) {
    result[field] = input[field] === undefined ? "" : safeText(input[field], field);
  }

  const picture = input.profilePicture === undefined ? "" : safeText(input.profilePicture, "profilePicture");
  if (picture && (!/^data:image\/(png|jpeg|jpg|webp);base64,/i.test(picture) || picture.length > 3_000_000)) {
    throw new Error("Profile picture must be a small PNG, JPEG, or WebP data image.");
  }
  result.profilePicture = picture;

  result.socialMedia = validateObjectList(input.socialMedia ?? [], "socialMedia", ["socialMedia", "link"]);
  result.education = validateObjectList(input.education ?? [], "education", ["school", "degree", "startYear", "endYear"]);
  result.workExperience = validateObjectList(input.workExperience ?? [], "workExperience", ["company", "position", "description", "keyAchievements", "startYear", "endYear"]);
  result.projects = validateObjectList(input.projects ?? [], "projects", ["name", "link", "description", "keyAchievements", "startYear", "endYear"]);
  result.skills = validateArray(input.skills ?? [], "skills").map((item, index) => {
    if (!isObject(item)) throw new Error(`Invalid item: skills[${index}]`);
    const title = safeText(item.title ?? "", `skills[${index}].title`);
    const items = validateArray(item.skills ?? [], `skills[${index}].skills`).map((skill, skillIndex) => safeText(skill, `skills[${index}].skills[${skillIndex}]`));
    return { title, skills: items };
  });
  result.languages = validateArray(input.languages ?? [], "languages").map((item, index) => safeText(item, `languages[${index}]`));
  result.certifications = validateArray(input.certifications ?? [], "certifications").map((item, index) => safeText(item, `certifications[${index}]`));

  return result;
};
