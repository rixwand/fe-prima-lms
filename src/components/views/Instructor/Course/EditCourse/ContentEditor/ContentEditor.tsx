import NotFound from "@/components/commons/NotFound";
import PageHead from "@/components/commons/PageHead";
import SimpleEditorLayout from "@/components/layouts/SimpleEditorLayout";
import ForumThreads from "@/components/views/Forum/ForumThreads/ForumThreads";
import LessonEditor from "@/components/views/Instructor/Course/EditCourse/ContentEditor/LessonEditor/LessonEditor";
import QuizEditor from "@/components/views/Instructor/Course/EditCourse/ContentEditor/QuizEditor";
import NoLessonMessage from "@/components/views/Instructor/Course/EditCourse/NoLessonMessage";
import { useNProgress } from "@/hooks/use-nProgress";
import { useQueryError } from "@/hooks/use-query-error";
import { LessonEditorContext } from "@/libs/context/LessonEditorContext";
import courseQueries from "@/queries/course-queries";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
export default function ContentEditor({ id }: { id: number }) {
  const { data, isPending, isFetching, isError, error } = useQuery(courseQueries.options.getCourse(id));
  const itemState = useState<CourseSectionsItem | null>(null);
  const [activeItem] = itemState;
  const currentDirtyState = useState(false);

  const contextValue = useMemo(() => {
    if (activeItem) {
      return {
        ids: {
          courseId: id,
          sectionId: activeItem.sectionId,
          itemId: activeItem.id,
        },
        activeItem,
      };
    }
    return undefined;
  }, [activeItem, id]);

  useNProgress(isPending);
  useQueryError({ isError, error });
  useEffect(() => {
    console.log(data);
  }, [data]);
  if (!data && !isPending && !isFetching) {
    return <NotFound error={error} />;
  }

  if (!data) {
    return null;
  }
  const hasNoContent =
    !data.sections || data.sections.length === 0 || data.sections.every(s => !s.items || s.items.length === 0);

  if (data && !isPending && !isFetching && hasNoContent) {
    return (
      <LessonEditorContext.Provider value={{ ...contextValue, currentDirtyState, courseId: id }}>
        <PageHead title="Edit Course" />
        <SimpleEditorLayout courseTitle={data.metaDraft.title} itemState={[null, () => {}]} structure={[]}>
          <NoLessonMessage courseId={id} />
        </SimpleEditorLayout>
      </LessonEditorContext.Provider>
    );
  }

  return (
    <LessonEditorContext.Provider value={{ ...contextValue, currentDirtyState, courseId: id }}>
      <PageHead title="Edit Course" />
      <SimpleEditorLayout
        courseTitle={data.metaDraft.title || ""}
        itemState={itemState}
        structure={data.sections || []}>
        {!activeItem ? (
          <NoLessonMessage title="No Lesson Selected" desc="Select a lesson to start editing" />
        ) : activeItem.type == "LESSON" ? (
          <LessonEditor />
        ) : activeItem.type == "QUIZ" ? (
          <QuizEditor />
        ) : (
          <ForumThreads />
        )}
      </SimpleEditorLayout>
    </LessonEditorContext.Provider>
  );
}
