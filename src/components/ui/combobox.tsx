'use client'

import * as React from 'react'
import { CaretSortIcon, CheckIcon, MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { ReactNode, useState, useMemo, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

export interface ComboBoxOption {
    value: string
    label: string
    icon?: ReactNode
    rightSlot?: ReactNode
    content?: ReactNode // For complex content display
    searchText?: string // Optional additional text for searching
}

export interface ComboBoxProps {
    value?: string
    onValueChange?: (value: string) => void
    options: ComboBoxOption[]
    placeholder?: string
    searchPlaceholder?: string
    emptyMessage?: string
    disabled?: boolean
    className?: string
    size?: 'sm' | 'default'
    children?: ReactNode // For custom trigger content
}

function ComboBox({
    value,
    onValueChange,
    options,
    placeholder = 'Select option...',
    searchPlaceholder = 'Search...',
    emptyMessage = 'No results found.',
    disabled = false,
    className,
    size = 'default',
    children,
}: ComboBoxProps) {
    const [open, setOpen] = useState(false)
    const [searchValue, setSearchValue] = useState('')

    const filteredOptions = useMemo(() => {
        if (!searchValue) return options
        const search = searchValue.toLowerCase()
        return options.filter(
            (option) =>
                option.label.toLowerCase().includes(search) ||
                option.value.toLowerCase().includes(search) ||
                option.searchText?.toLowerCase().includes(search)
        )
    }, [options, searchValue])

    const selectedOption = useMemo(() => {
        return options.find((option) => option.value === value)
    }, [options, value])

    const handleSelect = useCallback(
        (optionValue: string) => {
            onValueChange?.(optionValue)
            setOpen(false)
            setSearchValue('')
        },
        [onValueChange]
    )

    const handleOpenChange = useCallback((newOpen: boolean) => {
        setOpen(newOpen)
        if (!newOpen) {
            setSearchValue('')
        }
    }, [])

    return (
        <Popover open={open} onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        'justify-between font-normal',
                        size === 'sm' ? 'h-8' : 'h-9',
                        !selectedOption && 'text-muted-foreground',
                        className
                    )}
                    disabled={disabled}
                >
                    {children || (
                        <span className="flex items-center gap-2">
                            {selectedOption?.icon}
                            {selectedOption?.label || placeholder}
                        </span>
                    )}
                    <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                <div className="border-b border-border px-3 py-2">
                    <div className="relative">
                        <MagnifyingGlassIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder={searchPlaceholder}
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                    {filteredOptions.length === 0 ? (
                        <div className="py-6 text-center text-sm text-muted-foreground">{emptyMessage}</div>
                    ) : (
                        <div className="p-1">
                            {filteredOptions.map((option) => (
                                <div
                                    key={option.value}
                                    className={cn(
                                        'relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground',
                                        option.value === value && 'bg-accent text-accent-foreground'
                                    )}
                                    onClick={() => handleSelect(option.value)}
                                >
                                    {option.content || (
                                        <>
                                            <span className="flex items-center gap-2 flex-1">
                                                {option.icon && <span className="shrink-0">{option.icon}</span>}
                                                <span className="truncate">{option.label}</span>
                                            </span>
                                            {option.rightSlot && <span className="shrink-0">{option.rightSlot}</span>}
                                        </>
                                    )}
                                    {option.value === value && (
                                        <CheckIcon className="ml-auto h-4 w-4 shrink-0" />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    )
}

export { ComboBox }