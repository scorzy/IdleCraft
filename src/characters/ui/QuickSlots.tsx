import { memo } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { useGameStore } from '../../game/state'
import { selectSelectedCharId } from '../../ui/state/uiSelectors'
import { selectQuickSlots } from '../selectors/quickSlotSelectors'
import { QuickSlotStorageCard } from './QuickSlotStorageCard'

export const QuickSlots = memo(function QuickSlots() {
    const charId = useGameStore(selectSelectedCharId)
    const quickSlots = useGameStore(useShallow(selectQuickSlots(charId)))

    return (
        <>
            {quickSlots.map((_, index) => (
                <QuickSlotStorageCard charId={charId} index={index} key={`${charId}-${index}`} />
            ))}
        </>
    )
})
