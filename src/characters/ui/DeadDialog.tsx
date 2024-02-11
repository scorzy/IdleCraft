import { memo } from 'react'
import { Dialog, DialogContent, DialogHeader } from '../../components/ui/dialog'
import { useGameStore } from '../../game/state'
import { selectDeadDialog } from '../selectors/characterSelectors'
import { closeDeadDialog } from '../functions/closeDeadDialog'
import { useTranslations } from '../../msg/useTranslations'

export const DeadDialog = memo(function DeadDialog() {
    const dead = useGameStore(selectDeadDialog)
    const { t } = useTranslations()
    return (
        <Dialog open={dead} onOpenChange={closeDeadDialog}>
            <DialogContent>
                <DialogHeader>{t.YouDied}</DialogHeader>
            </DialogContent>
        </Dialog>
    )
})
