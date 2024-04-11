import { forwardRef, OptgroupHTMLAttributes, OptionHTMLAttributes, SelectHTMLAttributes } from 'react'

export const NativeSelect = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
    ({ children, ...props }, ref) => (
        <select
            ref={ref}
            {...props}
            className="mt-0 block h-9 w-full rounded-md border border-input bg-popover px-4 py-2 font-normal text-popover-foreground shadow-sm transition-colors hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        >
            {children}
        </select>
    )
)
export const NativeOptgroup = forwardRef<HTMLOptGroupElement, OptgroupHTMLAttributes<HTMLOptGroupElement>>(
    ({ children, ...props }, ref) => (
        <optgroup ref={ref} className="p-1 font-normal" {...props}>
            {children}
        </optgroup>
    )
)
export const NativeOption = forwardRef<HTMLOptionElement, OptionHTMLAttributes<HTMLOptionElement>>(
    ({ children, ...props }, ref) => (
        <option
            ref={ref}
            className="p-1 leading-6  shadow-sm checked:bg-secondary checked:text-secondary-foreground hover:bg-secondary hover:text-secondary-foreground"
            {...props}
        >
            {children}
        </option>
    )
)
