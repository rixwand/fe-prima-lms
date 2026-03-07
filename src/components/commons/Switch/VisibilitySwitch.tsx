import cn from "@/libs/utils/cn";
import { Dispatch, SetStateAction } from "react";
import { LuBookmark, LuGlobe } from "react-icons/lu";
import { MySwitch } from "../CustomHeroui/MySwitch";

type Props = {
  showPublished: boolean;
  setShowPublished: Dispatch<SetStateAction<boolean>>;
  disabled?: boolean;
};
const VisibilitySwitch = ({ setShowPublished, showPublished, disabled = false }: Props) => (
  <span
    className={cn(
      "flex items-center gap-x-1.5 py-1 px-1.5 rounded-full",
      // showPublished ? "bg-success" : "bg-primary",
    )}>
    <p className="text-slate-700 uppercase mr-2 ml-1">{showPublished ? "Published" : "Draft"}</p>
    <MySwitch
      isDisabled={disabled}
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

export default VisibilitySwitch;
