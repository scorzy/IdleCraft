import clsx from 'clsx'
import { memo } from 'react'
import { GiHearts, GiStrong, GiMagicPalm } from 'react-icons/gi'
import { getCharacterSelector } from '../../characters/getCharacterSelector'
import { useNumberFormatter } from '../../formatters/selectNumberFormatter'
import { useGameStore } from '../../game/state'
import { useTranslations } from '../../msg/useTranslations'
import { ProgressBar } from '../../ui/progress/ProgressBar'
import classes from './combatHudResource.module.css'

export type CombatResource = 'health' | 'stamina' | 'mana'

export const CombatHudResource = memo(function CombatHudResource({
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
                resource === 'health' ? classes.health : resource === 'stamina' ? classes.stamina : classes.mana
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
            <span className={clsx(classes.resourceValue)}>
                {f(current)}/{f(max)}
            </span>
        </div>
    )
})
