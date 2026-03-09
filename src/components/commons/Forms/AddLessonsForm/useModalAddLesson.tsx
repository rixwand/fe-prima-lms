import { AddLessonsFormRhf } from "@/components/views/Instructor/Course/EditCourse/Forms/form.type";
import { useForm } from "react-hook-form";
import FormWrapperDialog from "../../Dialog/FormDialog";
import AddLessonsForm from "./";

export default function useModalAddLessons({
  createLessons,
}: {
  createLessons: (newLessons: { title: string }[]) => void | Promise<unknown>;
}) {
  const addLessonsMethods = useForm<AddLessonsFormRhf>();
  const opneAddLessonModal = () => {
    addLessonsMethods.setValue("lessons", [{ title: "New Lesson" }]);
    FormWrapperDialog({
      formSubscribe: addLessonsMethods.subscribe,
      fieldName: "lessons",
      content: <AddLessonsForm rhfMethods={addLessonsMethods} />,
      title: "Add Lessons",
      onSubmit() {
        const newLessons = addLessonsMethods.getValues().lessons;
        if (newLessons.length == 0) return;
        return createLessons(newLessons);
      },
    });
  };

  return { opneAddLessonModal };
}
