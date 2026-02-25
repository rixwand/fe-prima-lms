import { useRouter } from "next/router";
import { ReactNode } from "react";
import { LuArrowLeft } from "react-icons/lu";

const CustomNav = ({ title, onClick, endContent }: { title: string; onClick?: VoidFn; endContent?: ReactNode }) => {
  const router = useRouter();
  return (
    <header className="sticky top-0 z-40 backdrop-blur shadow-sm">
      <div className="w-full px-5 bg-white/50 h-16 flex justify-between items-center gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={
              onClick ||
              (() => {
                router.back();
              })
            }
            className="cursor-pointer">
            <LuArrowLeft />
          </button>
          <div>
            <p className="font-semibold leading-tight">{title}</p>
          </div>
        </div>
        {endContent}
      </div>
    </header>
  );
};

export default CustomNav;
