'use client'

import * as React from 'react'
import { Combobox as ComboboxPrimitive } from '@base-ui/react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group'
import { Label } from '@/components/ui/label'
import { useMediaQuery } from '@/hooks/use-media-query'
import { useTranslations } from '@/msg/useTranslations'
import { ChevronDownIcon, XIcon, CheckIcon } from 'lucide-react'

const Combobox = ComboboxPrimitive.Root

function ComboboxValue({ ...props }: ComboboxPrimitive.Value.Props) {
    return <ComboboxPrimitive.Value data-slot="combobox-value" {...props} />
}

function ComboboxTrigger({ className, children, ...props }: ComboboxPrimitive.Trigger.Props) {
    return (
        <ComboboxPrimitive.Trigger
            data-slot="combobox-trigger"
            className={cn("[&_svg:not([class*='size-'])]:size-4", className)}
            {...props}
        >
            {children}
            <ChevronDownIcon className="text-muted-foreground pointer-events-none size-4" />
        </ComboboxPrimitive.Trigger>
    )
}

function ComboboxClear({ className, ...props }: ComboboxPrimitive.Clear.Props) {
    return (
        <ComboboxPrimitive.Clear
            data-slot="combobox-clear"
            render={<InputGroupButton variant="ghost" size="icon-xs" />}
            className={cn(className)}
            {...props}
        >
            <XIcon className="pointer-events-none" />
        </ComboboxPrimitive.Clear>
    )
}

function ComboboxInput({
    className,
    children,
    disabled = false,
    showTrigger = true,
    showClear = false,
    ...props
}: ComboboxPrimitive.Input.Props & {
    showTrigger?: boolean
    showClear?: boolean
}) {
    return (
        <InputGroup className={cn('w-auto', className)}>
            <ComboboxPrimitive.Input render={<InputGroupInput disabled={disabled} />} {...props} />
            <InputGroupAddon align="inline-end">
                {showTrigger && (
                    <InputGroupButton
                        size="icon-xs"
                        variant="ghost"
                        render={<ComboboxTrigger />}
                        data-slot="input-group-button"
                        className="group-has-data-[slot=combobox-clear]/input-group:hidden data-pressed:bg-transparent"
                        disabled={disabled}
                    />
                )}
                {showClear && <ComboboxClear disabled={disabled} />}
            </InputGroupAddon>
            {children}
        </InputGroup>
    )
}

function ComboboxContent({
    className,
    side = 'bottom',
    sideOffset = 6,
    align = 'start',
    alignOffset = 0,
    anchor,
    ...props
}: ComboboxPrimitive.Popup.Props &
    Pick<ComboboxPrimitive.Positioner.Props, 'side' | 'align' | 'sideOffset' | 'alignOffset' | 'anchor'>) {
    return (
        <ComboboxPrimitive.Portal>
            <ComboboxPrimitive.Positioner
                side={side}
                sideOffset={sideOffset}
                align={align}
                alignOffset={alignOffset}
                anchor={anchor}
                className="isolate z-50"
            >
                <ComboboxPrimitive.Popup
                    data-slot="combobox-content"
                    data-chips={!!anchor}
                    className={cn(
                        'group/combobox-content relative max-h-(--available-height) w-(--anchor-width) max-w-(--available-width) min-w-[calc(var(--anchor-width)+--spacing(7))] origin-(--transform-origin) overflow-hidden rounded-md bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-[chips=true]:min-w-(--anchor-width) data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 *:data-[slot=input-group]:m-1 *:data-[slot=input-group]:mb-0 *:data-[slot=input-group]:h-8 *:data-[slot=input-group]:border-input/30 *:data-[slot=input-group]:bg-input/30 *:data-[slot=input-group]:shadow-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
                        className
                    )}
                    {...props}
                />
            </ComboboxPrimitive.Positioner>
        </ComboboxPrimitive.Portal>
    )
}

function ComboboxList({ className, ...props }: ComboboxPrimitive.List.Props) {
    return (
        <ComboboxPrimitive.List
            data-slot="combobox-list"
            className={cn(
                'no-scrollbar max-h-[min(calc(--spacing(72)---spacing(9)),calc(var(--available-height)---spacing(9)))] scroll-py-1 overflow-y-auto overscroll-contain p-1 data-empty:p-0',
                className
            )}
            {...props}
        />
    )
}

