import { memo, useCallback, useMemo } from 'react'
import { GiHearts, GiMagicPalm, GiStrong, GiSwapBag } from 'react-icons/gi'
import { useShallow } from 'zustand/react/shallow'
import { useItemName } from '@/items/selectors/useItemName'
import { ActiveAbility } from '../../activeAbilities/ActiveAbility'
import { ActiveAbilityData } from '../../activeAbilities/ActiveAbilityData'
import { removeActivity } from '../../activities/functions/removeActivity'
import { getCombatRotation, selectCombatRotationChar } from '../../activeAbilities/selectors/selectCombatAbilities'
import { selectCombatAbilityById } from '../../activeAbilities/selectors/selectCombatAbilityById'
import { BattleLogUi } from '../../battleLog/ui/BattleLogUi'
import { getCharacterSelector } from '../../characters/getCharacterSelector'
import { CharacterState } from '../../characters/characterState'
import { consumeQuickSlotPotionClick } from '../../characters/quickSlotFunctions'
import {
    selectCharMainAttack,
    selectCharMainAttackIcon,
    selectCharMainAttackTimer,
} from '../../characters/selectors/characterSelectors'
import { selectQuickSlot, selectQuickSlots } from '../../characters/selectors/quickSlotSelectors'
import { selectTeamsMemo } from '../../characters/selectors/selectTeams'
import { CharCombatInfo } from '../../characters/ui/CharactersUi'
import { AutoScroll } from '../../components/ui/autoScroll'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Card, CardContent } from '../../components/ui/card'
import { useNumberFormatter } from '../../formatters/selectNumberFormatter'
import { GameState } from '../../game/GameState'
import { useGameStore } from '../../game/state'
import { IconsData } from '../../icons/Icons'
import { useTranslations } from '../../msg/useTranslations'
import { collectLootUi } from '../../storage/function/collectLoot'
import { selectGameItem } from '../../storage/StorageSelectors'
import { PotionDataUi } from '../../items/ui/ItemInfo'
import { selectLoot } from '../../storage/selectors/selectLoot'
import { LootId } from '../../storage/storageTypes'
import { MyHoverCard } from '../../ui/MyHoverCard'
import { MyCardHeaderTitle } from '../../ui/myCard/MyCard'
import { MyPage } from '../../ui/pages/MyPage'
import { ProgressBar } from '../../ui/progress/ProgressBar'
import { TimerProgressFromId } from '../../ui/progress/TimerProgress'
import classes from './combat.module.css'
import { ItemIcon } from '../../items/ui/ItemIcon'
import { ItemIconName } from '../../items/ui/ItemIconName'
import { WeaponCoatingDataUi } from '../../items/ui/ItemInfo'
import {
    selectActiveWeaponCoating,
    selectWeaponCoatingEffects,
    WeaponCoatingEffectGroup,
} from '../../weaponCoatings/weaponCoatingSelectors'
import { memoize } from 'proxy-memoize'
import { AbilitiesEnum } from '../../activeAbilities/abilitiesEnum'
import { selectCurrentBattleActivityId } from '../selectors/battleSelectors'

export const CombatUi = memo(function CombatUi() {
    return (
        <MyPage>
            <FleeButton />
            <div className={classes.mainContainer}>
                <CombatChars />
                <BattleLogUi className={classes.log} />
                <BattleLootUi />
            </div>
        </MyPage>
    )
})

const FleeButton = memo(function FleeButton() {
    const { t } = useTranslations()
    const activityId = useGameStore(selectCurrentBattleActivityId)
    const onClick = useCallback(() => removeActivity(activityId), [activityId])

    return (
        <div className="mb-2 flex justify-start">
            <Button variant="destructive" disabled={!activityId} onClick={onClick}>
                {t.Flee}
            </Button>
        </div>
    )
})

