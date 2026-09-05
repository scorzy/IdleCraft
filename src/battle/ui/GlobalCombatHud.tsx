import { clsx } from 'clsx'
import { memo, useCallback } from 'react'
import { GiHearts, GiMagicPalm, GiStrong } from 'react-icons/gi'
import { removeActivity } from '../../activities/functions/removeActivity'
import { getCharacterSelector } from '../../characters/getCharacterSelector'
import { selectCharactersTeamIds } from '../../characters/selectors/characterSelectors'
import { Button } from '../../components/ui/button'
import { useNumberFormatter } from '../../formatters/selectNumberFormatter'
import { useGameStore } from '../../game/state'
import { useTranslations } from '../../msg/useTranslations'
import { ProgressBar } from '../../ui/progress/ProgressBar'
import { setPage } from '../../ui/state/uiFunctions'
import { UiPages } from '../../ui/state/UiPages'
import { BattleZones } from '../BattleZones'
import { selectCurrentBattleActivityId, selectCurrentBattleZone } from '../selectors/battleSelectors'
import classes from './globalCombatHud.module.css'

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
        </article>
    )
})

type CombatResource = 'health' | 'stamina' | 'mana'

const CombatHudResource = memo(function CombatHudResource({
    charId,
    resource,
}: {
    charId: string
    resource: CombatResource
}) {
    const character = getCharacterSelector(charId)
    const { t } = useTranslations()
    const { f } = useNumberFormatter()
    const current = useGameStore(
        resource === 'health' ? character.Health : resource === 'stamina' ? character.Stamina : character.Mana
    )
    const max = useGameStore(
        resource === 'health' ? character.MaxHealth : resource === 'stamina' ? character.MaxStamina : character.MaxMana
    )
    const value = max > 0 ? Math.min(100, Math.max(0, (100 * current) / max)) : 0
    const label = resource === 'health' ? t.Health : resource === 'stamina' ? t.Stamina : t.Mana
    const icon = resource === 'health' ? <GiHearts /> : resource === 'stamina' ? <GiStrong /> : <GiMagicPalm />
    const resourceText = `${label}: ${f(current)}/${f(max)}`

    return (
        <div
            className={clsx(
                classes.resource,
                resource === 'health' ? classes.health : resource === 'stamina' ? classes.stamina : classes.mana,
                resource !== 'health' && classes.compactResource
            )}
            role="meter"
            aria-label={label}
            aria-valuemin={0}
            aria-valuemax={max}
            aria-valuenow={current}
            aria-valuetext={resourceText}
            title={resourceText}
        >
            <span className={classes.resourceIcon} aria-hidden="true">
                {icon}
            </span>
            <ProgressBar color={resource} value={value} />
            <span className={clsx(classes.resourceValue, { 'sr-only': resource !== 'health' })}>
                {f(current)}/{f(max)}
            </span>
        </div>
    )
})
