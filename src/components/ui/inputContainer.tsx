import { cn } from '../../lib/utils'

export function InputContainer({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div className={cn('flex flex-col gap-2', { className })} {...props}>
            {props.children}
        </div>
    )
}
