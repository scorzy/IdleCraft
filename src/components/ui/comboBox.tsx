import { useMediaQuery } from '@/hooks/use-media-query'
import { Button } from '@/components/ui/button'
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useState } from 'react'
import { Icons, IconsData } from '../../icons/Icons'
import { useTranslations } from '../../msg/useTranslations'

export type ComboBoxValue = {
    value: string
    label: string
    iconId?: Icons
}
export type ComboBoxList = {
    title: string
    list: ComboBoxValue[]
}

export function ComboBoxResponsive(props: {
    selectedValues: ComboBoxValue | null | undefined
    setSelectedValue: (status: ComboBoxValue | null) => void
    values: ComboBoxList[]
}) {
    const { selectedValues, setSelectedValue, values } = props
    const [open, setOpen] = useState(false)
    const isDesktop = useMediaQuery('(min-width: 768px)')
    const { t } = useTranslations()

    if (isDesktop) {
        return (
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                        {selectedValues ? (
                            <>
                                {selectedValues.iconId && (
                                    <span className="mr-2 h-4 w-4">{IconsData[selectedValues.iconId]}</span>
                                )}
                                {selectedValues.label}
                            </>
                        ) : (
                            <>{t.Select}</>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0" align="start">
                    <StatusList setOpen={setOpen} setSelectedStatus={setSelectedValue} values={values} />
                </PopoverContent>
            </Popover>
        )
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                    {selectedValues ? (
                        <>
                            {selectedValues.iconId && (
                                <span className="mr-2 h-4 w-4">{IconsData[selectedValues.iconId]}</span>
                            )}
                            {selectedValues.label}
                        </>
                    ) : (
                        <>{t.Select}</>
                    )}
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <div className="mt-4 border-t">
                    <StatusList setOpen={setOpen} setSelectedStatus={setSelectedValue} values={values} />
                </div>
            </DrawerContent>
        </Drawer>
    )
}

function StatusList({
    setOpen,
    setSelectedStatus,
    values,
}: {
    setOpen: (open: boolean) => void
    setSelectedStatus: (status: ComboBoxValue | null) => void
    values: ComboBoxList[]
}) {
    const { t } = useTranslations()
    const tot = values.reduce((a, b) => a + b.list.length, 0)
    if (tot === 0)
        return (
            <Command>
                <CommandGroup heading={t.Empty}></CommandGroup>
            </Command>
        )

    return (
        <Command>
            <CommandInput placeholder={t.FilterDots} />
            <CommandList>
                {values.map((group) => (
                    <CommandGroup heading={group.title} key={group.title}>
                        {group.list.map((status) => (
                            <CommandItem
                                key={status.value}
                                value={status.value}
                                onSelect={() => {
                                    setSelectedStatus(status)
                                    setOpen(false)
                                }}
                            >
                                {status.iconId && <span className="mr-2 h-4 w-4">{IconsData[status.iconId]}</span>}
                                {status.label}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                ))}
            </CommandList>
        </Command>
    )
}
