import { memo, useCallback } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { removeActivity } from '../../activities/functions/removeActivity'
import { getCharacterSelector } from '../../characters/getCharacterSelector'
import { consumeQuickSlotPotionClick } from '../../characters/quickSlotFunctions'
import { selectCharactersTeamIds } from '../../characters/selectors/characterSelectors'
import { selectQuickSlot, selectQuickSlotItem, selectQuickSlots } from '../../characters/selectors/quickSlotSelectors'
import { Button } from '../../components/ui/button'
import { useGameStore } from '../../game/state'
import { ItemIcon } from '../../items/ui/ItemIcon'
import { useTranslations } from '../../msg/useTranslations'
import { setPage } from '../../ui/state/uiFunctions'
import { UiPages } from '../../ui/state/UiPages'
import { BattleZones } from '../BattleZones'
import { selectCurrentBattleActivityId, selectCurrentBattleZone } from '../selectors/battleSelectors'
import classes from './globalCombatHud.module.css'
import { CombatHudResource } from './CombatHudResource'

export const GlobalCombatHud = memo(function GlobalCombatHud() {
    const activityId = useGameStore(selectCurrentBattleActivityId)
    const battleZoneEnum = useGameStore(selectCurrentBattleZone)
    const partyIds = useGameStore(selectCharactersTeamIds)
    const { t, fun } = useTranslations()
    const openCombat = useCallback(() => setPage(UiPages.Combat), [])
    const flee = useCallback(() => removeActivity(activityId), [activityId])

    if (!activityId || !battleZoneEnum) return null

    const battleZone = BattleZones[battleZoneEnum]

    return (
        <section className={classes.hud} aria-label={t.Combat}>
            <div className={classes.inner}>
                <div className={classes.summary}>
                    <span className={classes.encounter}>{fun.fighting(battleZone.nameId)}</span>
                    <div className={classes.actions}>
                        <Button variant="outline" size="sm" onClick={openCombat}>
                            {t.Combat}
                        </Button>
                        <Button variant="destructive" size="sm" onClick={flee}>
                            {t.Flee}
                        </Button>
                    </div>
                </div>

                <div className={classes.party}>
                    {partyIds.map((charId) => (
                        <CombatHudMember charId={charId} key={charId} />
                    ))}
                </div>
            </div>
        </section>
    )
})

const CombatHudMember = memo(function CombatHudMember({ charId }: { charId: string }) {
    const character = getCharacterSelector(charId)
    const name = useGameStore(character.Name)

    return (
        <article className={classes.member}>
            <span className={classes.memberName}>{name}</span>
            <div className={classes.resources}>
                <CombatHudResource charId={charId} resource="health" />
                <CombatHudResource charId={charId} resource="stamina" />
                <CombatHudResource charId={charId} resource="mana" />
            </div>
            <CombatHudQuickSlots charId={charId} />
        </article>
    )
})

const CombatHudQuickSlots = memo(function CombatHudQuickSlots({ charId }: { charId: string }) {
    const quickSlots = useGameStore(useShallow(selectQuickSlots(charId)))

    if (quickSlots.every((quickSlot) => quickSlot === null)) return null

    return (
        <div className={classes.quickSlots}>
            {quickSlots.map((quickSlot, index) =>
                quickSlot ? <CombatHudQuickSlot charId={charId} index={index} key={`${charId}-${index}`} /> : null
            )}
        </div>
    )
})

const CombatHudQuickSlot = memo(function CombatHudQuickSlot({ charId, index }: { charId: string; index: number }) {
    const quickSlot = useGameStore(useCallback((state) => selectQuickSlot(index, charId)(state), [charId, index]))
    const item = useGameStore(useCallback((state) => selectQuickSlotItem(index, charId)(state), [charId, index]))
    const { t } = useTranslations()
    const onClick = useCallback(() => consumeQuickSlotPotionClick(charId, index), [charId, index])

    if (!quickSlot || !item?.potionData) return null

    return (
        <Button variant="secondary" size="xs" className={classes.quickSlot} title={t[item.nameId]} onClick={onClick}>
            <ItemIcon itemId={item} className={classes.quickSlotIcon} />
            <span>{quickSlot.quantity ?? 1}</span>
        </Button>
    )
})
