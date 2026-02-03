import FormWrapperDialog from "@/components/commons/Dialog/FormDialog";
import { confirmDialog } from "@/components/commons/Dialog/confirmDialog";
import { informationDialog } from "@/components/commons/Dialog/informationDialog";
import useCourse from "@/hooks/course/useCourse";
import { Input, Listbox, ListboxItem, Textarea, usePopoverContext } from "@heroui/react";
import { useRouter } from "next/router";
import { Fragment } from "react";
import { UseFormReturn, useForm } from "react-hook-form";
import {
  LuBookmark,
  LuFileArchive,
  LuFilePen,
  LuFileText,
  LuFileUp,
  LuGlobe,
  LuPencilLine,
  LuTrash2,
} from "react-icons/lu";

type NotesForm = { notes: string };

const InstructorListBoxAction = ({ courseStatus, courseId }: { courseStatus: string; courseId: number }) => {
  const { publishCourse, course, cancelPublishReq, hasPending, deleteCourse } = useCourse(courseId);
  const { state: menuState } = usePopoverContext();
  const notesMethods = useForm<NotesForm>();
  const router = useRouter();
  const PublishCourseForm = ({ methods: { register } }: { methods: UseFormReturn<NotesForm> }) => {
    return (
      <div className="space-y-4">
        <p className="text-slate-600 text-sm -mt-5 mb-10">Your request will be reviewen by admin</p>
        <Input
          type="text"
          disabled
          labelPlacement="outside"
          value={course?.metaDraft.title || "Unknown course"}
          label="Course"
        />
        <Textarea label="Notes" labelPlacement="outside" isClearable placeholder="(optional)" {...register("notes")} />
      </div>
    );
  };
  const onPublish = () => {
    FormWrapperDialog({
      title: "Publish Course Request",
      content: <PublishCourseForm methods={notesMethods} />,
      onSubmit: async () => publishCourse({ notes: notesMethods.getValues("notes"), id: courseId }),
    });
  };

  const onCancelPublishReq = () =>
    confirmDialog({
      title: `Cancel publish request`,
      desc: "This action cannot be undone. You will need to submit a new publish request if you wish to proceed in the future.",
      onConfirmed: () => cancelPublishReq(courseId),
      isLoading: hasPending,
    });

  const onDeleteCourse = () =>
    confirmDialog({
      title: `Delete Course "${course?.metaDraft.title}"`,
      desc: "This action cannot be undone. The entire course sections and lesson will be deleted",
      onConfirmed: () => deleteCourse(courseId),
      isLoading: hasPending,
    });

  const onShowNotes = () =>
    informationDialog({ title: "Course Publish Request Notes", desc: course?.publishRequest?.notes || "" });

  return (
    <Listbox variant="light" color="primary" aria-label="Actions" onAction={menuState.close}>
      {courseStatus == "DRAFT" || courseStatus == "REJECTED" ? (
        <Fragment>
          {courseStatus == "REJECTED" && (
            <ListboxItem onPress={onShowNotes} startContent={<LuFileText />} key="notes">
              Notes
            </ListboxItem>
          )}
          <ListboxItem onPress={onPublish} startContent={<LuGlobe />} key="approve">
            Publish
          </ListboxItem>
          <ListboxItem
            onPress={() => router.push(`/instructor/dashboard/edit-course/${course?.id}`)}
            startContent={<LuPencilLine />}
            key="edit">
            Edit
          </ListboxItem>
          <ListboxItem
            className="text-danger-400"
            color="danger"
            onPress={onDeleteCourse}
            startContent={<LuTrash2 />}
            key="delete">
            Delete
          </ListboxItem>
        </Fragment>
      ) : courseStatus == "PENDING" ? (
        <Fragment>
          <ListboxItem onPress={onShowNotes} startContent={<LuFileText />} key="notes">
            Notes
          </ListboxItem>
          <ListboxItem
            className="text-danger-400"
            color="danger"
            onPress={onCancelPublishReq}
            startContent={<LuBookmark />}
            key="cancel">
            Cancel Publish
          </ListboxItem>
        </Fragment>
      ) : (
        <Fragment>
          <ListboxItem
            onPress={onPublish}
            key="request-approval"
            startContent={<LuFileUp />}
            hidden={course?.metaDraft.requiresApproval != true}>
            Request Approval
          </ListboxItem>
          <ListboxItem
            onPress={() => router.push(`/instructor/dashboard/course/${course?.id}/review-changes`)}
            key="apply"
            startContent={<LuFilePen />}
            hidden={course?.canApplyTierB != true}>
            Apply Changes
          </ListboxItem>
          <ListboxItem
            onPress={() => router.push(`/instructor/dashboard/edit-course/${course?.id}`)}
            startContent={<LuPencilLine />}
            key="edit">
            Edit
          </ListboxItem>
          <ListboxItem onPress={onShowNotes} startContent={<LuFileText />} key="notes">
            Notes
          </ListboxItem>
          <ListboxItem
            className="text-danger-400"
            color="danger"
            onPress={e => {}}
            startContent={<LuFileArchive />}
            key="archive">
            Archive
          </ListboxItem>
        </Fragment>
      )}
    </Listbox>
  );
};

export default InstructorListBoxAction;
