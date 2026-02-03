import FormWrapperDialog from "@/components/commons/Dialog/FormDialog";
import { confirmDialog } from "@/components/commons/Dialog/confirmDialog";
import { informationDialog } from "@/components/commons/Dialog/informationDialog";
import RejectCourseForm, { NotesForm } from "@/components/commons/Forms/RejectCourseForm/RejectCourseForm";
import useCourse from "@/hooks/course/useCourse";
import usePublishCourses from "@/hooks/course/useListPublishRequest";
import useDump from "@/hooks/use-dump";
import { Listbox, ListboxItem, usePopoverContext } from "@heroui/react";
import { Fragment } from "react";
import { useForm } from "react-hook-form";
import { LuCircleX, LuFileCheck2, LuFileText, LuGlobeLock } from "react-icons/lu";

const AdminListBoxAction = ({
  courseStatus,
  courseTitle,
  reqId,
  courseId,
}: {
  courseId: number;
  courseStatus: string;
  courseTitle: string;
  reqId: number;
}) => {
  const { rejectCourse, approveCourse } = usePublishCourses();
  const notesMethods = useForm<NotesForm>();
  const { course } = useCourse(courseId);
  useDump(course);
  const { state: menuState } = usePopoverContext();
  const onCourseReject = () =>
    FormWrapperDialog({
      title: "Decline Course Publish Request",
      content: <RejectCourseForm methods={notesMethods} courseTitle={courseTitle} />,
      // TODO: create a context for reqId
      onSubmit: async () => rejectCourse({ notes: notesMethods.getValues("notes"), reqId }),
    });

  const onShowNotes = () =>
    informationDialog({ title: "Course Publish Request Notes", desc: course?.publishRequest?.notes || "" });

  const onCourseApprove = () =>
    confirmDialog({
      title: "Approve Course Publish Request",
      desc: "Are you sure you want to approve the course publish request?\nOnce approved, the course will be published and made visible to learners.",
      onConfirmed() {
        approveCourse(reqId);
      },
    });

  return (
    <Listbox variant="light" color="primary" aria-label="Actions" onAction={menuState.close}>
      {courseStatus == "PENDING" ? (
        <Fragment>
          <ListboxItem onPress={onCourseApprove} startContent={<LuFileCheck2 />} key="approve">
            Approve
          </ListboxItem>
          <ListboxItem onPress={onShowNotes} startContent={<LuFileText />} key="notes">
            Notes
          </ListboxItem>
          <ListboxItem
            className="text-danger-400"
            color="danger"
            onPress={onCourseReject}
            startContent={<LuCircleX />}
            key="decline">
            Decline
          </ListboxItem>
        </Fragment>
      ) : (
        <ListboxItem
          className="text-danger-400"
          color="danger"
          onPress={e => {}}
          startContent={<LuGlobeLock />}
          key="new">
          Unpublish
        </ListboxItem>
      )}
    </Listbox>
  );
};

export default AdminListBoxAction;
