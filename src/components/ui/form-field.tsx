"use client";

import * as React from "react";
import { type UseFormRegisterReturn } from "react-hook-form";
import { AlertCircle, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface OptionItem {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, type = "text", ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          "w-full min-h-[44px] px-4 py-2.5 rounded-[14px] bg-warm-white font-sans text-sm text-espresso placeholder:text-espresso/40",
          "border border-espresso/20 transition-all duration-200",
          "hover:border-espresso/40",
          "focus:outline-none focus:border-golden focus:ring-2 focus:ring-golden/25",
          "disabled:opacity-50 disabled:bg-cream/40 disabled:cursor-not-allowed",
          error &&
            "border-berry text-espresso focus:border-berry focus:ring-berry/20",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, rows = 4, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        rows={rows}
        className={cn(
          "w-full px-4 py-3 rounded-[14px] bg-warm-white font-sans text-sm text-espresso placeholder:text-espresso/40",
          "border border-espresso/20 transition-all duration-200 resize-y",
          "hover:border-espresso/40",
          "focus:outline-none focus:border-golden focus:ring-2 focus:ring-golden/25",
          "disabled:opacity-50 disabled:bg-cream/40 disabled:cursor-not-allowed",
          error &&
            "border-berry text-espresso focus:border-berry focus:ring-berry/20",
          className
        )}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  options?: OptionItem[];
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    { className, error, options, placeholder, children, ...props },
    ref
  ) => {
    return (
      <div className="relative w-full">
        <select
          ref={ref}
          className={cn(
            "w-full min-h-[44px] px-4 pr-10 py-2.5 rounded-[14px] bg-warm-white font-sans text-sm text-espresso",
            "border border-espresso/20 transition-all duration-200 appearance-none cursor-pointer",
            "hover:border-espresso/40",
            "focus:outline-none focus:border-golden focus:ring-2 focus:ring-golden/25",
            "disabled:opacity-50 disabled:bg-cream/40 disabled:cursor-not-allowed",
            error &&
              "border-berry text-espresso focus:border-berry focus:ring-berry/20",
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options
            ? options.map((opt) => (
                <option
                  key={String(opt.value)}
                  value={opt.value}
                  disabled={opt.disabled}
                >
                  {opt.label}
                </option>
              ))
            : children}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-espresso/60"
          aria-hidden="true"
        />
      </div>
    );
  }
);
Select.displayName = "Select";

export interface FormFieldProps {
  id?: string;
  name?: string;
  label?: React.ReactNode;
  helperText?: React.ReactNode;
  error?: string;
  required?: boolean;
  type?: "text" | "email" | "password" | "number" | "tel" | "url" | "textarea" | "select";
  options?: OptionItem[];
  placeholder?: string;
  register?: UseFormRegisterReturn;
  className?: string;
  inputClassName?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  defaultValue?: string | number | readonly string[];
  value?: string | number | readonly string[];
  onChange?: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >;
  rows?: number;
}

export function FormField({
  id: explicitId,
  name,
  label,
  helperText,
  error,
  required = false,
  type = "text",
  options,
  placeholder,
  register,
  className,
  inputClassName,
  children,
  disabled,
  defaultValue,
  value,
  onChange,
  rows = 4,
}: FormFieldProps) {
  const generatedId = React.useId();
  const fieldId = explicitId || register?.name || name || generatedId;
  const helperId = `${fieldId}-helper`;
  const errorId = `${fieldId}-error`;

  const ariaDescribedBy = [
    helperText ? helperId : null,
    error ? errorId : null,
  ]
    .filter(Boolean)
    .join(" ") || undefined;

  const sharedProps = {
    id: fieldId,
    name: register?.name || name,
    disabled: disabled || register?.disabled,
    placeholder,
    defaultValue,
    value,
    onChange: onChange || register?.onChange,
    onBlur: register?.onBlur,
    ref: register?.ref,
    error: Boolean(error),
    "aria-invalid": Boolean(error),
    "aria-describedby": ariaDescribedBy,
    "aria-required": required,
    required,
  };

  const renderControl = () => {
    if (children) {
      return children;
    }

    if (type === "textarea") {
      return (
        <Textarea
          {...sharedProps}
          rows={rows}
          className={inputClassName}
        />
      );
    }

    if (type === "select") {
      return (
        <Select
          {...sharedProps}
          options={options}
          placeholder={placeholder}
          className={inputClassName}
        />
      );
    }

    return (
      <Input
        {...sharedProps}
        type={type}
        className={inputClassName}
      />
    );
  };

  return (
    <div className={cn("w-full space-y-1.5 font-sans", className)}>
      {label && (
        <label
          htmlFor={fieldId}
          className="block text-sm font-medium text-espresso select-none"
        >
          {label}
          {required && (
            <span
              className="text-golden ml-1 font-semibold"
              aria-hidden="true"
            >
              *
            </span>
          )}
        </label>
      )}

      {renderControl()}

      {helperText && !error && (
        <p id={helperId} className="text-xs text-espresso/60 leading-normal">
          {helperText}
        </p>
      )}

      {error && (
        <p
          id={errorId}
          role="alert"
          className="flex items-center gap-1.5 text-xs font-medium text-berry leading-normal"
        >
          <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
