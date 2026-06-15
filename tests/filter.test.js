import test from "node:test";
import assert from "node:assert/strict";
import {
  ALLOWED_CATEGORIES,
  filterProjects,
  getCategories,
  getToolsForCategory
} from "../src/filter.js";

const sampleProjects = [
  { name: "A", categories: ["Frontend", "Fullstack"], tools: ["HTML", "CSS"] },
  { name: "B", categories: ["Backend", "Software Engineering"], tools: ["Node.js", "JavaScript"] },
  { name: "C", categories: ["Data Science", "Machine learning"], tools: ["Python", "Pandas"] }
];

test("returns fixed allowed taxonomy", () => {
  assert.deepEqual(getCategories(sampleProjects), ALLOWED_CATEGORIES);
});

test("returns tools from projects matching selected category", () => {
  assert.deepEqual(getToolsForCategory(sampleProjects, "Frontend"), ["CSS", "HTML"]);
});

test("filters by category inclusion then all selected tools", () => {
  const filtered = filterProjects(sampleProjects, "Backend", ["Node.js", "JavaScript"]);
  assert.deepEqual(filtered.map((project) => project.name), ["B"]);
});

test("applies tool AND matching only within the selected category", () => {
  const filtered = filterProjects(sampleProjects, "Frontend", ["JavaScript"]);
  assert.deepEqual(filtered.map((project) => project.name), []);
});

test("handles missing categories safely", () => {
  const withMissingCategories = [{ name: "NoCategories", tools: ["HTML"] }];
  const filtered = filterProjects(withMissingCategories, "Frontend", []);
  assert.equal(filtered.length, 0);
});

test("handles missing tools arrays safely", () => {
  const withMissingTools = [{ name: "NoTools", categories: ["Frontend"] }];
  const filtered = filterProjects(withMissingTools, "Frontend", ["HTML"]);
  assert.equal(filtered.length, 0);
});
