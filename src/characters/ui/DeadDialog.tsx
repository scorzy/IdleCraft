import { memo } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader } from '../../components/ui/dialog'
import { useGameStore } from '../../game/state'
import { useTranslations } from '../../msg/useTranslations'
import { closeDeadDialog } from '../functions/closeDeadDialog'
import { selectDeadDialog } from '../selectors/characterSelectors'

export const DeadDialog = memo(function DeadDialog() {
    const dead = useGameStore(selectDeadDialog)
    const { t } = useTranslations()
    return (
        <Dialog open={dead} onOpenChange={closeDeadDialog}>
            <DialogContent>
                <DialogHeader>{t.YouDied}</DialogHeader>
            </DialogContent>
            <DialogDescription></DialogDescription>
        </Dialog>
    )
})
