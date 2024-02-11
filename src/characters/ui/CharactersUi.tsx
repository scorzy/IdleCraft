import { memo, useCallback, useState } from 'react'
import { TbInfoCircle, TbPlus } from 'react-icons/tb'
import { GiHearts, GiMagicPalm, GiStrong } from 'react-icons/gi'
import { MyPage, MyPageAll } from '../../ui/pages/MyPage'
import { useGameStore } from '../../game/state'
import { IconsData } from '../../icons/Icons'
import { useTranslations } from '../../msg/useTranslations'
import { MyListItem } from '../../ui/sidebar/MenuItem'
import { SidebarContainer } from '../../ui/sidebar/SidebarContainer'
import {
    selectCharHealth,
    selectCharIcon,
    selectCharMana,
    selectCharName,
    selectCharStamina,
    selectCharactersTeamIds,
} from '../selectors/characterSelectors'
import { setSelectedChar } from '../../ui/state/uiFunctions'
import { isCharReadonly, isCharSelected, isCollapsed, selectSelectedCharId } from '../../ui/state/uiSelectors'
import { MyCardHeaderTitle } from '../../ui/myCard/MyCard'
import { selectCharacterMaxHealth, selectCharacterMaxHealthList } from '../selectors/healthSelectors'
import { selectCharacterMaxMana, selectCharacterMaxManaList } from '../selectors/manaSelectors'
import { selectCharacterMaxStamina, selectCharacterMaxStaminaList } from '../selectors/staminaSelectors'
import { BonusDialog } from '../../bonus/ui/BonusUi'
import { useNumberFormatter } from '../../formatters/selectNumberFormatter'
import { Button } from '../../components/ui/button'
import { selectCharacterMaxAttr, selectCharacterUsedAttr } from '../characterSelectors'
import { addHealthPointClick, addManaPointClick, addStaminaPointClick } from '../characterFunctions'
import { CollapsedEnum } from '../../ui/sidebar/CollapsedEnum'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { PerkPage, PerksSidebar, PerksTab } from '../../perks/ui/PerksUi'
import { MyTabNum } from '../../ui/myCard/MyTabNum'
import { CombatAbilities } from '../../activeAbilities/ui/CombatAbilities'
import { AbilitySidebar, AbilityUi } from '../../activeAbilities/ui/CharAbilities'
import { DamageTypes } from '../../items/Item'
import { selectCharacterArmour, selectCharacterArmourList } from '../selectors/armourSelector'
import { DamageTypesData } from '../../items/damageTypes'
import { Card, CardContent } from '../../components/ui/card'
import { selectCharacterAttackDamage, selectCharacterAttackDamageList } from '../selectors/attackDamageSelectors'
import { selectCharacterAttackSpeed, selectCharacterAttackSpeedList } from '../selectors/attackSpeedSelectors'
import { selectDamageType } from '../selectors/selectDamageType'
import classes from './charactersUi.module.css'
import { CharEquipments } from './CharEquipments'

export const CharactersUi = memo(function CharactersUi() {
    const { t } = useTranslations()
    const [tab, setTab] = useState('info')

    let sidebar = null
    if (tab === 'perks') sidebar = <PerksSidebar />
    else if (tab === 'abilities') sidebar = <AbilitySidebar />

    return (
        <Tabs value={tab} onValueChange={(value) => setTab(value)} className="overflow-auto">
            <MyPageAll sidebar={<CharactersSidebar />}>
                <MyPageAll
                    sidebar={sidebar}
                    header={
                        <TabsList className="m-3">
                            <TabsTrigger value="info">
                                <StatsTab />
                            </TabsTrigger>
                            <TabsTrigger value="perks">
                                <PerksTab />
                            </TabsTrigger>
                            <TabsTrigger value="abilities">{t.Abilities}</TabsTrigger>
                            <TabsTrigger value="equipments">{t.Equipments}</TabsTrigger>
                        </TabsList>
                    }
                >
                    <TabsContent value="info">
                        <MyPage className="page__main">
                            <CharInfo />
                            <CombatAbilities />
                        </MyPage>
                    </TabsContent>

                    <TabsContent value="perks">
                        <MyPage className="page__main">
                            <PerkPage />
                        </MyPage>
                    </TabsContent>

                    <TabsContent value="abilities">
                        <MyPage className="page__main">
                            <AbilityUi />
                        </MyPage>
                    </TabsContent>

                    <TabsContent value="equipments">
                        <MyPage className="page__main">
                            <CharEquipments />
                        </MyPage>
                    </TabsContent>
                </MyPageAll>
            </MyPageAll>
        </Tabs>
    )
})

export const StatsTab = memo(function StatsTab() {
    const { t } = useTranslations()
    const charId = useGameStore(selectSelectedCharId)
    const used = useGameStore(selectCharacterUsedAttr(charId))
    const max = useGameStore(selectCharacterMaxAttr(charId))
    const diff = Math.floor(max - used)

    return <MyTabNum text={t.Stats} num={diff} />
})

const CharactersSidebar = memo(function CharactersSidebar() {
    const charIds = useGameStore(selectCharactersTeamIds)
    const collapsed = useGameStore(isCollapsed(CollapsedEnum.Characters))
    return (
        <SidebarContainer collapsedId={CollapsedEnum.Characters}>
            {charIds.map((t) => (
                <CharacterLink key={t} charId={t} collapsed={collapsed} />
            ))}
        </SidebarContainer>
    )
})
const CharacterLink = memo(function CharacterLink(props: { charId: string; collapsed: boolean }) {
    const { charId, collapsed } = props

    const nameId = useGameStore(selectCharName(charId))
    const iconId = useGameStore(selectCharIcon(charId))
    const active = useGameStore(isCharSelected(charId))

    const onClick = useCallback(() => setSelectedChar(charId), [charId])

    return <MyListItem text={nameId} collapsed={collapsed} icon={IconsData[iconId]} active={active} onClick={onClick} />
})

