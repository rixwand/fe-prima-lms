import { useRouter } from "next/router";
import { LuArrowLeft } from "react-icons/lu";

const CustomNav = ({ title }: { title: string }) => {
  const router = useRouter();
  return (
    <header className="sticky top-0 z-40 backdrop-blur">
      <div className="w-full px-5 bg-white/50 h-16 flex items-center gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              router.back();
            }}
            className="cursor-pointer">
            <LuArrowLeft />
          </button>
          <div>
            <p className="font-semibold leading-tight">{title}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default CustomNav;
