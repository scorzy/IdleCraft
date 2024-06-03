import { useMediaQuery } from '@/hooks/use-media-query'
import { Button } from '@/components/ui/button'
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useCallback, useMemo, useState } from 'react'
import { useTranslations } from '../../msg/useTranslations'
import { cn } from '../../lib/utils'
import { CheckIcon } from '@radix-ui/react-icons'

export type MyComboBoxList<T> = {
    title: string
    list: T[]
}

export function MyComboBoxResponsive<T>(props: {
    selectedValue: T | null | undefined
    setSelectedValue: (item: T | null) => void
    values: MyComboBoxList<T>[]
    render: (data: T) => React.ReactNode
    getId: (item: T) => string
}) {
    const { selectedValue, setSelectedValue, values, render, getId } = props
    const [open, setOpen] = useState(false)
    const isDesktop = useMediaQuery('(min-width: 768px)')
    const { t } = useTranslations()

    const isEmpty = useMemo(() => values.reduce((a, b) => a + b.list.length, 0) === 0, [values])
    const showFilter = useMemo(() => values.reduce((a, b) => a + b.list.length, 0) >= 10, [values])

    const button = (
        <Button variant="outline" className="w-full justify-start">
            {selectedValue ? render(selectedValue) : <>{t.Select}</>}
        </Button>
    )
    const list = isEmpty ? (
        <Command>
            <CommandGroup heading={t.Empty}></CommandGroup>
        </Command>
    ) : (
        <Command>
            {showFilter && <CommandInput placeholder={t.FilterDots} />}
            <ComboList<T>
                setOpen={setOpen}
                setSelectedValue={setSelectedValue}
                values={values}
                selectedValue={selectedValue}
                render={render}
                getId={getId}
            />
        </Command>
    )

    if (isDesktop) {
        return (
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>{button}</PopoverTrigger>
                <PopoverContent className="w-[300px] p-0" align="start">
                    {list}
                </PopoverContent>
            </Popover>
        )
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>{button}</DrawerTrigger>
            <DrawerContent>
                <div className="mt-4 border-t">{list}</div>
            </DrawerContent>
        </Drawer>
    )
}

function ComboList<T>({
    getId,
    selectedValue,
    setOpen,
    setSelectedValue,
    values,
    render,
}: {
    getId: (item: T) => string
    setOpen: (open: boolean) => void
    selectedValue: T | null | undefined
    setSelectedValue: (item: T | null) => void
    values: MyComboBoxList<T>[]
    render: (data: T) => React.ReactNode
}) {
    return (
        <CommandList>
            {values.map((group) => (
                <CommandGroup heading={group.title} key={group.title}>
                    {group.list.map((item) => (
                        <MyCommandItem
                            key={getId(item)}
                            id={getId(item)}
                            item={item}
                            render={render}
                            setOpen={setOpen}
                            selectedValue={selectedValue}
                            setSelectedValue={setSelectedValue}
                        />
                    ))}
                </CommandGroup>
            ))}
        </CommandList>
    )
}

function MyCommandItem<T>(props: {
    item: T
    id: string
    render: (data: T) => React.ReactNode
    setOpen: (open: boolean) => void
    selectedValue: T | null | undefined
    setSelectedValue: (item: T | null) => void
}) {
    const { item, id, render, setOpen, selectedValue, setSelectedValue } = props

    const onClick = useCallback(() => {
        setSelectedValue(item)
        setOpen(false)
    }, [setSelectedValue, setOpen, id])

    return (
        <CommandItem value={id} onSelect={onClick}>
            {render(item)}
            <CheckIcon className={cn('ml-auto h-4 w-4', id === selectedValue ? 'opacity-100' : 'opacity-0')} />
        </CommandItem>
    )
}
