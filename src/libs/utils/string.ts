import { CourseCard } from "@/components/commons/Cards/CourseCard3";

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

export function avgRating(list: CourseCard[]) {
  if (!list.length) return "-";
  const avg = list.reduce((a, b) => a + b.rating, 0) / list.length;
  return avg.toFixed(2);
}
