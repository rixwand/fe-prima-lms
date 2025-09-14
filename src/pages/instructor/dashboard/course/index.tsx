import InstructorLayout from "@/components/layouts/InstructorLayout";
import InstructorCourse from "@/components/views/Instructor/Course";
import CreateCourse from "@/components/views/Instructor/Course/CreateCourse";
import CreateCourseNav from "@/components/views/Instructor/Course/CreateCourse/NavBar/Navbar";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

type PageParams = "course" | "create" | undefined;

export default function InstructorDashboard() {
  const router = useRouter();
  const pageParam = router.query.page as PageParams;
  const [page, setPage] = useState<"course" | "create">("course");
  useEffect(() => {
    if (pageParam && pageParam == "create") {
      setPage("create");
    }
  }, [pageParam]);
  return (
    <InstructorLayout
      active="MyCourses"
      {...(page === "course"
        ? { navTitle: "Course Management" }
        : { customNav: <CreateCourseNav {...{ page, setPage }} /> })}>
      {page == "course" ? (
        <InstructorCourse onCreate={() => setPage("create")} />
      ) : (
        <CreateCourse
          onCancel={() => {
            setPage("course");
            router.replace(router.route);
          }}
          onFinish={() => {}}
        />
      )}
    </InstructorLayout>
  );
}