const CharInfo = memo(function CharInfo() {
    const { t } = useTranslations()
    return (
        <Card>
            <MyCardHeaderTitle icon={<TbInfoCircle />} title={t.Info} />
            <CardContent className="grid gap-2">
                <StatsInfo />
                <AttackInfo />
                <ArmourInfo />
            </CardContent>
        </Card>
    )
})

const StatsInfo = memo(function StatsInfo() {
    const { f } = useNumberFormatter()
    const { t } = useTranslations()

    const charId = useGameStore(selectSelectedCharId)

    const maxPoints = useGameStore(selectCharacterMaxAttr(charId))
    const usedPoints = useGameStore(selectCharacterUsedAttr(charId))

    const health = useGameStore(selectCharHealth(charId))
    const maxH = useGameStore(selectCharacterMaxHealth(charId))
    const maxHB = selectCharacterMaxHealthList(charId)

    const stamina = useGameStore(selectCharStamina(charId))
    const maxS = useGameStore(selectCharacterMaxStamina(charId))
    const maxSB = selectCharacterMaxStaminaList(charId)

    const mana = useGameStore(selectCharMana(charId))
    const maxM = useGameStore(selectCharacterMaxMana(charId))
    const maxMB = selectCharacterMaxManaList(charId)

    const healthClick = useCallback(() => addHealthPointClick(charId), [charId])
    const staminaClick = useCallback(() => addStaminaPointClick(charId), [charId])
    const manaClick = useCallback(() => addManaPointClick(charId), [charId])

    const readonly = useGameStore(isCharReadonly)

    const hasUnused = usedPoints < maxPoints

    return (
        <div className={classes.stats}>
            <span className="text-muted-foreground">
                {t.Points} {f(usedPoints)}/{f(maxPoints)}
            </span>
            <div className={classes.line}>
                <GiHearts />
                <span className={classes.stat}>
                    {t.Health}{' '}
                    <span className={classes.max}>
                        {f(health)}/{f(maxH)}
                    </span>
                </span>
                <BonusDialog title={t.Health} selectBonusResult={maxHB} />
                {!readonly && (
                    <Button variant="health" size="xs" disabled={!hasUnused} onClick={healthClick}>
                        <TbPlus />
                    </Button>
                )}
            </div>
            <div className={classes.line}>
                <GiStrong />
                <span className={classes.stat}>
                    {t.Stamina}{' '}
                    <span className={classes.max}>
                        {f(stamina)}/{f(maxS)}
                    </span>
                </span>
                <BonusDialog title={t.Stamina} selectBonusResult={maxSB} />
                {!readonly && (
                    <Button variant="stamina" size="xs" disabled={!hasUnused} onClick={staminaClick}>
                        <TbPlus />
                    </Button>
                )}
            </div>
            <div className={classes.line}>
                <GiMagicPalm />
                <span className={classes.stat}>
                    {t.Mana}{' '}
                    <span className={classes.max}>
                        {f(mana)}/{f(maxM)}
                    </span>
                </span>
                <BonusDialog title={t.Mana} selectBonusResult={maxMB} />
                {!readonly && (
                    <Button variant="mana" size="xs" disabled={!hasUnused} onClick={manaClick}>
                        <TbPlus />
                    </Button>
                )}
            </div>
        </div>
    )
})

const armourTypes = Object.values(DamageTypes).sort()

const ArmourInfo = memo(function ArmourInfo() {
    const { t } = useTranslations()
    return (
        <div>
            {t.Defence}
            {armourTypes.map((type) => (
                <ArmourTypeInfo key={type} type={type} />
            ))}
        </div>
    )
})
const ArmourTypeInfo = memo(function ArmourTypeInfo(props: { type: DamageTypes }) {
    const { type } = props
    const { f } = useNumberFormatter()
    const { t } = useTranslations()
    const charId = useGameStore(selectSelectedCharId)
    const value = useGameStore(selectCharacterArmour(charId, type))
    const list = selectCharacterArmourList(charId, type)
    const data = DamageTypesData[type]
    const name = t[data.ArmourName]
    return (
        <div className="text-muted-foreground grid grid-flow-col items-center justify-start gap-2">
            {name} {f(value)}
            <BonusDialog title={name} selectBonusResult={list} />
        </div>
    )
})
const AttackInfo = memo(function AttackInfo() {
    const { f, ft } = useNumberFormatter()
    const { t } = useTranslations()
    const charId = useGameStore(selectSelectedCharId)

    const damage = useGameStore(selectCharacterAttackDamage(charId))
    const damageList = selectCharacterAttackDamageList(charId)

    const speed = useGameStore(selectCharacterAttackSpeed(charId))
    const speedList = selectCharacterAttackSpeedList(charId)

    const damageType = useGameStore(selectDamageType(charId))

    return (
        <div>
            {t.Attack}
            <div className="text-muted-foreground grid grid-flow-col items-center justify-start gap-2">
                {t.Damage} {f(damage)}
                <BonusDialog title={t.NormalAttack} selectBonusResult={damageList} />
            </div>
            <div className="text-muted-foreground grid grid-flow-col items-center justify-start gap-2">
                {t[DamageTypesData[damageType].DamageName]}
            </div>
            <div className="text-muted-foreground grid grid-flow-col items-center justify-start gap-2">
                {t.NormalAttack} {ft(speed)}
                <BonusDialog title={t.NormalAttack} selectBonusResult={speedList} isTime={true} />
            </div>
        </div>
    )
})
