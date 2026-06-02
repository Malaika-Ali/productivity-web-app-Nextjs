"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function AuthFormField({
    id,
    label,
    type = "text",
    placeholder = "",
    rightSlot,       // optional JSX rendered to the right of the label
    inputSlot,       // optional JSX overlaid inside the input (e.g. eye toggle)
    autoComplete,
    error,
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
                    autoComplete={autoComplete}
                    className={`
            h-12 rounded-xl border-gray-200 text-[14px] bg-white
            placeholder:text-gray-400
            focus-visible:ring-2 
            
            transition-colors duration-200 ease-in-out
              ${error
                            ? "border-red-500 focus-visible:ring-red-500/20 focus-visible:border-red-500"
                            : "border-gray-200 focus-visible:ring-purple-500/30 focus-visible:border-purple-500"
                        }
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