function ComboboxItem({ className, children, ...props }: ComboboxPrimitive.Item.Props) {
    return (
        <ComboboxPrimitive.Item
            data-slot="combobox-item"
            className={cn(
                "relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground not-data-[variant=destructive]:data-highlighted:**:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                className
            )}
            {...props}
        >
            {children}
            <ComboboxPrimitive.ItemIndicator
                render={
                    <span className="pointer-events-none absolute right-2 flex size-4 items-center justify-center" />
                }
            >
                <CheckIcon className="pointer-events-none" />
            </ComboboxPrimitive.ItemIndicator>
        </ComboboxPrimitive.Item>
    )
}

function ComboboxGroup({ className, ...props }: ComboboxPrimitive.Group.Props) {
    return <ComboboxPrimitive.Group data-slot="combobox-group" className={cn(className)} {...props} />
}

function ComboboxLabel({ className, ...props }: ComboboxPrimitive.GroupLabel.Props) {
    return (
        <ComboboxPrimitive.GroupLabel
            data-slot="combobox-label"
            className={cn('px-2 py-1.5 text-xs text-muted-foreground', className)}
            {...props}
        />
    )
}

function ComboboxCollection({ ...props }: ComboboxPrimitive.Collection.Props) {
    return <ComboboxPrimitive.Collection data-slot="combobox-collection" {...props} />
}

function ComboboxEmpty({ className, ...props }: ComboboxPrimitive.Empty.Props) {
    return (
        <ComboboxPrimitive.Empty
            data-slot="combobox-empty"
            className={cn(
                'hidden w-full justify-center py-2 text-center text-sm text-muted-foreground group-data-empty/combobox-content:flex',
                className
            )}
            {...props}
        />
    )
}

function ComboboxSeparator({ className, ...props }: ComboboxPrimitive.Separator.Props) {
    return (
        <ComboboxPrimitive.Separator
            data-slot="combobox-separator"
            className={cn('-mx-1 my-1 h-px bg-border', className)}
            {...props}
        />
    )
}

function ComboboxChips({
    className,
    ...props
}: React.ComponentPropsWithRef<typeof ComboboxPrimitive.Chips> & ComboboxPrimitive.Chips.Props) {
    return (
        <ComboboxPrimitive.Chips
            data-slot="combobox-chips"
            className={cn(
                'flex min-h-9 flex-wrap items-center gap-1.5 rounded-md border border-input bg-transparent bg-clip-padding px-2.5 py-1.5 text-sm shadow-xs transition-[color,box-shadow] focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 has-aria-invalid:border-destructive has-aria-invalid:ring-3 has-aria-invalid:ring-destructive/20 has-data-[slot=combobox-chip]:px-1.5 dark:bg-input/30 dark:has-aria-invalid:border-destructive/50 dark:has-aria-invalid:ring-destructive/40',
                className
            )}
            {...props}
        />
    )
}

function ComboboxChip({
    className,
    children,
    showRemove = true,
    ...props
}: ComboboxPrimitive.Chip.Props & {
    showRemove?: boolean
}) {
    return (
        <ComboboxPrimitive.Chip
            data-slot="combobox-chip"
            className={cn(
                'flex h-[calc(--spacing(5.5))] w-fit items-center justify-center gap-1 rounded-sm bg-muted px-1.5 text-xs font-medium whitespace-nowrap text-foreground has-disabled:pointer-events-none has-disabled:cursor-not-allowed has-disabled:opacity-50 has-data-[slot=combobox-chip-remove]:pr-0',
                className
            )}
            {...props}
        >
            {children}
            {showRemove && (
                <ComboboxPrimitive.ChipRemove
                    render={<Button variant="ghost" size="icon-xs" />}
                    className="-ml-1 opacity-50 hover:opacity-100"
                    data-slot="combobox-chip-remove"
                >
                    <XIcon className="pointer-events-none" />
                </ComboboxPrimitive.ChipRemove>
            )}
        </ComboboxPrimitive.Chip>
    )
}

function ComboboxChipsInput({ className, ...props }: ComboboxPrimitive.Input.Props) {
    return (
        <ComboboxPrimitive.Input
            data-slot="combobox-chip-input"
            className={cn('min-w-16 flex-1 outline-none', className)}
            {...props}
        />
    )
}

function useComboboxAnchor() {
    return React.useRef<HTMLDivElement | null>(null)
}

