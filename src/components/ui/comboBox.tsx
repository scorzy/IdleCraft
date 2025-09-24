import { createContext, use, useCallback, useEffect, useRef, useState } from 'react'
import { CheckIcon, ChevronDownIcon } from 'lucide-react'
import { Label } from '@radix-ui/react-label'
import { useMeasure, useRaf } from 'react-use'
import { useTranslations } from '../../msg/useTranslations'
import { cn } from '../../lib/utils'
import { DrawerTrigger, DrawerContent, Drawer } from './drawer'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { useMediaQuery } from '@/hooks/use-media-query'

const ComboBoxResponsiveContext = createContext<((open: boolean) => void) | null>(null)
const ComboBoxResponsiveSelectedIdContext = createContext<string | null>(null)

interface ComboBoxResponsiveProps {
    children?: React.ReactNode
    triggerContent?: React.ReactNode
    selectedId: string | null
    label?: string
}

export function ComboBoxResponsive({ children, triggerContent, selectedId, label }: ComboBoxResponsiveProps) {
    const [open, setOpen] = useState(false)
    const isDesktop = useMediaQuery('(min-width: 768px)')
    const { t } = useTranslations()

    const [ref, { width }] = useMeasure<HTMLDivElement>()

    const trigger = (
        <Button variant="outline" className="text-muted-foreground w-full justify-start">
            {triggerContent || t.selectPlaceholder}
            <ChevronDownIcon className="ml-auto size-4 opacity-50" />
        </Button>
    )

    const items = (
        <ComboBoxResponsiveContext value={setOpen}>
            <ComboBoxResponsiveSelectedIdContext value={selectedId}>
                <ItemList>{children}</ItemList>
            </ComboBoxResponsiveSelectedIdContext>
        </ComboBoxResponsiveContext>
    )

    const labelUi = label ? <Label className="mb-1 block">{label}</Label> : null

    if (isDesktop) {
        return (
            <div ref={ref}>
                {labelUi}
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>{trigger}</PopoverTrigger>
                    <PopoverContent style={{ width }} className="p-0" align="start">
                        {items}
                    </PopoverContent>
                </Popover>
            </div>
        )
    }

    return (
        <div>
            {labelUi}
            <Drawer open={open} onOpenChange={setOpen}>
                <DrawerTrigger asChild>{trigger}</DrawerTrigger>
                <DrawerContent>
                    <div className="mt-4 border-t">{items}</div>
                </DrawerContent>
            </Drawer>
        </div>
    )
}

function ItemList({ children }: { children?: React.ReactNode }) {
    const { t } = useTranslations()
    // const itemCount = Array.isArray(children) ? children.length : children ? 1 : 0
    // const filter = itemCount > 3

    return (
        <Command>
            <CommandInput placeholder={t.FilterDots} />
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
    ...props
}: React.ComponentProps<typeof CommandItem> & {
    onSelect: () => void
    icon?: React.ReactNode
    rightSlot?: React.ReactNode
    bottomSlot?: React.ReactNode
    selected?: boolean
}) => {
    const setOpen = use(ComboBoxResponsiveContext)
    const selectedId = use(ComboBoxResponsiveSelectedIdContext)

    const selected = selectedId !== null && props.value === selectedId

    const handleSelect = useCallback(() => {
        onSelect()
        if (setOpen) setOpen(false)
    }, [onSelect, setOpen])

    return (
        <CommandItem className={className} {...props} onSelect={handleSelect}>
            {icon && <span className="mr-2">{icon}</span>}
            <div className="flex flex-col">
                {children}
                {bottomSlot && <div className="text-muted-foreground mt-2 text-sm leading-none">{bottomSlot}</div>}
            </div>
            <span className="ml-auto flex items-center gap-2">
                {rightSlot}
                <CheckIcon className={cn('text-muted-foreground', { invisible: !selected })} />
            </span>
        </CommandItem>
    )
}
