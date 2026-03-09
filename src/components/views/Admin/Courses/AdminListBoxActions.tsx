import FormWrapperDialog from "@/components/commons/Dialog/FormDialog";
import { confirmDialog } from "@/components/commons/Dialog/confirmDialog";
import { informationDialog } from "@/components/commons/Dialog/informationDialog";
import RejectCourseForm, { NotesForm } from "@/components/commons/Forms/RejectCourseForm/RejectCourseForm";
import usePublishCourses from "@/hooks/course/useListPublishRequest";
import { Listbox, ListboxItem, usePopoverContext } from "@heroui/react";
import { Fragment, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { LuCircleX, LuFileCheck2, LuFileText, LuGlobeLock } from "react-icons/lu";

const AdminListBoxAction = ({
  courseTitle,
  reqId,
  reqStatus,
  notes,
}: {
  courseTitle: string;
  reqId: number;
  notes?: string | null;
  reqStatus: PublishCourseStatus;
}) => {
  const { rejectCourse, approveCourse, pending } = usePublishCourses();
  const notesMethods = useForm<NotesForm>();
  const rejectPendingRef = useRef(pending.isPendingRejectCourse);
  const approvePendingRef = useRef(pending.isPendingApproveCourse);
  useEffect(() => {
    rejectPendingRef.current = pending.isPendingRejectCourse;
    approvePendingRef.current = pending.isPendingApproveCourse;
  }, [pending.isPendingApproveCourse, pending.isPendingRejectCourse]);
  // const { course } = useCourse(courseId);
  const { state: menuState } = usePopoverContext();
  const onCourseReject = () =>
    FormWrapperDialog({
      title: "Decline Course Publish Request",
      content: <RejectCourseForm methods={notesMethods} courseTitle={courseTitle} />,
      onSubmit: () => rejectCourse({ notes: notesMethods.getValues("notes"), reqId }),
      isLoading: () => rejectPendingRef.current,
    });

  const onShowNotes = () => informationDialog({ title: "Course Publish Request Notes", desc: notes || "" });

  const onCourseApprove = () =>
    confirmDialog({
      title: "Approve Course Publish Request",
      desc: "Are you sure you want to approve the course publish request?\nOnce approved, the course will be published and made visible to learners.",
      onConfirmed() {
        approveCourse(reqId);
      },
      isLoading: () => approvePendingRef.current,
    });

  return (
    <Listbox variant="light" color="primary" aria-label="Actions" onAction={menuState.close}>
      {reqStatus == "PENDING" ? (
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
