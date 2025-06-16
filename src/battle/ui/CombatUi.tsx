import { memo, useCallback, useState } from 'react'
import { GiHearts, GiMagicPalm, GiStrong, GiSwapBag } from 'react-icons/gi'
import { CaretSortIcon } from '@radix-ui/react-icons'
import { Virtuoso } from 'react-virtuoso'
import { MyPage } from '../../ui/pages/MyPage'
import { useGameStore } from '../../game/state'
import { selectTeams } from '../../characters/selectors/selectTeams'
import {
    selectCharMainAttack,
    selectCharMainAttackIcon,
    selectCharMainAttackTimer,
} from '../../characters/selectors/characterSelectors'
import { useTranslations } from '../../msg/useTranslations'
import { IconsData } from '../../icons/Icons'
import { MyCardHeaderTitle } from '../../ui/myCard/MyCard'
import { ProgressBar } from '../../ui/progress/ProgressBar'
import { useNumberFormatter } from '../../formatters/selectNumberFormatter'
import { TimerProgressFromId } from '../../ui/progress/TimerProgress'
import { ActiveAbilityData } from '../../activeAbilities/ActiveAbilityData'
import { selectCombatAbilityById } from '../../activeAbilities/selectors/selectCombatAbilityById'
import { GameState } from '../../game/GameState'
import { Badge } from '../../components/ui/badge'
import { MyHoverCard } from '../../ui/MyHoverCard'
import { selectCombatAbilitiesChar } from '../../activeAbilities/selectors/selectCombatAbilities'
import { Card, CardContent } from '../../components/ui/card'
import { BattleLogUi } from '../../battleLog/ui/battleLogUi'
import { CharCombatInfo } from '../../characters/ui/CharactersUi'
import { Button } from '../../components/ui/button'
import { selectLoot } from '../../storage/selectors/selectLoot'
import { LootId } from '../../storage/storageTypes'
import { selectGameItem } from '../../storage/StorageSelectors'
import { collectLootUi } from '../../storage/function/collectLoot'
import { getCharacterSelector } from '../../characters/getCharacterSelector'
import { ActiveAbility } from '../../activeAbilities/ActiveAbility'
import classes from './combat.module.css'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

export const CombatUi = memo(function CombatUi() {
    return (
        <MyPage>
            <div className={classes.mainContainer}>
                <CombatChars />
                <BattleLogUi className={classes.log} />
                <BattleLootUi />
            </div>
        </MyPage>
    )
})
const CombatChars = memo(function CombatChars() {
    const ids = useGameStore(selectTeams)

    return (
        <div className={classes.team}>
            {ids.allies.map((id) => (
                <CharCard charId={id} key={id} />
            ))}
            {ids.enemies.map((id) => (
                <CharCard charId={id} key={id} />
            ))}
        </div>
    )
})
const CharCard = memo(function CharCard(props: { charId: string }) {
    const { charId } = props
    const { t } = useTranslations()
    const charSel = getCharacterSelector(charId)

    const name = useGameStore(useCallback((s: GameState) => charSel.Name(s), [charSel]))
    const icon = useGameStore(useCallback((s: GameState) => charSel.Icon(s), [charSel]))

    const [isAttOpen, setAttIsOpen] = useState(false)

    return (
        <Card>
            <MyCardHeaderTitle title={name} icon={IconsData[icon]} />
            <CardContent>
                <div className={classes.charCard}>
                    <CharHealth charId={charId} />
                    <CharStamina charId={charId} />
                    <CharMana charId={charId} />

                    <MainAttack charId={charId} />
                    <CombatAbilitiesList charId={charId} />

                    <Collapsible open={isAttOpen} onOpenChange={setAttIsOpen} className="text-sm">
                        <CollapsibleTrigger asChild>
                            <Button variant="ghost" className="w-full">
                                {t.Stats}
                                <CaretSortIcon />
                            </Button>
                        </CollapsibleTrigger>

                        <CollapsibleContent className="CollapsibleContent">
                            <CardContent className="grid gap-2">
                                <CharCombatInfo charId={charId} />
                            </CardContent>
                        </CollapsibleContent>
                    </Collapsible>
                </div>
            </CardContent>
        </Card>
    )
})

const CharHealth = memo(function CharHealth(props: { charId: string }) {
    const { charId } = props
    const { f } = useNumberFormatter()
    const charSel = getCharacterSelector(charId)
    const health = useGameStore(useCallback((s: GameState) => charSel.Health(s), [charSel]))
    const maxHealth = useGameStore(useCallback((s: GameState) => charSel.MaxHealth(s), [charSel]))
    const hPercent = Math.floor((100 * health) / maxHealth)

    return (
        <div>
            <span className={classes.label}>
                <GiHearts />
                {f(health)}/{f(maxHealth)}
            </span>
            <ProgressBar color="health" value={hPercent} />
        </div>
    )
})

