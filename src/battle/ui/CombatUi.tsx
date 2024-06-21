import { memo, useCallback, useState } from 'react'
import { GiHearts, GiMagicPalm, GiStrong, GiSwapBag } from 'react-icons/gi'
import { CaretSortIcon } from '@radix-ui/react-icons'
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
import { MyCardHeaderTitle } from '../../ui/myCard/MyCard'
import { ProgressBar } from '../../ui/progress/ProgressBar'
import { selectCharacterMaxHealth } from '../../characters/selectors/healthSelectors'
import { selectCharacterMaxMana } from '../../characters/selectors/manaSelectors'
import { selectCharacterMaxStamina } from '../../characters/selectors/staminaSelectors'
import { useNumberFormatter } from '../../formatters/selectNumberFormatter'
import { TimerProgressFromId } from '../../ui/progress/TimerProgress'
import { ActiveAbilityData } from '../../activeAbilities/ActiveAbilityData'
import { selectCombatAbilityById } from '../../activeAbilities/selectors/selectCombatAbilityById'
import { GameState } from '../../game/GameState'
import { Badge } from '../../components/ui/badge'
import { MyHoverCard } from '../../ui/MyHoverCard'
import { selectCombatAbilitiesChar } from '../../activeAbilities/selectors/selectCombatAbilities'
import { Card, CardContent, CardTitle } from '../../components/ui/card'
import { BattleLogUi } from '../../battleLog/ui/BattleLogUi'
import { AttackInfo, ArmourInfo } from '../../characters/ui/CharactersUi'
import { Button } from '../../components/ui/button'
import { Table, TableBody, TableCell, TableRow } from '../../components/ui/table'
import { selectLoot } from '../../storage/selectors/selectLoot'
import { LootId } from '../../storage/storageState'
import { selectGameItem } from '../../storage/StorageSelectors'
import { collectLootUi } from '../../storage/function/collectLoot'
import classes from './Combat.module.css'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

export const CombatUi = memo(function CombatUi() {
    return (
        <MyPage>
            <div className={classes.mainContainer}>
                <CombatChars />
                <BattleLogUi />
                <BattleLootUi />
            </div>
        </MyPage>
    )
})
const CombatChars = memo(function CombatChars() {
    const ids = useGameStore(selectTeams)
    const { t } = useTranslations()
    return (
        <div className={classes.container}>
            <div className={classes.team}>
                <CardTitle>{t.Allies}</CardTitle>

                {ids.allies.map((id) => (
                    <CharCard charId={id} key={id} />
                ))}
            </div>
            <div className={classes.team}>
                <CardTitle>{t.Enemies}</CardTitle>

                {ids.enemies.map((id) => (
                    <CharCard charId={id} key={id} />
                ))}
            </div>
        </div>
    )
})
const CharCard = memo(function CharCard(props: { charId: string }) {
    const { charId } = props
    const { t } = useTranslations()
    const name = useGameStore(selectCharName(charId))
    const icon = useGameStore(selectCharIcon(charId))
    const [isAttOpen, setAttIsOpen] = useState(false)
    const [isDefOpen, setIsDefOpen] = useState(false)

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
                                {t.OffensiveInfo}
                                <CaretSortIcon />
                            </Button>
                        </CollapsibleTrigger>

                        <CollapsibleContent className="CollapsibleContent">
                            <AttackInfo charId={charId} />
                        </CollapsibleContent>
                    </Collapsible>

                    <Collapsible open={isDefOpen} onOpenChange={setIsDefOpen} className="text-sm">
                        <CollapsibleTrigger asChild>
                            <Button variant="ghost" className="w-full">
                                {t.DefensiveInfo}
                                <CaretSortIcon />
                            </Button>
                        </CollapsibleTrigger>

                        <CollapsibleContent className="CollapsibleContent">
                            <ArmourInfo charId={charId} />
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
    const health = useGameStore(selectCharHealth(charId))
    const maxHealth = useGameStore(selectCharacterMaxHealth(charId))
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
    const stamina = useGameStore(selectCharStamina(charId))
    const maxStamina = useGameStore(selectCharacterMaxStamina(charId))
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
    const mana = useGameStore(selectCharMana(charId))
    const maxMana = useGameStore(selectCharacterMaxMana(charId))
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
    const timer = useGameStore(selectCharMainAttackTimer(charId))
    const attack = useGameStore(selectCharMainAttack(charId))
    const icon = useGameStore(selectCharMainAttackIcon(charId))
    if (!timer || !attack) return
    const ability = ActiveAbilityData.getEx(attack.abilityId)
    return (
        <div>
            <span className={classes.attackLabel}>
                {icon && IconsData[icon]}
                {t[ability.nameId]}
            </span>

            <TimerProgressFromId timerId={timer.id} color="primary" />
        </div>
    )
})
const CombatAbilitiesList = memo(function CombatAbilitiesList(props: { charId: string }) {
    const { charId } = props
    const allAbilities = useGameStore(selectCombatAbilitiesChar(charId))

    return (
        <div className={classes.abilitiesList}>
            {allAbilities.map((id, index) => (
                <CombatAbilityBadge characterId={charId} abilityId={id} key={id + charId + index} index={index} />
            ))}
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
            <span className="mb-2 grid grid-cols-[auto_1fr] items-center gap-1.5 text-lg font-semibold leading-none tracking-tight">
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
        <Card>
            <MyCardHeaderTitle title={t.Loot} icon={BAG_ICON} />
            <CardContent>
                <Table className={classes.lootTable}>
                    <TableBody>
                        {loots.map((loot) => (
                            <LootRow loot={loot} key={loot.id} />
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
})
const LootRow = memo(function LootRow(props: { loot: LootId }) {
    const { loot } = props
    const { t } = useTranslations()
    const { f } = useNumberFormatter()
    const item = useGameStore(selectGameItem(loot.stdItem, loot.craftedItem))

    const onClick = useCallback(() => collectLootUi(loot.id), [loot])

    if (!item) return

    return (
        <TableRow>
            <TableCell>{IconsData[item.icon]}</TableCell>
            <TableCell className="w-full">{t[item.nameId]}</TableCell>
            <TableCell className="text-right">{f(loot.quantity)}</TableCell>
            <TableCell>
                <Button variant="ghost" size="xs" title={t.Collect} onClick={onClick}>
                    <GiSwapBag />
                </Button>
            </TableCell>
        </TableRow>
    )
})
