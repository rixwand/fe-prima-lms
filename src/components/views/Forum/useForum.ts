import useEditForum from "@/hooks/course/useEditForum";
import { confirmDialog } from "@/libs/utils/confirm-dialog";
import { useState } from "react";

export const sortingType: { key: SortingType; label: string }[] = [
  {
    key: "DATE",
    label: "Date Time",
  },
  {
    key: "ACTIVITY",
    label: "Activity",
  },
];

const useForum = () => {
  const [sortBy, setSortBy] = useState<SortingType>("DATE");
  const { releaseForum } = useEditForum();
  const handleReleaseForum = () =>
    confirmDialog({
      title: "Release Forum?",
      desc: "This forum will be released for public and anyone can create a discussion",
      onConfirmed: () => releaseForum(),
    });
  return {
    setSortBy,
    sortBy,
    handleReleaseForum,
  };
};
export default useForum;
