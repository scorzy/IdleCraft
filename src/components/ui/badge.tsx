import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { type VariantProps } from 'class-variance-authority'

import { badgeVariants } from './badgeVariants'
import { cn } from '@/lib/utils'

export function Badge({
    className,
    variant,
    size,
    asChild = false,
    ...props
}: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
    const Comp = asChild ? Slot : 'span'

    return <Comp data-slot="badge" className={cn(badgeVariants({ variant, size }), className)} {...props} />
}