type ComboBoxResponsiveContextValue = {
    selectedId: string | null
    query: string
    setOpen: (open: boolean) => void
    registerVisible: (value: string, visible: boolean) => void
    unregisterVisible: (value: string) => void
}

const ComboBoxResponsiveContext = React.createContext<ComboBoxResponsiveContextValue | null>(null)

interface ComboBoxResponsiveProps {
    children?: React.ReactNode
    triggerContent?: React.ReactNode
    selectedId: string | null
    label?: React.ReactNode
    filter?: boolean
}

function ComboBoxResponsive({ children, triggerContent, selectedId, label, filter }: ComboBoxResponsiveProps) {
    const [open, setOpen] = React.useState(false)
    const [query, setQuery] = React.useState('')
    const [visibleItems, setVisibleItems] = React.useState<Record<string, boolean>>({})
    const isDesktop = useMediaQuery('(min-width: 768px)')
    const { t } = useTranslations()
    const id = React.useId()

    const showFilter = filter !== false && React.Children.count(children) > 1

    const handleOpenChange = React.useCallback((nextOpen: boolean) => {
        setOpen(nextOpen)
        if (!nextOpen) {
            setQuery('')
        }
    }, [])

    const registerVisible = React.useCallback((value: string, visible: boolean) => {
        setVisibleItems((current) => {
            if (current[value] === visible) {
                return current
            }

            return { ...current, [value]: visible }
        })
    }, [])

    const unregisterVisible = React.useCallback((value: string) => {
        setVisibleItems((current) => {
            if (!(value in current)) {
                return current
            }

            const next = { ...current }
            delete next[value]
            return next
        })
    }, [])

    const contextValue = React.useMemo(
        () => ({
            selectedId,
            query: showFilter ? query : '',
            setOpen: handleOpenChange,
            registerVisible,
            unregisterVisible,
        }),
        [selectedId, showFilter, query, handleOpenChange, registerVisible, unregisterVisible]
    )

    const visibleValues = Object.values(visibleItems)
    const showEmpty = visibleValues.length > 0 && visibleValues.every((visible) => !visible)

    const trigger = (
        <ComboboxPrimitive.Trigger
            id={id}
            render={<Button variant="outline" className="w-full justify-start text-left font-normal" />}
        >
            <span className="min-w-0 flex-1 truncate">
                {triggerContent || <span className="text-muted-foreground">{t.selectPlaceholder}</span>}
            </span>
            <ChevronDownIcon className="ml-auto size-4 shrink-0 opacity-50" />
        </ComboboxPrimitive.Trigger>
    )

    const items = (
        <ComboBoxResponsiveContext.Provider value={contextValue}>
            <ItemList filter={showFilter} showEmpty={showEmpty}>
                {children}
            </ItemList>
        </ComboBoxResponsiveContext.Provider>
    )

    const labelUi = label ? (
        <Label htmlFor={id} className="mb-1 block">
            {label}
        </Label>
    ) : null

    if (isDesktop) {
        return (
            <ComboboxPrimitive.Root
                open={open}
                onOpenChange={handleOpenChange}
                value={selectedId}
                inputValue={query}
                onInputValueChange={setQuery}
                inline={!isDesktop}
            >
                <div>
                    {labelUi}
                    {trigger}
                    <ComboboxContent>{items}</ComboboxContent>
                </div>
            </ComboboxPrimitive.Root>
        )
    }

    return (
        <ComboboxPrimitive.Root value={selectedId} inputValue={query} onInputValueChange={setQuery} inline={!isDesktop}>
            <div>
                {labelUi}
                {/*  */}
                <Drawer open={open} onOpenChange={handleOpenChange}>
                    <DrawerTrigger render={trigger} />
                    <DrawerContent>
                        <div className="mt-4 border-t">{items}</div>
                    </DrawerContent>
                </Drawer>
            </div>
        </ComboboxPrimitive.Root>
    )
}

function ItemList({
    children,
    filter,
    showEmpty,
}: {
    children?: React.ReactNode
    filter: boolean
    showEmpty: boolean
}) {
    const { t } = useTranslations()

    return (
        <>
            {filter && (
                <ComboboxInput
                    showTrigger={false}
                    showClear
                    placeholder={t.FilterDots}
                    className="border-input/30 bg-input/30 m-1 mb-0 h-8 shadow-none"
                />
            )}
            {showEmpty && <div className="text-muted-foreground w-full py-2 text-center text-sm">{t.NoResults}</div>}
            <ComboboxList className="data-empty:p-1">{children}</ComboboxList>
        </>
    )
}

