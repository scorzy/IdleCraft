import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { MdClear } from 'react-icons/md'
import { Button } from './button'
import { Field, FieldLabel } from './field'
import { InputGroup, InputGroupInput, InputGroupAddon } from './input-group'
import clsx from 'clsx'

export const TextInput = memo(function TextInput({
    id,
    title,
    text,
    clearable,
    debounceMs = 300,
    onChange,
}: {
    id: string
    title: string
    text: string
    clearable: boolean
    debounceMs?: number
    onChange: (v: string) => void
}) {
    return (
        <TextInputField
            key={text}
            id={id}
            title={title}
            text={text}
            clearable={clearable}
            debounceMs={debounceMs}
            onChange={onChange}
        />
    )
})

const TextInputField = memo(function TextInputField({
    id,
    title,
    text,
    clearable,
    debounceMs,
    onChange,
}: {
    id: string
    title: string
    text: string
    clearable: boolean
    debounceMs: number
    onChange: (v: string) => void
}) {
    const [inputText, setInputText] = useState(text)
    const debounceTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
    const clearDebounce = useCallback(() => {
        if (debounceTimeout.current === undefined) return

        clearTimeout(debounceTimeout.current)
        debounceTimeout.current = undefined
    }, [])
    const emitChange = useCallback(
        (value: string) => {
            clearDebounce()

            if (debounceMs <= 0) {
                onChange(value)
                return
            }

            debounceTimeout.current = setTimeout(() => {
                onChange(value)
                debounceTimeout.current = undefined
            }, debounceMs)
        },
        [clearDebounce, debounceMs, onChange]
    )
    const clear = useCallback(() => {
        clearDebounce()
        setInputText('')
        onChange('')
    }, [clearDebounce, onChange])
    const onChangeInput = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value

            setInputText(value)
            emitChange(value)
        },
        [emitChange]
    )
    const showClear = clearable && inputText.length > 0

    useEffect(() => clearDebounce, [clearDebounce])

    return (
        <Field>
            <FieldLabel htmlFor={id}>{title}</FieldLabel>
            <InputGroup>
                <InputGroupInput id={id} value={inputText} onChange={onChangeInput} />

                {clearable && (
                    <InputGroupAddon
                        align="inline-end"
                        className={clsx({ 'opacity-0': !showClear }, 'transition-duration-200 transition-opacity')}
                    >
                        <Button variant="ghost" size="icon" onClick={clear}>
                            <MdClear />
                        </Button>
                    </InputGroupAddon>
                )}
            </InputGroup>
        </Field>
    )
})
