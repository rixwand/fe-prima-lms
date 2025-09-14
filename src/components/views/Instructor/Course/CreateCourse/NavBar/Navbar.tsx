import { useRouter } from "next/router";
import { Dispatch, SetStateAction } from "react";
import { LuArrowLeft } from "react-icons/lu";
type page = "course" | "create";
export default function CreateCourseNav({ setPage, page }: { page: page; setPage: Dispatch<SetStateAction<page>> }) {
  const router = useRouter();
  return (
    <header className="sticky top-0 z-40 backdrop-blur">
      <div className="w-full px-5 bg-white/50 h-16 flex items-center gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setPage("course");
              router.replace(router.route);
            }}>
            <LuArrowLeft />
          </button>
          <div>
            <p className="font-semibold leading-tight">Create Course</p>
          </div>
        </div>
      </div>
    </header>
  );
}
