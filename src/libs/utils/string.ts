export function toSlug(str: string) {
  return str.toLowerCase().trim().replace(/\s+/g, "_");
}

export function fromSlug(str: string) {
  return str
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
