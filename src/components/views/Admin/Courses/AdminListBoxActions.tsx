import { Listbox, ListboxItem } from "@heroui/react";
import { useOverlayTriggerState } from "@react-stately/overlays";
import { Fragment } from "react";
import { LuCircleX, LuFileCheck2, LuFileText, LuGlobeLock } from "react-icons/lu";

const AdminListBoxAction = ({ courseStatus, courseId }: { courseStatus: string; courseId: number }) => {
  const menuState = useOverlayTriggerState({ defaultOpen: false });

  return (
    <Listbox variant="light" color="primary" aria-label="Actions" onAction={menuState.close}>
      {courseStatus == "PENDING" ? (
        <Fragment>
          <ListboxItem onPress={e => {}} startContent={<LuFileCheck2 />} key="approve">
            Approve
          </ListboxItem>
          <ListboxItem onPress={e => {}} startContent={<LuFileText />} key="notes">
            Notes
          </ListboxItem>
          <ListboxItem
            className="text-danger-400"
            color="danger"
            onPress={e => {}}
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
