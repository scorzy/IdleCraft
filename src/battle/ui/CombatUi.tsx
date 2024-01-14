import { memo } from 'react'
import { GiHearts, GiMagicPalm, GiStrong } from 'react-icons/gi'
import { MyPage } from '../../ui/pages/MyPage'
import { useGameStore } from '../../game/state'
import { selectTeams } from '../../characters/selectors/selectTeams'
import {
    selectCharHealth,
    selectCharIcon,
    selectCharMainAttack,
    selectCharMainAttackIcon,
    selectCharMainAttackTimer,
    selectCharMana,
    selectCharName,
    selectCharStamina,
} from '../../characters/selectors/characterSelectors'
import { useTranslations } from '../../msg/useTranslations'
import { IconsData } from '../../icons/Icons'
import { MyCard } from '../../ui/myCard/myCard'
import { ProgressBar } from '../../ui/progress/ProgressBar'
import { selectCharacterMaxHealth } from '../../characters/selectors/healthSelectors'
import { selectCharacterMaxMana } from '../../characters/selectors/manaSelectors'
import { selectCharacterMaxStamina } from '../../characters/selectors/staminaSelectors'
import { useNumberFormatter } from '../../formatters/selectNumberFormatter'
import { TimerProgressFromId } from '../../ui/progress/TimerProgress'
import { ActiveAbilityData } from '../../activeAbilities/ActiveAbilityData'
import classes from './Combat.module.css'

export const CombatUi = memo(function CombatUi() {
    return (
        <MyPage>
            <CombatChars />
        </MyPage>
    )
})
const CombatChars = memo(function CombatChars() {
    const ids = useGameStore(selectTeams)
    return (
        <div className={classes.container}>
            <div className={classes.team}>
                {ids.allies.map((id) => (
                    <CharCard charId={id} key={id} />
                ))}
            </div>
            <div className={classes.team}>
                {ids.enemies.map((id) => (
                    <CharCard charId={id} key={id} />
                ))}
            </div>
        </div>
    )
})
const CharCard = memo(function CharCard(props: { charId: string }) {
    const { charId } = props
    const name = useGameStore(selectCharName(charId))
    const icon = useGameStore(selectCharIcon(charId))

    return (
        <MyCard title={name} icon={IconsData[icon]}>
            <CharHealth charId={charId} />
            <CharStamina charId={charId} />
            <CharMana charId={charId} />

            <MainAttack charId={charId} />
        </MyCard>
    )
})

const CharHealth = memo(function CharHealth(props: { charId: string }) {
    const { charId } = props
    const { f } = useNumberFormatter()
    const health = useGameStore(selectCharHealth(charId))
    const maxHealth = useGameStore(selectCharacterMaxHealth(charId))
    const hPercent = Math.floor((100 * health) / maxHealth)

    return (
        <>
            <span className={classes.label}>
                <GiHearts />
                {f(health)}/{f(maxHealth)}
            </span>
            <ProgressBar color="health" value={hPercent} className="mb-2" />
        </>
    )
})

const CharStamina = memo(function CharStamina(props: { charId: string }) {
    const { charId } = props
    const { f } = useNumberFormatter()
    const stamina = useGameStore(selectCharStamina(charId))
    const maxStamina = useGameStore(selectCharacterMaxStamina(charId))
    const sPercent = Math.floor((100 * stamina) / maxStamina)

    return (
        <>
            <span className={classes.label}>
                <GiStrong />
                {f(stamina)}/{f(maxStamina)}
            </span>
            <ProgressBar color="stamina" value={sPercent} className="mb-2" />
        </>
    )
})

const CharMana = memo(function CharMana(props: { charId: string }) {
    const { charId } = props
    const { f } = useNumberFormatter()
    const mana = useGameStore(selectCharMana(charId))
    const maxMana = useGameStore(selectCharacterMaxMana(charId))
    const mPercent = Math.floor((100 * mana) / maxMana)

    return (
        <>
            <span className={classes.label}>
                <GiMagicPalm />
                {f(mana)}/{f(maxMana)}
            </span>
            <ProgressBar color="mana" value={mPercent} className="mb-2" />
        </>
    )
})

const MainAttack = memo(function MainAttack(props: { charId: string }) {
    const { charId } = props
    const { t } = useTranslations()
    const timer = useGameStore(selectCharMainAttackTimer(charId))
    const attack = useGameStore(selectCharMainAttack(charId))
    const icon = useGameStore(selectCharMainAttackIcon(charId))
    if (!timer || !attack) return <></>
    const ability = ActiveAbilityData.getEx(attack.abilityId)
    return (
        <>
            <span className={classes.attackLabel}>
                {icon && IconsData[icon]}
                {t[ability.nameId]}
            </span>

            <TimerProgressFromId timerId={timer.id} color="primary" />
        </>
    )
})
