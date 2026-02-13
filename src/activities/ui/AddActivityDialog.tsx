import { memo, ReactNode, useCallback } from 'react'
import { LuArrowDown, LuArrowUp } from 'react-icons/lu'
import { useTranslations } from '../../msg/useTranslations'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '../../components/ui/dialog'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Checkbox } from '../../components/ui/checkbox'
import { Field, FieldGroup, FieldLabel } from '../../components/ui/field'
import { ComboBoxItem, ComboBoxResponsive, ComboBoxTrigger } from '../../components/ui/comboBox'
import { Msg } from '../../msg/Msg'
import { useGameStore } from '../../game/state'
import {
    setActAutoRemove,
    setActRepetitions,
    setAddActType,
    setRemoveOtherActivities,
    setStartActNow,
} from '../activityFunctions'
import {
    selectRemoveOtherActivities,
    selectAddActType,
    selectStartActNow,
    selectActRepetitions,
    selectActAutoRemove,
} from '../ActivitySelectors'
import { AddActivityTypes } from '../../game/GameState'

interface AddOptions {
    id: string
    icon: React.ReactNode
    labelId: keyof Msg
}
const options: AddOptions[] = [
    {
        id: 'Last',
        icon: <LuArrowDown />,
        labelId: 'AddLast',
    },
    {
        id: 'First',
        icon: <LuArrowUp />,
        labelId: 'AddFirst',
    },
    {
        id: 'Next',
        icon: <LuArrowDown />,
        labelId: 'AddAfterCurrent',
    },
    {
        id: 'Before',
        icon: <LuArrowUp />,
        labelId: 'AddBeforeCurrent',
    },
]

export const AddActivityDialog = memo(function AddActivityDialog({
    title,
    openBtn,
    addBtn,
}: {
    title: ReactNode
    openBtn: ReactNode
    addBtn: ReactNode
}) {
    const { t } = useTranslations()
    const num = useGameStore(selectActRepetitions)
    const autoRemove = useGameStore(selectActAutoRemove)
    const removeOther = useGameStore(selectRemoveOtherActivities)
    const typeAdd = useGameStore(selectAddActType)
    const startNow = useGameStore(selectStartActNow)

    const onChange: React.ChangeEventHandler<HTMLInputElement> = useCallback((event) => {
        const val = parseInt(event.target.value)
        if (val && !isNaN(val) && val > 0 && val < 100) setActRepetitions(val)
    }, [])

    const selected = options.find((o) => o.id === typeAdd)

    return (
        <Dialog>
            <DialogTrigger asChild>{openBtn}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <DialogDescription>{}</DialogDescription>

                <FieldGroup>
                    <Field orientation="horizontal">
                        <Input
                            type="number"
                            value={num}
                            className="w-16"
                            onChange={onChange}
                            max={99}
                            min={1}
                            step={1}
                        />
                        <FieldLabel>{t.Repetitions}</FieldLabel>
                    </Field>
                    <ComboBoxResponsive
                        selectedId={typeAdd}
                        filter={false}
                        triggerContent={
                            selected && (
                                <ComboBoxTrigger value={selected.id} icon={selected.icon} selected={false}>
                                    {t[selected.labelId]}
                                </ComboBoxTrigger>
                            )
                        }
                    >
                        {options.map((option) => (
                            <ComboBoxItem
                                key={option.id}
                                value={option.id}
                                icon={option.icon}
                                selected={typeAdd === option.id}
                                onSelect={() => setAddActType(option.id as AddActivityTypes)}
                            >
                                {t[option.labelId]}
                            </ComboBoxItem>
                        ))}
                    </ComboBoxResponsive>

                    <Field orientation="horizontal">
                        <Checkbox
                            id={'auto-remove'}
                            name={'auto-remove'}
                            checked={autoRemove}
                            onCheckedChange={setActAutoRemove}
                        />
                        <FieldLabel htmlFor={'auto-remove'}>{t.RemoveWhenCompleted}</FieldLabel>
                    </Field>

                    <Field orientation="horizontal">
                        <Checkbox
                            id={'remove-other'}
                            name={'remove-other'}
                            checked={removeOther}
                            onCheckedChange={setRemoveOtherActivities}
                        />
                        <FieldLabel htmlFor={'remove-other'}>{t.RemoveOthers}</FieldLabel>
                    </Field>

                    <Field orientation="horizontal">
                        <Checkbox
                            id={'start-now'}
                            name={'start-now'}
                            checked={startNow}
                            onCheckedChange={setStartActNow}
                        />
                        <FieldLabel htmlFor={'start-now'}>{t.StartActNow}</FieldLabel>
                    </Field>
                </FieldGroup>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">{t.cancel}</Button>
                    </DialogClose>
                    {addBtn}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
})
