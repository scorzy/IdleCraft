import { createContext, ReactElement, use, useCallback, useId, useState } from 'react'
import { CheckIcon, ChevronDownIcon } from 'lucide-react'
import { Label } from '@radix-ui/react-label'
import { useMeasure } from 'react-use'
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
    label?: ReactElement | ReactElement[] | string
    filter?: boolean
}

export function ComboBoxResponsive({ children, triggerContent, selectedId, label, filter }: ComboBoxResponsiveProps) {
    const [open, setOpen] = useState(false)
    const isDesktop = useMediaQuery('(min-width: 768px)')
    const { t } = useTranslations()

    const [ref, { width }] = useMeasure<HTMLDivElement>()

    const id = useId()

    const trigger = (
        <Button variant="outline" className="w-full justify-start">
            {triggerContent || <span className="text-muted-foreground">{t.selectPlaceholder}</span>}
            <ChevronDownIcon className="ml-auto size-4 opacity-50" />
        </Button>
    )

    const items = (
        <ComboBoxResponsiveContext value={setOpen}>
            <ComboBoxResponsiveSelectedIdContext value={selectedId}>
                <ItemList filter={filter}>{children}</ItemList>
            </ComboBoxResponsiveSelectedIdContext>
        </ComboBoxResponsiveContext>
    )

    const labelUi = label ? (
        <Label htmlFor={id} className="mb-1 block">
            {label}
        </Label>
    ) : null

    if (isDesktop) {
        return (
            <div ref={ref}>
                {labelUi}
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild id={id}>
                        {trigger}
                    </PopoverTrigger>
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

function ItemList({ children, filter }: { children?: React.ReactNode; filter?: boolean }) {
    const { t } = useTranslations()
    const itemCount = Array.isArray(children) ? children.length : children ? 1 : 0
    const showFilter = (filter || filter === undefined) && itemCount > 1

    return (
        <Command>
            {showFilter && <CommandInput placeholder={t.FilterDots} />}
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
    onSelect?: () => void
    icon?: React.ReactNode
    rightSlot?: React.ReactNode
    bottomSlot?: React.ReactNode
    selected?: boolean
}) => {
    const setOpen = use(ComboBoxResponsiveContext)
    const selectedId = use(ComboBoxResponsiveSelectedIdContext)

    const selected = selectedId !== null && props.value === selectedId

    const handleSelect = useCallback(() => {
        if (onSelect) onSelect()
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

export const ComboBoxTrigger = ({
    children,
    className,
    icon,
    rightSlot,
    bottomSlot,
    ...props
}: React.ComponentProps<typeof CommandItem> & {
    icon?: React.ReactNode
    rightSlot?: React.ReactNode
    bottomSlot?: React.ReactNode
    selected?: boolean
}) => {
    const selectedId = use(ComboBoxResponsiveSelectedIdContext)
    const selected = selectedId !== null && props.value === selectedId

    return (
        <div
            className={cn(
                className,
                'data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0'
            )}
        >
            {icon && <span className="mr-2">{icon}</span>}
            <div className="flex flex-col">
                {children}
                {bottomSlot && <div className="text-muted-foreground mt-2 text-sm leading-none">{bottomSlot}</div>}
            </div>
            <span className="ml-auto flex items-center gap-2">
                {rightSlot}
                <CheckIcon className={cn('text-muted-foreground', { invisible: !selected })} />
            </span>
        </div>
    )
}
