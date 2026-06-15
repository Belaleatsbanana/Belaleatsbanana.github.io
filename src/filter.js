export const ALLOWED_CATEGORIES = [
  "Deep learning",
  "Machine learning",
  "Data Engineering",
  "Frontend",
  "Backend",
  "Fullstack",
  "Artificial Intelligence",
  "Software Quality Assurance",
  "NLP",
  "Software Engineering",
  "Side Hustle",
  "Data Science",
  "Data Analysis"
];

function safeCategories(project) {
  if (Array.isArray(project.categories)) return project.categories;
  if (typeof project.category === "string" && project.category) return [project.category];
  return [];
}

function safeTools(project) {
  return Array.isArray(project.tools) ? project.tools : [];
}

export function getCategories() {
  return [...ALLOWED_CATEGORIES];
}

export function getToolsForCategory(projects, category) {
  const scopedProjects = category
    ? projects.filter((project) => safeCategories(project).includes(category))
    : projects;
  return [...new Set(scopedProjects.flatMap(safeTools))].sort();
}

export function filterProjects(projects, category, selectedTools) {
  const byCategory = category
    ? projects.filter((project) => safeCategories(project).includes(category))
    : projects;
  if (!selectedTools.length) return byCategory;
  return byCategory.filter((project) =>
    selectedTools.every((tool) => safeTools(project).includes(tool))
  );
}
