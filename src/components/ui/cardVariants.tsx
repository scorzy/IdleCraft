import { cva } from 'class-variance-authority'

export const cardVariants = cva('bg-card text-card-foreground flex flex-col rounded-xl border py-3 shadow-sm', {
    variants: {
        gap: {
            default: 'gap-3',
            sm: 'gap-1',
        },
    },
    defaultVariants: {
        gap: 'default',
    },
})
