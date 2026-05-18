import CustomNav from "@/components/commons/CustomNav";
import NotFound from "@/components/commons/NotFound";
import VisibilitySwitch from "@/components/commons/Switch/VisibilitySwitch";
import InstructorLayout from "@/components/layouts/InstructorLayout";
import EditCourse, { EditCourseTabsType } from "@/components/views/Instructor/Course/EditCourse/EditCourse";
import { useNProgress } from "@/hooks/use-nProgress";
import { getUnknownErrorMessage } from "@/libs/axios/error";
import courseQueries from "@/queries/course-queries";
import { addToast } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export async function getStaticPaths() {
  return { paths: [], fallback: "blocking" };
}

export async function getStaticProps({ params }: { params: { id: string } }) {
  return {
    props: { id: params.id },
  };
}

export default function EditCoursePage({ id }: { id: string }) {
  const [showPublished, setShowPublished] = useState(false);
  const { data, isPending, isError, error } = useQuery(courseQueries.options.getCourse(Number(id)));

  const router = useRouter();
  const tabsState = useState<EditCourseTabsType>("basic");

  useEffect(() => {
    if (isError && error)
      addToast({
        color: "danger",
        title: "Error",
        description: getUnknownErrorMessage(error),
      });
  }, [isError, error]);

  useEffect(() => {
    const tabs = router.query.tabs as EditCourseTabsType;
    const validTabs: EditCourseTabsType[] = ["basic", "tags", "media", "pricing", "curriculum"];
    if (tabs && validTabs.includes(tabs)) {
      tabsState[1](tabs);
    }
  }, [router.query.tabs]);

  useNProgress(isPending);

  if (!data && !isPending) return <NotFound error={error} />;
  if (data) {
    return (
      <InstructorLayout
        customNav={
          <CustomNav
            onClick={() => router.push("/instructor/dashboard/course")}
            title="Edit Course"
            endContent={
              <VisibilitySwitch {...{ showPublished, setShowPublished, disabled: data.publishedAt == null }} />
            }
          />
        }
        active="My Courses">
        <EditCourse id={Number(id)} tabsState={tabsState} showPublished={showPublished} />
      </InstructorLayout>
    );
  }
}
