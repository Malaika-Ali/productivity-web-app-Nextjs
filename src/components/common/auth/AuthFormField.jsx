"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function AuthFormField({
    id,
    label,
    type = "text",
    placeholder = "",
    value,
    onChange,
    required = false,
    rightSlot,       // optional JSX rendered to the right of the label
    inputSlot,       // optional JSX overlaid inside the input (e.g. eye toggle)
    autoComplete,
    ...props
}) {
    return (
        <div className="flex flex-col gap-1.5">
            {/* Label row */}
            <div className="flex items-center justify-between">
                <Label
                    htmlFor={id}
                    className="text-[13.5px] font-bold text-gray-800"
                >
                    {label}
                </Label>
                {rightSlot && <div>{rightSlot}</div>}
            </div>

            {/* Input wrapper */}
            <div className="relative">
                <Input
                    id={id}
                    type={type}
                    placeholder={placeholder}
                    // value={value}
                    // onChange={onChange}
                    required={required}
                    autoComplete={autoComplete}
                    className={`
            h-12 rounded-xl border-gray-200 text-[14px] bg-white
            placeholder:text-gray-400
            focus-visible:ring-2 focus-visible:ring-purple-500/30
            focus-visible:border-purple-500
            transition-colors
            ${inputSlot ? "pr-11" : ""}
          `}
          {...props}
                />
                {/* Right-side slot inside input (e.g. eye icon) */}
                {inputSlot && (
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                        {inputSlot}
                    </div>
                )}
            </div>
        </div>
    );
}