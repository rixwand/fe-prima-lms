import { MySwitch } from "@/components/commons/CustomHeroui/MySwitch";
import CustomNav from "@/components/commons/CustomNav";
import NotFound from "@/components/commons/NotFound";
import InstructorLayout from "@/components/layouts/InstructorLayout";
import EditCourse, { EditCourseTabsType } from "@/components/views/Instructor/Course/EditCourse/EditCourse";
import { useNProgress } from "@/hooks/use-nProgress";
import { getErrorMessage } from "@/libs/axios/error";
import cn from "@/libs/utils/cn";
import courseQueries from "@/queries/course-queries";
import { addToast } from "@heroui/react";
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { LuBookmark, LuGlobe } from "react-icons/lu";

export async function getStaticPaths() {
  return { paths: [], fallback: "blocking" };
}

export async function getStaticProps({ params }: { params: { id: string } }) {
  const qc = new QueryClient();
  await qc.prefetchQuery(courseQueries.options.getCourse(Number(params.id)));
  return {
    props: { dehydratedState: dehydrate(qc), id: params.id },
    revalidate: 60, // ISR
  };
}

export default function EditCoursePage({ id }: { id: number }) {
  const [showPublished, setShowPublished] = useState(false);
  const { data, isPending, isError, error } = useQuery(courseQueries.options.getCourse(id));

  const SwitchMode = () => (
    <span
      className={cn(
        "flex items-center gap-x-1.5 py-1 px-1.5 rounded-full",
        // showPublished ? "bg-success" : "bg-primary",
      )}>
      <p className="text-slate-700 uppercase mr-2 ml-1">{showPublished ? "Published" : "Draft"}</p>
      <MySwitch
        classNames={{ wrapper: cn(showPublished ? "bg-success" : "bg-primary", "transition-background") }}
        color="white"
        defaultSelected
        thumbIcon={({ isSelected, className }) =>
          isSelected ? (
            <LuGlobe
              {...{
                className: cn([className, "text-success"]),
              }}
            />
          ) : (
            <LuBookmark
              {...{
                className: cn([className, "text-primary"]),
              }}
            />
          )
        }
        isSelected={showPublished}
        onValueChange={setShowPublished}
        endContent={<LuGlobe color="white" size={16} />}
        size="lg"
        startContent={<LuBookmark color="white" size={16} />}
      />
    </span>
  );
  const router = useRouter();
  const tabsState = useState<EditCourseTabsType>("basic");

  useEffect(() => {
    if (isError && error)
      addToast({
        color: "danger",
        title: "Error",
        description: isAxiosError(error) ? getErrorMessage(error) : error.message,
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

  if (!data && !isPending) return <NotFound />;
  if (data) {
    return (
      <InstructorLayout
        customNav={<CustomNav title="Edit Course" endContent={data.publishedAt && <SwitchMode />} />}
        active="My Courses">
        <EditCourse id={id} tabsState={tabsState} showPublished={showPublished} />
      </InstructorLayout>
    );
  }
}
