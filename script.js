import { projects } from "./data/projects.js";
import { filterProjects, getCategories, getToolsForCategory } from "./src/filter.js";
import { sanitizeHref } from "./src/url-sanitizer.js";

const categoryFilter = document.getElementById("categoryFilter");
const toolsFilter = document.getElementById("toolsFilter");
const projectsRoot = document.getElementById("projects");
const emptyState = document.getElementById("emptyState");

let selectedCategory = "";
const selectedTools = new Set();

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderCategoryOptions() {
  categoryFilter.innerHTML = "";
  const categories = ["All", ...getCategories()];
  for (const category of categories) {
    const value = category === "All" ? "" : category;
    const count = value === ""
      ? projects.length
      : projects.filter(p => Array.isArray(p.categories) && p.categories.includes(value)).length;

    const chip = document.createElement("span");
    chip.className = "tool-chip" + (selectedCategory === value ? " selected" : "");

    const label = document.createElement("span");
    label.textContent = category;

    const badge = document.createElement("span");
    badge.className = "category-count";
    badge.textContent = count;

    chip.append(label, badge);
    chip.addEventListener("click", () => {
      selectedCategory = value;
      selectedTools.clear();
      renderCategoryOptions();
      renderToolOptions();
      renderProjects();
    });
    categoryFilter.append(chip);
  }
}

function renderToolOptions() {
  const tools = getToolsForCategory(projects, selectedCategory);
  for (const tool of [...selectedTools]) {
    if (!tools.includes(tool)) selectedTools.delete(tool);
  }

  toolsFilter.innerHTML = "";
  for (const tool of tools) {
    const input = document.createElement("input");
    input.type = "checkbox";
    input.value = tool;
    input.checked = selectedTools.has(tool);
    input.addEventListener("change", () => {
      if (input.checked) selectedTools.add(tool);
      else selectedTools.delete(tool);
      renderProjects();
    });

    const chip = document.createElement("label");
    chip.className = "tool-chip";
    chip.append(input, document.createTextNode(tool));
    toolsFilter.append(chip);
  }
}

function renderProjects() {
  const visibleProjects = filterProjects(projects, selectedCategory, [...selectedTools]);
  projectsRoot.innerHTML = visibleProjects
    .map(
      (project) => `<article class="project-row" data-repo="${escapeHtml(sanitizeHref(project.repoUrl))}">
  <div class="project-row-top">
    <h2>${escapeHtml(project.name)}</h2>
    <div class="project-links">
      <a href="${escapeHtml(sanitizeHref(project.repoUrl))}" target="_blank" rel="noreferrer">Repository</a>
      ${
        project.demoUrl
          ? `<a href="${escapeHtml(sanitizeHref(project.demoUrl))}" target="_blank" rel="noreferrer">Live demo</a>`
          : ""
      }
    </div>
  </div>
  <p class="project-description">${escapeHtml(project.description || "No description provided.")}</p>
  <p class="meta">Categories: ${escapeHtml(
    (Array.isArray(project.categories) ? project.categories : []).join(", ") || "None"
  )}</p>
  <p class="meta">Tools: ${escapeHtml((Array.isArray(project.tools) ? project.tools : []).join(", ") || "None")}</p>
</article>`
    )
    .join("");
  emptyState.classList.toggle("hidden", visibleProjects.length > 0);

  for (const card of projectsRoot.querySelectorAll(".project-row")) {
    card.addEventListener("click", (e) => {
      if (e.target.closest("a")) return;
      const url = card.dataset.repo;
      if (url) window.open(url, "_blank", "noreferrer");
    });
  }
}

renderCategoryOptions();
renderToolOptions();
renderProjects();

// ── Mobile filter drawer ──
const filtersToggle = document.getElementById("filtersToggle");
const filtersPanel  = document.getElementById("filtersPanel");
const filtersClose  = document.getElementById("filtersClose");

const backdrop = document.createElement("div");
backdrop.className = "filters-backdrop";
document.body.appendChild(backdrop);

function openFilters() {
  filtersPanel.classList.add("open");
  backdrop.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeFilters() {
  filtersPanel.classList.remove("open");
  backdrop.classList.remove("open");
  document.body.style.overflow = "";
}

filtersToggle.addEventListener("click", openFilters);
filtersClose.addEventListener("click", closeFilters);
backdrop.addEventListener("click", closeFilters);
