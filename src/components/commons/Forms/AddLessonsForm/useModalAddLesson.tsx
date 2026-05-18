import { AddSectionItemsFormRhf } from "@/components/views/Instructor/Course/EditCourse/Forms/form.type";
import { useForm } from "react-hook-form";
import FormWrapperDialog from "../../Dialog/FormDialog";
import AddLessonsForm from "./";

export default function useModalAddLessons({
  createLessons,
}: {
  createLessons: (newLessons: { title: string; type: SectionItemType }[]) => void | Promise<unknown>;
}) {
  const addLessonsMethods = useForm<AddSectionItemsFormRhf>();
  const opneAddLessonModal = () => {
    addLessonsMethods.setValue("items", [{ title: "New Item", type: "LESSON" }]);
    FormWrapperDialog({
      formSubscribe: addLessonsMethods.subscribe,
      fieldName: "items",
      content: <AddLessonsForm rhfMethods={addLessonsMethods} />,
      title: "Add Lessons",
      onSubmit() {
        const newLessons = addLessonsMethods.getValues().items;
        if (newLessons.length == 0) return;
        return createLessons(newLessons.map(({ title, type }) => ({ title, type })));
      },
    });
  };

  return { opneAddLessonModal };
}
