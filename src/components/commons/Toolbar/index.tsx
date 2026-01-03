import { StateType } from "@/types/Helper";
import { VisuallyHidden, useSwitch } from "@heroui/react";
import { LuLayoutGrid, LuLayoutList, LuSearch } from "react-icons/lu";

export default function Toolbar({
  handleSearch,
  setLayout,
}: {
  handleSearch: VoidFn;
  setLayout: StateType<"grid" | "list">[1];
}) {
  const { Component, slots, isSelected, getBaseProps, getInputProps, getWrapperProps } = useSwitch({
    onValueChange(v) {
      if (v) setLayout("list");
      else setLayout("grid");
    },
  });
  return (
    <div className="@2xl:absolute @2xl:w-fit w-full mb-3 top-0 right-2 flex gap-x-2">
      <div className="relative w-full">
        <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          name="search"
          placeholder="Search courses..."
          className="pl-10 pr-4 py-2 rounded-xl bg-white ring-1 ring-slate-200 focus:ring-primary-500 focus:outline-none max-w-full w-full"
          onChange={handleSearch}
        />
      </div>
      <Component {...getBaseProps()}>
        <VisuallyHidden>
          <input {...getInputProps()} />
        </VisuallyHidden>
        <div
          {...getWrapperProps()}
          className={slots.wrapper({
            class: [
              "h-10 w-fit px-3",
              "flex items-center justify-center gap-2",
              "rounded-xl border border-slate-200 bg-white hover:bg-slate-50 ",
              "group-data-[selected=true]:border-slate-200 group-data-[selected=true]:bg-white group-data-[selected=true]:text-inherit",
            ],
          })}>
          {isSelected ? <LuLayoutGrid size={16} /> : <LuLayoutList size={16} />} View
        </div>
      </Component>
    </div>
  );
}
