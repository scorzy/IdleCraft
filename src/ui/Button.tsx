import clsx from 'clsx'
import { UiVariants } from './UiVariants'

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: UiVariants }> = ({
    ...props
}) => {
    const { className, children } = props
    let { variant } = props
    if (variant === undefined) variant = UiVariants.Primary
    return (
        <button {...props} className={clsx('theme btn ', variant, className)}>
            {children}
        </button>
    )
}
