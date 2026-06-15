import test from "node:test";
import assert from "node:assert/strict";
import { sanitizeHref } from "../src/url-sanitizer.js";

test("allows absolute http/https URLs", () => {
  assert.equal(sanitizeHref("https://example.com/repo"), "https://example.com/repo");
  assert.equal(sanitizeHref("http://example.com/demo"), "http://example.com/demo");
});

test("allows safe relative URLs starting with ./ or /", () => {
  assert.equal(sanitizeHref("./demo"), "./demo");
  assert.equal(sanitizeHref("/projects/demo"), "/projects/demo");
});

test("rejects dangerous or unsupported URLs", () => {
  assert.equal(sanitizeHref("javascript:alert(1)"), "#");
  assert.equal(sanitizeHref("data:text/html;base64,abc"), "#");
  assert.equal(sanitizeHref("mailto:team@example.com"), "#");
});

test("rejects malformed, empty, and non-string URLs", () => {
  assert.equal(sanitizeHref(""), "#");
  assert.equal(sanitizeHref("   "), "#");
  assert.equal(sanitizeHref(null), "#");
  assert.equal(sanitizeHref(undefined), "#");
  assert.equal(sanitizeHref(123), "#");
});
