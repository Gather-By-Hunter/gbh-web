import type {
  FC,
  HTMLInputAutoCompleteAttribute,
  HTMLInputTypeAttribute,
} from "react";

interface InputFieldProps {
  label: string;
  id: string;
  name: string;
  type: HTMLInputTypeAttribute;
  autoComplete: HTMLInputAutoCompleteAttribute;
  required?: boolean;
}

export const InputField: FC<InputFieldProps> = ({
  label,
  id,
  name,
  type,
  autoComplete,
  required = false,
}) => {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium leading-6 text-gray-900 text-left"
      >
        {label}
      </label>
      <div className="mt-2">
        <input
          id={id}
          name={name}
          type={type}
          autoComplete={autoComplete}
          required={required}
          className="block bg-gbh-white w-full rounded-md border-0 pl-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gbh-gold sm:text-sm sm:leading-6"
        />
      </div>
    </div>
  );
};
