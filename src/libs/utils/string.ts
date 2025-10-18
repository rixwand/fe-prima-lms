export function toSlug(str: string) {
  return str.toLowerCase().trim().replace(/\s+/g, "_");
}

export function fromSlug(str: string) {
  return str
    .split("_")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export const formatDate = (iso: string) => new Date(iso).toLocaleDateString();

export function getYouTubeEmbedUrl(url: string) {
  const videoIdMatch = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return videoIdMatch ? `https://www.youtube.com/embed/${videoIdMatch[1]}` : null;
}

export const trimEdges = (v: unknown) => (typeof v === "string" ? v.trim() : v);
