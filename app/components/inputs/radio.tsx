"use client";

import { Label } from "@/components/ui/label";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

interface RadioProps {
  id: string;
  label: string;
  type?: string;
  disabled?: boolean;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  group: string;
}

const RadioInput: React.FC<RadioProps> = ({
  id,
  label,
  type,
  disabled,
  required,
  register,
  errors,
  group,
}) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-center ps-4 border border-gray-200 rounded dark:border-gray-700">
        <label
          htmlFor={id}
          className={`flex gap-2 w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300 ${
            errors[group] ? "text-rose-500" : "text-slate-500"
          }`}
        >
          <input
            id={id}
            type="radio"
            value={id}
            disabled={disabled}
            {...register(group, { required })}
            required
            className={`w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600
            ${errors[group] ? "border-rose-400" : "border-marker:slate-300"} ${
              errors[group] ? "focus:border-rose-400" : "focus:border-slate-300"
            }
            `}
          />
          {label}
        </label>
      </div>
    </div>
  );
};

export default RadioInput;
