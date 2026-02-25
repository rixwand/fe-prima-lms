// import { Skeleton, cn } from "@heroui/react";
// import { ChangeEvent, ReactNode, useState } from "react";
// import { ControllerRenderProps, FieldValues, Path } from "react-hook-form";
// import { FaEye, FaEyeSlash } from "react-icons/fa6";
// type InputType = "text" | "password" | "email";
// interface ITextField<T extends FieldValues, K extends Path<T> = Path<T>> {
//   id: K;
//   label?: string;
//   type?: InputType;
//   placeholder?: string;
//   autoComplete?: string;
//   required?: boolean;
//   error?: ReactNode;
//   field?: ControllerRenderProps<T, K>;
//   defaultValue?: string;
//   disabled?: boolean;
//   isLoading?: boolean;
//   onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
// }

// const TextField = <T extends FieldValues, K extends Path<T> = Path<T>>({
//   id,
//   label,
//   type = "text",
//   placeholder = "",
//   autoComplete,
//   error,
//   field,
//   disabled = false,
//   defaultValue,
//   isLoading = false,
//   onChange,
// }: ITextField<T, K>) => {
//   const [isVisible, setIsVisible] = useState(false);

//   const toggleVisibility = () => {
//     setIsVisible(isVisible => !isVisible);
//   };
//   return (
//     <div className="grid gap-1">
//       {label && (
//         <label htmlFor={id} className="text-sm font-medium text-slate-700">
//           {label}
//         </label>
//       )}
//       {isLoading ? (
//         <Skeleton className="rounded-xl w-full h-[38px]" />
//       ) : (
//         <div className="relative">
//           <input
//             id={id}
//             name={id}
//             type={isVisible ? "text" : type}
//             placeholder={placeholder}
//             autoComplete={autoComplete}
//             disabled={disabled}
//             onChange={onChange}
//             className={cn([
//               "rounded-xl w-full border px-3 py-2 text-sm outline-none transition focus:ring-2 bg-white disabled:bg-slate-50/50 disabled:text-slate-700",
//               error
//                 ? "text-danger placeholder-danger border-danger focus:ring-rose-300"
//                 : "text-slate-900 placeholder-slate-400 border-slate-200 focus:ring-blue-100",
//             ])}
//             value={defaultValue}
//             {...field}
//           />
//           {type === "password" && field?.value ? (
//             <button
//               onClick={toggleVisibility}
//               className="focus:outline-hidden absolute place-self-end mr-4 mb-2 cursor-pointer"
//               type="button">
//               {isVisible ? (
//                 <FaEye className="text-lg text-blue-600" />
//               ) : (
//                 <FaEyeSlash className="text-lg text-blue-600" />
//               )}
//             </button>
//           ) : null}
//         </div>
//       )}

//       {/* error slot */}
//       {error ? (
//         <p id={`${id}-error`} className="mt-0.5 text-xs text-rose-600">
//           {error}
//         </p>
//       ) : null}
//     </div>
//   );
// };

// export default TextField;

import cn from "@/libs/utils/cn";
import { Skeleton } from "@heroui/react";
import { ChangeEvent, ReactNode, useMemo, useState } from "react";
import { ControllerRenderProps, FieldValues, Path } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";

type InputType = "text" | "password" | "email" | "number";
type InputValue<T extends InputType | undefined> = T extends "number" ? number : string;

type NativeInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "name" | "id" | "type" | "value" | "defaultValue" | "onChange"
>;

export interface ITextField<T extends FieldValues, K extends Path<T> = Path<T>> extends NativeInputProps {
  id: K;
  label?: string;
  type?: InputType;
  error?: ReactNode;
  field?: ControllerRenderProps<T, K>;
  value?: string;
  defaultValue?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  isLoading?: boolean;
  classNames?: { wrapper?: string[] | string; input?: string[] | string };
}

const TextField = <T extends FieldValues, K extends Path<T> = Path<T>>({
  id,
  label,
  type = "text",
  placeholder = "",
  autoComplete,
  error,
  field,
  isLoading = false,
  disabled = false,
  value,
  defaultValue,
  onChange,
  classNames,
  ...rest
}: ITextField<T, K>) => {
  const [isVisible, setIsVisible] = useState(false);

  const inputType = useMemo<React.HTMLInputTypeAttribute>(() => {
    if (type === "password") return isVisible ? "text" : "password";
    return type;
  }, [type, isVisible]);

  const composedOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    field?.onChange?.(e);
    onChange?.(e);
  };

  const resolvedValue = field ? (field.value ?? "") : value !== undefined ? value : undefined;

  return (
    <div className={cn(["grid gap-1"], classNames?.wrapper)}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-slate-700">
          {label}
        </label>
      )}

      {isLoading ? (
        <Skeleton className="rounded-xl w-full h-[38px]" />
      ) : (
        <div className="relative">
          <input
            id={id as string}
            name={id as string}
            type={inputType}
            placeholder={placeholder}
            autoComplete={
              autoComplete ?? (type === "email" ? "email" : type === "password" ? "current-password" : "on")
            }
            disabled={disabled}
            onChange={composedOnChange}
            value={resolvedValue}
            defaultValue={field ? undefined : defaultValue}
            onBlur={field?.onBlur}
            ref={field?.ref}
            className={cn(
              [
                "rounded-xl w-full border px-3 py-2 text-sm outline-none transition focus:ring-2 bg-white disabled:bg-slate-50/50 disabled:text-slate-700",
                error
                  ? "text-danger placeholder-danger border-danger focus:ring-rose-300"
                  : "text-slate-900 placeholder-slate-400 border-slate-200 focus:ring-blue-100",
              ],
              classNames?.input,
            )}
            {...rest}
          />

          {type === "password" && (field?.value ?? value ?? defaultValue) ? (
            <button
              type="button"
              onClick={() => setIsVisible(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              aria-label={isVisible ? "Hide password" : "Show password"}
              tabIndex={-1}>
              {isVisible ? (
                <FaEye className="text-lg text-blue-600" />
              ) : (
                <FaEyeSlash className="text-lg text-blue-600" />
              )}
            </button>
          ) : null}
        </div>
      )}

      {error ? (
        <p id={`${id}-error`} className="mt-0.5 text-xs text-rose-600">
          {error}
        </p>
      ) : null}
    </div>
  );
};

export default TextField;
