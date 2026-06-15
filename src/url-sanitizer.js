export function sanitizeHref(value) {
  if (typeof value !== "string") return "#";

  const trimmed = value.trim();
  if (!trimmed) return "#";

  if (trimmed.startsWith("./")) return trimmed;
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) return trimmed;

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") return trimmed;
  } catch {
    return "#";
  }

  return "#";
}
