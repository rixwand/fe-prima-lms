import { AddSectionsFormRhf } from "@/components/views/Instructor/Course/EditCourse/Forms/form.type";
import { useForm } from "react-hook-form";
import AddSectionsForm from ".";
import FormWrapperDialog from "../../Dialog/FormDialog";

export default function useModalAddSections({
  createSection,
}: {
  createSection: (props: { sections: string[]; courseId?: number }) => void | Promise<unknown>;
}) {
  const addSectionsMethod = useForm<AddSectionsFormRhf>({ defaultValues: { sections: [] } });

  const openAddSectionsModal = () => {
    addSectionsMethod.setValue("sections", [{ title: "New Section" }]);
    FormWrapperDialog({
      content: <AddSectionsForm rhfMethods={addSectionsMethod} />,
      onSubmit: () => {
        const newSections = addSectionsMethod.getValues("sections").flatMap(s => s.title);
        if (newSections.length == 0) return;
        return createSection({ sections: newSections });
      },
      title: "Add Sections",
      formSubscribe: addSectionsMethod.subscribe,
      fieldName: "sections",
    });
  };

  return { openAddSectionsModal };
}
