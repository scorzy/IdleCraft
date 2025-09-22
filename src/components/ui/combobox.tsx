'use client'

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

interface ComboBoxTriggerProps {
    selectedOption?: ComboBoxOption
    placeholder: string
    children?: ReactNode
    open: boolean
    disabled: boolean
    className?: string
    size: 'sm' | 'default'
}

function ComboBoxTrigger({ 
    selectedOption, 
    placeholder, 
    children, 
    open, 
    disabled, 
    className, 
    size 
}: ComboBoxTriggerProps) {
    return (
        <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
                'w-full justify-between font-normal',
                size === 'sm' ? 'h-8' : 'h-9',
                !selectedOption && 'text-muted-foreground',
                className
            )}
            disabled={disabled}
        >
            {children || (
                <span className="flex items-center gap-2">
                    {selectedOption?.icon}
                    <span className="truncate">
                        {selectedOption?.label || placeholder}
                    </span>
                </span>
            )}
            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
    )
}

interface ComboBoxSearchProps {
    searchValue: string
    onSearchChange: (value: string) => void
    searchPlaceholder: string
}

function ComboBoxSearch({ searchValue, onSearchChange, searchPlaceholder }: ComboBoxSearchProps) {
    return (
        <div className="border-b border-border px-3 py-2">
            <div className="relative">
                <MagnifyingGlassIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder={searchPlaceholder}
                    value={searchValue}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-8"
                />
            </div>
        </div>
    )
}

interface ComboBoxOptionItemProps {
    option: ComboBoxOption
    isSelected: boolean
    onSelect: (value: string) => void
}

function ComboBoxOptionItem({ option, isSelected, onSelect }: ComboBoxOptionItemProps) {
    return (
        <div
            className={cn(
                'relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground',
                isSelected && 'bg-accent text-accent-foreground'
            )}
            onClick={() => onSelect(option.value)}
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
            {isSelected && (
                <CheckIcon className="ml-auto h-4 w-4 shrink-0" />
            )}
        </div>
    )
}

interface ComboBoxContentProps {
    filteredOptions: ComboBoxOption[]
    selectedValue?: string
    onSelect: (value: string) => void
    emptyMessage: string
}

function ComboBoxContent({ filteredOptions, selectedValue, onSelect, emptyMessage }: ComboBoxContentProps) {
    return (
        <div className="max-h-[300px] overflow-y-auto">
            {filteredOptions.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">{emptyMessage}</div>
            ) : (
                <div className="p-1">
                    {filteredOptions.map((option) => (
                        <ComboBoxOptionItem
                            key={option.value}
                            option={option}
                            isSelected={option.value === selectedValue}
                            onSelect={onSelect}
                        />
                    ))}
                </div>
            )}
        </div>
    )
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
                <ComboBoxTrigger
                    selectedOption={selectedOption}
                    placeholder={placeholder}
                    open={open}
                    disabled={disabled}
                    className={className}
                    size={size}
                >
                    {children}
                </ComboBoxTrigger>
            </PopoverTrigger>
            <PopoverContent 
                className="w-[--radix-popover-trigger-width] p-0" 
                align="start"
                side="bottom"
                sideOffset={4}
            >
                <ComboBoxSearch
                    searchValue={searchValue}
                    onSearchChange={setSearchValue}
                    searchPlaceholder={searchPlaceholder}
                />
                <ComboBoxContent
                    filteredOptions={filteredOptions}
                    selectedValue={value}
                    onSelect={handleSelect}
                    emptyMessage={emptyMessage}
                />
            </PopoverContent>
        </Popover>
    )
}

export { ComboBox }