import type { CourseSection } from "./simple-editor-layout.types";

export const DEFAULT_COURSE_SECTIONS: CourseSection[] = [
  {
    id: 1,
    title: "Getting Started",
    position: 1,
    lessons: [
      { id: 101, slug: "welcome", title: "Welcome to the Course", position: 1, isPreview: true },
      { id: 102, slug: "setup", title: "Environment Setup", position: 2, isPreview: false },
      { id: 103, slug: "tour", title: "Editor Walkthrough", position: 3, isPreview: false },
    ],
  },
  {
    id: 2,
    title: "Core Concepts",
    position: 2,
    lessons: [
      { id: 201, slug: "content-blocks", title: "Working with Content Blocks", position: 1, isPreview: false },
      { id: 202, slug: "media", title: "Media Embeds", position: 2, isPreview: false },
      { id: 203, slug: "collaboration", title: "Collaboration Tips", position: 3, isPreview: false },
    ],
  },
  {
    id: 3,
    title: "Going Further",
    position: 3,
    lessons: [
      { id: 301, slug: "customization", title: "Customizing the Editor", position: 1, isPreview: false },
      { id: 302, slug: "publishing", title: "Publishing Workflows", position: 2, isPreview: false },
      { id: 303, slug: "automation", title: "Automation Ideas", position: 3, isPreview: false },
    ],
  },
];

export const DEFAULT_COURSE_TITLE = "Tiptap Editor Course";
