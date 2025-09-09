import { cn } from "@heroui/react";
import { ReactNode, useState } from "react";
import { ControllerRenderProps, FieldValues, Path } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
interface ITextField<T extends FieldValues, K extends Path<T> = Path<T>> {
  id: K;
  label?: string;
  type?: "text" | "password" | "email";
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  error?: ReactNode;
  field?: ControllerRenderProps<T, K>;
  defaultValue?: string;
  disabled?: boolean;
}

const TextField = <T extends FieldValues, K extends Path<T> = Path<T>>({
  id,
  label,
  type = "text",
  placeholder = "",
  autoComplete,
  error,
  field,
  disabled = false,
  defaultValue,
}: ITextField<T, K>) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(isVisible => !isVisible);
  };
  return (
    <div className="grid gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          name={id}
          type={isVisible ? "text" : type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          className={cn([
            "rounded-xl w-full border px-3 py-2 text-sm outline-none transition focus:ring-2 bg-white disabled:bg-slate-50/50 disabled:text-slate-700",
            error
              ? "text-danger placeholder-danger border-danger focus:ring-rose-300"
              : "text-slate-900 placeholder-slate-400 border-slate-200 focus:ring-blue-100",
          ])}
          value={defaultValue}
          {...field}
        />
        {type === "password" && field?.value ? (
          <button
            onClick={toggleVisibility}
            className="focus:outline-hidden absolute place-self-end mr-4 mb-2 cursor-pointer"
            type="button">
            {isVisible ? <FaEye className="text-lg text-blue-600" /> : <FaEyeSlash className="text-lg text-blue-600" />}
          </button>
        ) : null}
      </div>
      {/* error slot */}
      {error ? (
        <p id={`${id}-error`} className="mt-0.5 text-xs text-rose-600">
          {error}
        </p>
      ) : null}
    </div>
  );
};

export default TextField;
