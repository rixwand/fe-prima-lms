// export interface Lesson {
//   id: number;
//   slug: string;
//   title: string;
//   position: number;
//   isPreview: boolean;
// }

export interface CourseSection {
  id: number;
  title: string;
  position: number;
  lessons: Lesson[];
}