const CharStamina = memo(function CharStamina(props: { charId: string }) {
    const { charId } = props
    const { f } = useNumberFormatter()
    const charSel = getCharacterSelector(charId)
    const stamina = useGameStore(useCallback((s: GameState) => charSel.Stamina(s), [charSel]))
    const maxStamina = useGameStore(useCallback((s: GameState) => charSel.MaxStamina(s), [charSel]))
    const sPercent = Math.floor((100 * stamina) / maxStamina)

    return (
        <div>
            <span className={classes.label}>
                <GiStrong />
                {f(stamina)}/{f(maxStamina)}
            </span>
            <ProgressBar color="stamina" value={sPercent} />
        </div>
    )
})

const CharMana = memo(function CharMana(props: { charId: string }) {
    const { charId } = props
    const { f } = useNumberFormatter()
    const charSel = getCharacterSelector(charId)
    const mana = useGameStore(useCallback((s: GameState) => charSel.Mana(s), [charSel]))
    const maxMana = useGameStore(useCallback((s: GameState) => charSel.MaxMana(s), [charSel]))
    const mPercent = Math.floor((100 * mana) / maxMana)

    return (
        <div>
            <span className={classes.label}>
                <GiMagicPalm />
                {f(mana)}/{f(maxMana)}
            </span>
            <ProgressBar color="mana" value={mPercent} />
        </div>
    )
})

const MainAttack = memo(function MainAttack(props: { charId: string }) {
    const { charId } = props
    const { t } = useTranslations()
    const { ft } = useNumberFormatter()
    const timer = useGameStore(selectCharMainAttackTimer(charId))
    const attack = useGameStore(selectCharMainAttack(charId))
    const icon = useGameStore(selectCharMainAttackIcon(charId))
    let ability: ActiveAbility | null = null
    if (timer && attack) ability = ActiveAbilityData.getEx(attack.abilityId)
    return (
        <div>
            <span className={classes.attackLabel}>
                {icon && IconsData[icon]}
                {!icon && IconsData.Punch}&nbsp;
                {ability && t[ability.nameId]}
                {timer && <span className="text-muted-foreground">{ft(timer.to - timer.from)}</span>}
            </span>

            <TimerProgressFromId timerId={timer?.id} color="primary" />
        </div>
    )
})
const CombatAbilitiesList = memo(function CombatAbilitiesList(props: { charId: string }) {
    const { charId } = props
    const allAbilities = useGameStore(selectCombatAbilitiesChar(charId))

    return (
        <div className={classes.abilitiesList}>
            {allAbilities.map((id, index) => (
                // eslint-disable-next-line @eslint-react/no-array-index-key
                <CombatAbilityBadge characterId={charId} abilityId={id} key={id + charId + index} index={index} />
            ))}
            {allAbilities.length === 0 && (
                <CombatAbilityBadge characterId={charId} abilityId="NormalAttack" index={0} />
            )}
        </div>
    )
})
const CombatAbilityBadge = memo(function CombatAbilitiesList(props: {
    characterId: string
    abilityId: string
    index: number
}) {
    const { characterId, abilityId, index } = props
    const { t } = useTranslations()
    const charAbility = useGameStore(selectCombatAbilityById(abilityId, characterId))
    const ability = ActiveAbilityData.getEx(charAbility.abilityId)
    const iconId = useGameStore((state: GameState) => ability.getIconId({ state, characterId }))
    const desc = useGameStore((state: GameState) => ability.getDesc({ state, characterId }))
    const active = useGameStore(
        (state: GameState) => state.characters.entries[characterId]?.lastCombatAbilityNum === index
    )
    const icon = IconsData[iconId]
    return (
        <MyHoverCard
            trigger={
                <Badge variant={active ? 'default' : 'secondary'} className="text-xl">
                    {icon}
                </Badge>
            }
        >
            <span className="mb-2 grid grid-cols-[auto_1fr] items-center gap-1.5 text-lg leading-none font-semibold tracking-tight">
                {icon} {t[ability.nameId]}
            </span>
            <div>{desc}</div>
        </MyHoverCard>
    )
})
const BAG_ICON = <GiSwapBag />
const BattleLootUi = memo(function BattleLootUi() {
    const { t } = useTranslations()
    const loots = useGameStore(selectLoot)
    return (
        <Card className={classes.loot}>
            <MyCardHeaderTitle title={t.Loot} icon={BAG_ICON} />
            <CardContent className="h-full">
                <Virtuoso
                    style={{ height: '100%' }}
                    totalCount={loots.length}
                    itemContent={(index) => {
                        const loot = loots[index]
                        if (!loot) return null
                        return <LootRow loot={loot} key={loot.id} />
                    }}
                />
            </CardContent>
        </Card>
    )
})

const LootRow = memo(function LootRow(props: { loot: LootId }) {
    const { loot } = props
    const { t } = useTranslations()
    const { f } = useNumberFormatter()
    const item = useGameStore(selectGameItem(loot.itemId))

    const onClick = useCallback(() => collectLootUi(loot.id), [loot])

    if (!item) return

    return (
        <div className={classes.lootRow}>
            <span className={classes.svgIcon}>{IconsData[item.icon]}</span>
            <div>{t[item.nameId]}</div>
            <div className="text-right">{f(loot.quantity)}</div>
            <Button variant="ghost" size="xs" title={t.Collect} onClick={onClick}>
                <GiSwapBag />
            </Button>
        </div>
    )
})
