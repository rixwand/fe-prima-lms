import { Dispatch, SetStateAction } from "react";
import { HiMenuAlt2 } from "react-icons/hi";

export default function NavbarDashboard({
  title,
  setCollapsed,
  setOpen,
}: {
  title: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setCollapsed: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur">
      <div className="w-full px-5 bg-white/50 h-16 text-slate-700 flex items-center gap-3">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setOpen(true);
              setCollapsed(false);
            }} // toggle sidebar
            className="md:hidden block"
            aria-label="Open menu">
            <HiMenuAlt2 size={24} />
          </button>
          <div>
            <p className="font-semibold leading-tight">{title}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
