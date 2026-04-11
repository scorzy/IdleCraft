import { memo, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { useTranslations } from '@/msg/useTranslations'
import { load } from '@/game/functions/gameFunctions'
import { saveService } from '../saveService'

export const SaveImportDialog = memo(function SaveImportDialog() {
    const { t } = useTranslations()
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const onImport = async () => {
        setError('')
        setLoading(true)
        try {
            const state = await saveService.importSave(value)
            load(state)
            setOpen(false)
            setValue('')
        } catch (e) {
            const msg = e instanceof Error ? e.message : t.SaveImportError
            setError(msg)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="secondary">{t.ImportSave}</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[680px]">
                <DialogHeader>
                    <DialogTitle>{t.ImportSave}</DialogTitle>
                    <DialogDescription>{t.ImportSaveDesc}</DialogDescription>
                </DialogHeader>
                <textarea
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    rows={10}
                    className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex w-full rounded-md border p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                />
                {error && <span className="text-sm text-red-500">{error}</span>}
                <DialogFooter>
                    <Button onClick={onImport} disabled={loading || value.trim().length === 0}>
                        {loading ? t.Processing : t.ImportSave}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
})
