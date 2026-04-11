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
import { saveService } from '../saveService'
import { useGameStore } from '@/game/state'

function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`
    const kb = bytes / 1024
    if (kb < 1024) return `${kb.toFixed(2)} KB`
    return `${(kb / 1024).toFixed(2)} MB`
}

export const SaveExportDialog = memo(function SaveExportDialog() {
    const { t } = useTranslations()
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [stats, setStats] = useState<{ uncompressedBytes: number; compressedBytes: number } | null>(null)

    const onOpenChange = (nextOpen: boolean) => {
        setOpen(nextOpen)
        if (nextOpen) void startExport()
    }

    const startExport = async () => {
        setLoading(true)
        setError('')
        setValue('')
        setStats(null)
        try {
            const state = useGameStore.getState()
            const result = await saveService.exportSave(state)
            setValue(result.value)
            setStats({ uncompressedBytes: result.uncompressedBytes, compressedBytes: result.compressedBytes })
        } catch (e) {
            const msg = e instanceof Error ? e.message : t.SaveExportError
            setError(msg)
        } finally {
            setLoading(false)
        }
    }

    const onCopy = async () => {
        if (!value) return
        await navigator.clipboard.writeText(value)
    }

    const onDownload = () => {
        if (!value) return
        const blob = new Blob([value], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = 'idlecraft-save.save'
        link.click()
        URL.revokeObjectURL(url)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button variant="outline">{t.ExportSave}</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[680px]">
                <DialogHeader>
                    <DialogTitle>{t.ExportSave}</DialogTitle>
                    <DialogDescription>{t.ExportSaveDesc}</DialogDescription>
                </DialogHeader>
                <textarea
                    value={value}
                    readOnly
                    rows={10}
                    placeholder={loading ? t.Processing : ''}
                    className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex w-full rounded-md border p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                />
                {stats && (
                    <span className="text-muted-foreground text-sm">
                        {t.Size}: {formatBytes(stats.uncompressedBytes)} → {formatBytes(stats.compressedBytes)}
                    </span>
                )}
                {error && <span className="text-sm text-red-500">{error}</span>}
                <DialogFooter>
                    <Button variant="secondary" disabled={loading || value.length === 0} onClick={onCopy}>
                        {t.CopyToClipboard}
                    </Button>
                    <Button disabled={loading || value.length === 0} onClick={onDownload}>
                        {t.DownloadFile}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
})
