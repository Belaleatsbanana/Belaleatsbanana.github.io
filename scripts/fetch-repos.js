import fs from "node:fs/promises";

const ALLOWED_CATEGORIES = new Set([
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
]);

function inferTools(repo) {
  const tools = new Set();
  if (repo.language) tools.add(repo.language);
  return [...tools];
}

function inferCategories(repo) {
  const categories = new Set();
  const haystack = `${repo.name || ""} ${repo.description || ""}`.toLowerCase();
  const language = (repo.language || "").toLowerCase();

  if (["javascript", "typescript", "html", "css", "vue", "react"].includes(language)) {
    categories.add("Frontend");
  }
  if (["go", "java", "kotlin", "c#", "rust"].includes(language) || haystack.includes("api")) {
    categories.add("Backend");
  }
  if (["python", "jupyter notebook", "r"].includes(language)) {
    categories.add("Data Science");
  }
  if (haystack.includes("machine learning") || haystack.includes("ml") || haystack.includes("model")) {
    categories.add("Machine learning");
  }
  if (haystack.includes("deep learning") || haystack.includes("neural") || haystack.includes("dl")) {
    categories.add("Deep learning");
  }
  if (haystack.includes("nlp")) {
    categories.add("NLP");
  }
  if (haystack.includes("analysis") || haystack.includes("analytics")) {
    categories.add("Data Analysis");
  }
  if (haystack.includes("pipeline") || haystack.includes("etl") || haystack.includes("warehouse")) {
    categories.add("Data Engineering");
  }
  if (haystack.includes("quality assurance") || haystack.includes("qa") || haystack.includes("test")) {
    categories.add("Software Quality Assurance");
  }
  if (haystack.includes("ai") || haystack.includes("artificial intelligence")) {
    categories.add("Artificial Intelligence");
  }
  if (categories.has("Frontend") && categories.has("Backend")) {
    categories.add("Fullstack");
  }
  if (haystack.includes("blog") || haystack.includes("portfolio") || haystack.includes("startup")) {
    categories.add("Side Hustle");
  }
  if (!categories.size) {
    categories.add("Software Engineering");
  } else if (!categories.has("Software Engineering")) {
    categories.add("Software Engineering");
  }

  return [...categories].filter((category) => ALLOWED_CATEGORIES.has(category));
}

export function mapRepoToProject(repo) {
  return {
    name: repo.name,
    description: repo.description || "",
    categories: inferCategories(repo),
    tools: inferTools(repo),
    repoUrl: repo.html_url,
    demoUrl: repo.homepage || ""
  };
}

async function fetchRepos(username) {
  const url = `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`;
  const response = await fetch(url, {
    headers: { Accept: "application/vnd.github+json" }
  });

  if (!response.ok) {
    throw new Error(`GitHub API request failed with status ${response.status}`);
  }

  const repos = await response.json();
  return repos.filter((repo) => !repo.fork);
}

async function writeProjectsFile(projects) {
  const contents = `export const projects = ${JSON.stringify(projects, null, 2)};\n`;
  await fs.writeFile(new URL("../data/projects.js", import.meta.url), contents, "utf8");
}

async function main() {
  const username = "Belaleatsbanana";
  const repos = await fetchRepos(username);
  const projects = repos.map(mapRepoToProject).sort((a, b) => a.name.localeCompare(b.name));
  await writeProjectsFile(projects);
  console.log(`Wrote ${projects.length} projects to data/projects.js`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