type ComboBoxItemProps = Omit<ComboboxPrimitive.Item.Props, 'children' | 'value'> & {
    value: string
    children?: React.ReactNode
    onSelect?: () => void
    icon?: React.ReactNode
    rightSlot?: React.ReactNode
    bottomSlot?: React.ReactNode
    selected?: boolean
}

function ComboBoxItem({
    onSelect,
    onClick,
    children,
    className,
    icon,
    rightSlot,
    bottomSlot,
    selected: selectedProp,
    value,
    ...props
}: ComboBoxItemProps) {
    const context = React.useContext(ComboBoxResponsiveContext)
    const selected = selectedProp ?? (context?.selectedId !== null && context?.selectedId === value)
    const searchText = React.useMemo(
        () =>
            [value, getTextContent(children), getTextContent(bottomSlot)].filter(Boolean).join(' ').toLocaleLowerCase(),
        [value, children, bottomSlot]
    )
    const matches = !context?.query || searchText.includes(context.query.trim().toLocaleLowerCase())

    React.useEffect(() => {
        context?.registerVisible(value, matches)

        return () => {
            context?.unregisterVisible(value)
        }
    }, [context, value, matches])

    const handleClick = React.useCallback<NonNullable<ComboboxPrimitive.Item.Props['onClick']>>(
        (event) => {
            onClick?.(event)
            if (event.defaultPrevented) {
                return
            }

            onSelect?.()
            context?.setOpen(false)
        },
        [onClick, onSelect, context]
    )

    if (!matches) {
        return null
    }

    return (
        <ComboboxPrimitive.Item
            data-slot="combobox-item"
            className={cn(
                'relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-2 text-sm outline-hidden select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
                className
            )}
            value={value}
            onClick={handleClick}
            {...props}
        >
            {icon && <span className="mr-2 shrink-0">{icon}</span>}
            <div className="flex min-w-0 flex-1 flex-col">
                {children}
                {bottomSlot && <div className="text-muted-foreground mt-2 text-sm leading-none">{bottomSlot}</div>}
            </div>
            <span className="ml-auto flex shrink-0 items-center gap-2">
                {rightSlot}
                <CheckIcon className={cn('text-muted-foreground', { invisible: !selected })} />
            </span>
        </ComboboxPrimitive.Item>
    )
}

function ComboBoxTrigger({
    children,
    className,
    icon,
    rightSlot,
    bottomSlot,
    selected: selectedProp,
    value,
}: Pick<ComboBoxItemProps, 'children' | 'className' | 'icon' | 'rightSlot' | 'bottomSlot' | 'selected'> & {
    value?: string
}) {
    const context = React.useContext(ComboBoxResponsiveContext)
    const selected = selectedProp ?? (value != null && context?.selectedId === value)

    return (
        <div
            className={cn(
                'relative flex min-w-0 cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none select-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
                className
            )}
            data-selected={selected}
        >
            {icon && <span className="mr-2 shrink-0">{icon}</span>}
            <div className="flex min-w-0 flex-1 flex-col">
                {children}
                {bottomSlot && <div className="text-muted-foreground mt-2 text-sm leading-none">{bottomSlot}</div>}
            </div>
            <span className="ml-auto flex shrink-0 items-center gap-2">
                {rightSlot}
                <CheckIcon className={cn('text-muted-foreground', { invisible: !selected })} />
            </span>
        </div>
    )
}

function getTextContent(node: React.ReactNode): string {
    if (node == null || typeof node === 'boolean') {
        return ''
    }

    if (typeof node === 'string' || typeof node === 'number') {
        return String(node)
    }

    if (Array.isArray(node)) {
        return node.map(getTextContent).join(' ')
    }

    if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
        return getTextContent(node.props.children)
    }

    return ''
}

export {
    Combobox,
    ComboboxInput,
    ComboboxContent,
    ComboboxList,
    ComboboxItem,
    ComboboxGroup,
    ComboboxLabel,
    ComboboxCollection,
    ComboboxEmpty,
    ComboboxSeparator,
    ComboboxChips,
    ComboboxChip,
    ComboboxChipsInput,
    ComboboxTrigger,
    ComboboxValue,
    ComboBoxResponsive,
    ComboBoxItem,
    ComboBoxTrigger,
    useComboboxAnchor,
}
