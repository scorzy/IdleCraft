import { createContext, use, useCallback, useState } from 'react'
import { CheckIcon } from 'lucide-react'
import { useTranslations } from '../../msg/useTranslations'
import { DrawerTrigger, DrawerContent, Drawer } from './drawer'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { useMediaQuery } from '@/hooks/use-media-query'

const ComboBoxResponsiveContext = createContext<((open: boolean) => void) | null>(null)

interface ComboBoxResponsiveProps {
    children?: React.ReactNode
    triggerContent?: React.ReactNode
}

export function ComboBoxResponsive({ children, triggerContent }: ComboBoxResponsiveProps) {
    const [open, setOpen] = useState(false)
    const isDesktop = useMediaQuery('(min-width: 768px)')

    const trigger = (
        <Button variant="outline" className="w-full justify-start">
            {triggerContent || 'Select...'}
        </Button>
    )

    if (isDesktop) {
        return (
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>{trigger}</PopoverTrigger>
                <PopoverContent className="w-[300px] p-0" align="start">
                    <ComboBoxResponsiveContext value={setOpen}>
                        <ItemList>{children}</ItemList>
                    </ComboBoxResponsiveContext>
                </PopoverContent>
            </Popover>
        )
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>{trigger}</DrawerTrigger>
            <DrawerContent>
                <div className="mt-4 border-t">
                    <ComboBoxResponsiveContext value={setOpen}>
                        <ItemList>{children}</ItemList>
                    </ComboBoxResponsiveContext>
                </div>
            </DrawerContent>
        </Drawer>
    )
}

function ItemList({ children }: { children?: React.ReactNode }) {
    const { t } = useTranslations()
    const itemCount = Array.isArray(children) ? children.length : children ? 1 : 0
    const filter = itemCount > 3

    return (
        <Command shouldFilter={filter}>
            {filter && <CommandInput placeholder={t.FilterDots} />}
            <CommandList>
                <CommandEmpty>{t.NoResults}</CommandEmpty>
                <CommandGroup>{children}</CommandGroup>
            </CommandList>
        </Command>
    )
}

export const ComboBoxItem = ({
    onSelect,
    children,
    className,
    icon,
    rightSlot,
    bottomSlot,
    selected,
    ...props
}: React.ComponentProps<typeof CommandItem> & {
    onSelect: () => void
    icon?: React.ReactNode
    rightSlot?: React.ReactNode
    bottomSlot?: React.ReactNode
    selected?: boolean
}) => {
    const setOpen = use(ComboBoxResponsiveContext)

    const handleSelect = useCallback(() => {
        onSelect()
        if (setOpen) setOpen(false)
    }, [onSelect, setOpen])

    return (
        <CommandItem className={className} {...props} onSelect={handleSelect}>
            {icon && <span className="mr-2">{icon}</span>}
            <div className="flex flex-col">
                {children}
                {bottomSlot && <div className="text-muted-foreground text-sm">{bottomSlot}</div>}
            </div>
            <span className="ml-auto flex items-center gap-2">
                {rightSlot}
                {selected && <CheckIcon />}
            </span>
        </CommandItem>
    )
}