const CombatChars = memo(function CombatChars() {
    const ids = useGameStore(selectTeamsMemo)

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
    const charSel = getCharacterSelector(charId)

    const name = useGameStore(useCallback((s: GameState) => charSel.Name(s), [charSel]))
    const icon = useGameStore(useCallback((s: GameState) => charSel.Icon(s), [charSel]))
    const isEnemy = useGameStore(
        useCallback((s: GameState) => s.characters.entries[charId]?.isEnemy ?? false, [charId])
    )

    return (
        <Card>
            <MyCardHeaderTitle title={name} icon={IconsData[icon]} />
            <CardContent>
                <div className={classes.charCard}>
                    <CharHealth charId={charId} />
                    <CharStamina charId={charId} />
                    <CharMana charId={charId} />
                    <ActiveWeaponCoating charId={charId} />
                    <WeaponCoatingEffects charId={charId} />

                    <MainAttack charId={charId} />
                    <CombatAbilitiesList charId={charId} />
                    {!isEnemy && <CombatQuickSlotsList charId={charId} />}
                    <div className={classes.combatStats}>
                        <CharCombatInfo charId={charId} />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
})

type CharacterCombatProps = { charId: string; char?: CharacterState } | { char: CharacterState; charId?: string }

export const ActiveWeaponCoating = memo(function ActiveWeaponCoating(props: CharacterCombatProps) {
    const charId = props.char?.id ?? props.charId
    const { char } = props
    const coating = useGameStore(
        useCallback(
            (state: GameState) =>
                charId ? (char?.weaponCoating ?? selectActiveWeaponCoating(charId)(state)) : undefined,
            [char, charId]
        )
    )
    const { f } = useNumberFormatter()
    const { t } = useTranslations()
    if (!charId || !coating) return null

    return (
        <div className="grid gap-0.5 text-sm">
            <div className="grid grid-flow-col items-center justify-start gap-1">
                {IconsData[coating.data.iconId]}
                <span>{t[coating.data.nameId]}</span>
                <span>
                    {t.CoatingCharges}: {f(coating.remainingCharges)}
                </span>
            </div>
            <WeaponCoatingDataUi coatingData={coating.data} showCharges={false} />
        </div>
    )
})

const WeaponCoatingEffects = memo(function WeaponCoatingEffects({ charId }: { charId: string }) {
    const selectEffectsMemo = useMemo(() => memoize(selectWeaponCoatingEffects(charId)), [charId])
    const effects = useGameStore(selectEffectsMemo)
    if (effects.length === 0) return null

    return (
        <div className="grid gap-1">
            {effects.map((effect) => (
                <WeaponCoatingEffect key={effect.effect.id} effect={effect} />
            ))}
        </div>
    )
})

const WeaponCoatingEffect = memo(function WeaponCoatingEffect({ effect }: { effect: WeaponCoatingEffectGroup }) {
    const { f } = useNumberFormatter()
    const { t, fun } = useTranslations()
    const now = useGameStore((state) => state.now)
    const remaining = Math.max(effect.timer.to - now, 0)
    const color =
        effect.effect.effect === 'DamageRegenMana'
            ? 'text-mana'
            : effect.effect.effect === 'DamageRegenStamina'
              ? 'text-stamina'
              : 'text-health'
    return (
        <div className={`${color} grid gap-0.5 text-sm`}>
            <div className="grid grid-flow-col items-center justify-start gap-1">
                {IconsData[effect.effect.iconId]}
                <span>{t[effect.effect.nameId]}</span>
                <span>
                    {f(effect.totalValue)} {t.PerSec}
                </span>
                <span className="text-muted-foreground">×{effect.count}</span>
                <span className="text-muted-foreground">({fun.formatTime(remaining)})</span>
            </div>
            <TimerProgressFromId
                timerId={effect.timer.id}
                color={color.replace('text-', '') as 'health' | 'stamina' | 'mana'}
                reverse
            />
        </div>
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
    const { t, fun } = useTranslations()
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
                {timer && <span className="text-muted-foreground">{fun.formatTime(timer.to - timer.from)}</span>}
            </span>

            <TimerProgressFromId timerId={timer?.id} color="primary" />
        </div>
    )
})
export const CombatAbilitiesList = memo(function CombatAbilitiesList(props: CharacterCombatProps) {
    const charId = props.char?.id ?? props.charId
    const { char } = props
    const allAbilities = useGameStore(
        useCallback(
            (state: GameState) =>
                charId
                    ? char
                        ? getCombatRotation(char.combatAbilities)
                        : selectCombatRotationChar(charId)(state)
                    : [],
            [char, charId]
        )
    )
    if (!charId) return null
    if (allAbilities.length === 0) return null
    if (allAbilities.length === 1 && allAbilities[0] === AbilitiesEnum.NormalAttack) return null

    return (
        <div>
            <div className={classes.abilitiesList}>
                {allAbilities.map((id, index) => (
                    <CombatAbilityBadge
                        characterId={charId}
                        char={char}
                        abilityId={id}
                        key={id + charId + index}
                        index={index}
                    />
                ))}
            </div>
        </div>
    )
})
const CombatQuickSlotsList = memo(function CombatQuickSlotsList({ charId }: { charId: string }) {
    const quickSlots = useGameStore(useShallow(selectQuickSlots(charId)))

    if (quickSlots.every((quickSlot) => quickSlot === null)) return null

    return (
        <div className={classes.abilitiesList}>
            {quickSlots.map((quickSlot, index) =>
                quickSlot ? <CombatQuickSlot charId={charId} index={index} key={`${charId}-${index}`} /> : null
            )}
        </div>
    )
})
const CombatQuickSlot = memo(function CombatQuickSlot({ charId, index }: { charId: string; index: number }) {
    const quickSlot = useGameStore(
        useCallback((state: GameState) => selectQuickSlot(index, charId)(state), [charId, index])
    )
    const item = useGameStore(
        useCallback(
            (state: GameState) => {
                const slot = selectQuickSlot(index, charId)(state)
                return slot ? selectGameItem(slot.itemId)(state) : undefined
            },
            [charId, index]
        )
    )
    const onClick = useCallback(() => consumeQuickSlotPotionClick(charId, index), [charId, index])

    if (!item) return null
    if (!quickSlot || !item?.potionData) return null

    return (
        <MyHoverCard
            trigger={
                <Button variant="secondary" size="sm" className="gap-1 text-lg" onClick={onClick}>
                    <ItemIcon itemId={item} />
                    <span className="text-sm">{quickSlot.quantity ?? 1}</span>
                </Button>
            }
        >
            <ItemIconName itemId={item} className="text-lg" />

            <PotionDataUi potionData={item.potionData} />
        </MyHoverCard>
    )
})
const CombatAbilityBadge = memo(function CombatAbilityBadge(props: {
    characterId: string
    char?: CharacterState
    abilityId: string
    index: number
}) {
    const { characterId, char, abilityId, index } = props
    const { t } = useTranslations()
    getCharacterSelector(characterId, char)
    const charAbility = useGameStore(
        useCallback(
            (state: GameState) =>
                char?.allCombatAbilities.entries[abilityId] ?? selectCombatAbilityById(abilityId, characterId)(state),
            [abilityId, char, characterId]
        )
    )
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

const estimateLootSize = () => 24
const renderLootItem = (index: number) => <LootUiFromIndex index={index} />

const LootUiFromIndex = memo(function LootUiFromIndex({ index }: { index: number }) {
    const loots = useGameStore(selectLoot)
    const loot = loots[index]
    if (!loot) return null
    return <LootRow loot={loot} key={loot.id} />
})

function BattleLootUi() {
    const { t } = useTranslations()
    const loots = useGameStore(selectLoot)

    return (
        <Card className={classes.loot}>
            <MyCardHeaderTitle title={t.Loot} icon={BAG_ICON} />
            <CardContent className="grid h-80 grid-cols-1 pr-0">
                <AutoScroll
                    totalCount={loots.length}
                    estimateSize={estimateLootSize}
                    autoscroll={true}
                    itemContent={renderLootItem}
                />
            </CardContent>
        </Card>
    )
}

const LootRow = memo(function LootRow(props: { loot: LootId }) {
    const { loot } = props
    const { t } = useTranslations()
    const { f } = useNumberFormatter()
    const item = useGameStore(selectGameItem(loot.itemId))

    const onClick = useCallback(() => collectLootUi(loot.id), [loot])
    const itemName = useItemName(item)

    if (!item) return

    return (
        <div className={classes.lootRow}>
            <span className={classes.svgIcon}>{IconsData[item.icon]}</span>
            <div>{itemName}</div>
            <div className="text-right">{f(loot.quantity)}</div>
            <Button variant="ghost" size="xs" title={t.Collect} onClick={onClick}>
                <GiSwapBag />
            </Button>
        </div>
    )
})
