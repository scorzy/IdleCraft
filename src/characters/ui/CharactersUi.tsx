import { memo, useCallback, useState } from 'react'
import { TbInfoCircle, TbPlus } from 'react-icons/tb'
import { GiHearts, GiMagicPalm, GiStrong } from 'react-icons/gi'
import { clsx } from 'clsx'
import { MyPage, MyPageAll } from '../../ui/pages/MyPage'
import { useGameStore } from '../../game/state'
import { IconsData } from '../../icons/Icons'
import { useTranslations } from '../../msg/useTranslations'
import { MyListItem } from '../../ui/sidebar/MenuItem'
import { SidebarContainer } from '../../ui/sidebar/SidebarContainer'
import { selectCharactersTeamIds } from '../selectors/characterSelectors'
import { setSelectedChar } from '../../ui/state/uiFunctions'
import { isCharReadonly, isCharSelected, isCollapsed, selectSelectedCharId } from '../../ui/state/uiSelectors'
import { MyCardHeaderTitle } from '../../ui/myCard/MyCard'
import { BonusDialog } from '../../bonus/ui/BonusUi'
import { useNumberFormatter } from '../../formatters/selectNumberFormatter'
import { Button } from '../../components/ui/button'
import { addHealthPointClick, addManaPointClick, addStaminaPointClick } from '../characterFunctions'
import { CollapsedEnum } from '../../ui/sidebar/CollapsedEnum'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { PerkPage, PerksSidebar, PerksTab } from '../../perks/ui/PerksUi'
import { MyTabNum } from '../../ui/myCard/MyTabNum'
import { CombatAbilities } from '../../activeAbilities/ui/CombatAbilities'
import { AbilitySidebar, AbilityUi } from '../../activeAbilities/ui/CharAbilities'
import { DamageTypes } from '../../items/Item'
import { DamageTypesData } from '../../items/damageTypes'
import { Card, CardContent, CardTitle } from '../../components/ui/card'
import { CharSkills } from '../../experience/ui/CharSkills'
import { ExperienceCardUi } from '../../experience/ui/ExperienceCard'
import { getCharacterSelector } from '../getCharacterSelector'
import { GameState } from '../../game/GameState'
import classes from './charactersUi.module.css'
import { CharEquipments } from './CharEquipments'

export const CharactersUi = memo(function CharactersUi() {
    const { t } = useTranslations()
    const [tab, setTab] = useState('info')

    let sidebar = null
    if (tab === 'perks') sidebar = <PerksSidebar />
    else if (tab === 'abilities') sidebar = <AbilitySidebar />

    return (
        <Tabs value={tab} onValueChange={(value) => setTab(value)} className="overflow-auto" orientation="vertical">
            <MyPageAll sidebar={<CharactersSidebar />}>
                <div className="page__container-sidebar">
                    <div className="page__all">
                        <div className="page__header">
                            <TabsList className="m-3">
                                <TabsTrigger value="info">
                                    <StatsTab />
                                </TabsTrigger>
                                <TabsTrigger value="perks">
                                    <PerksTab />
                                </TabsTrigger>
                                <TabsTrigger value="abilities">{t.Abilities}</TabsTrigger>
                                <TabsTrigger value="equipments">{t.Equipments}</TabsTrigger>
                                <TabsTrigger value="skills">{t.Skills}</TabsTrigger>
                            </TabsList>
                        </div>

                        {sidebar && <div className="page__sidebar">{sidebar}</div>}

                        <div className="page__main2">
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

                            <TabsContent value="skills">
                                <MyPage className="page__main">
                                    <CharSkills />
                                </MyPage>
                            </TabsContent>
                        </div>
                    </div>
                </div>
            </MyPageAll>
        </Tabs>
    )
})

export const StatsTab = memo(function StatsTab() {
    const { t } = useTranslations()

    const charId = useGameStore(selectSelectedCharId)

    const used = useGameStore(useCallback((s: GameState) => getCharacterSelector(charId).UsedAttributes(s), [charId]))
    const max = useGameStore(useCallback((s: GameState) => getCharacterSelector(charId).MaxAttributes(s), [charId]))

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

    const charSel = getCharacterSelector(charId)
    const name = useGameStore(useCallback((s) => charSel.Name(s), [charSel]))
    const iconId = useGameStore(useCallback((s) => charSel.Icon(s), [charSel]))
    const active = useGameStore(isCharSelected(charId))

    const onClick = useCallback(() => setSelectedChar(charId), [charId])

    return <MyListItem text={name} collapsed={collapsed} icon={IconsData[iconId]} active={active} onClick={onClick} />
})

const CharInfo = memo(function CharInfo() {
    const { t } = useTranslations()
    const charId = useGameStore(selectSelectedCharId)
    return (
        <div className="grid gap-4">
            <CharLevelUi charId={charId} />
            <Card>
                <MyCardHeaderTitle icon={<TbInfoCircle />} title={t.Info} />
                <CardContent className="grid gap-2">
                    <StatsInfo />

                    <CardTitle className="mt-2">{t.Attack}</CardTitle>
                    <AttackInfo charId={charId} />

                    <CardTitle className="mt-2">{t.Defence}</CardTitle>
                    <ArmourInfo charId={charId} />
                </CardContent>
            </Card>
        </div>
    )
})

const StatsInfo = memo(function StatsInfo() {
    const { f } = useNumberFormatter()
    const { t } = useTranslations()

    const charId = useGameStore(selectSelectedCharId)

    const charSel = getCharacterSelector(charId)

    const usedPoints = useGameStore(useCallback((s: GameState) => charSel.UsedAttributes(s), [charSel]))
    const maxPoints = useGameStore(useCallback((s: GameState) => charSel.MaxAttributes(s), [charSel]))

    const health = useGameStore(useCallback((s: GameState) => charSel.Health(s), [charSel]))
    const maxH = useGameStore(useCallback((s: GameState) => charSel.MaxHealth(s), [charSel]))
    const maxHB = charSel.MaxHealthList.bind(charSel)

    const stamina = useGameStore(useCallback((s: GameState) => charSel.Stamina(s), [charSel]))
    const maxS = useGameStore(useCallback((s: GameState) => charSel.MaxStamina(s), [charSel]))
    const maxSB = charSel.MaxStaminaList.bind(charSel)

    const mana = useGameStore(useCallback((s: GameState) => charSel.Mana(s), [charSel]))
    const maxM = useGameStore(useCallback((s: GameState) => charSel.MaxMana(s), [charSel]))
    const maxMB = charSel.MaxManaList.bind(charSel)

    const healthClick = useCallback(() => addHealthPointClick(charId), [charId])
    const staminaClick = useCallback(() => addStaminaPointClick(charId), [charId])
    const manaClick = useCallback(() => addManaPointClick(charId), [charId])

    const readonly = useGameStore(isCharReadonly)

    const hasUnused = usedPoints < maxPoints

    return (
        <div className={clsx(classes.stats, 'text-sm')}>
            <span>
                {t.Points} {f(usedPoints)}/{f(maxPoints)}
            </span>
            <div className={classes.line}>
                <GiHearts />
                <span className={classes.stat}>
                    {t.Health}{' '}
                    <span className={classes.max}>
                        {f(health)} / {f(maxH)}
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
                        {f(stamina)} / {f(maxS)}
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
                        {f(mana)} / {f(maxM)}
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

const CharLevelUi = memo(function CharLevelUi(props: { charId: string }) {
    const { charId } = props

    const charSel = getCharacterSelector(charId)

    const level = useGameStore(useCallback((s: GameState) => charSel.Level(s), [charSel]))
    const xp = useGameStore(useCallback((s: GameState) => charSel.Exp(s), [charSel]))
    const levelXp = useGameStore(useCallback((s: GameState) => charSel.LevelExp(s), [charSel]))
    const nextLevelXp = useGameStore(useCallback((s: GameState) => charSel.NextLevelExp(s), [charSel]))

    return <ExperienceCardUi title={'Level'} level={level} xp={xp} levelXp={levelXp} nextLevelXp={nextLevelXp} />
})

const armourTypes = Object.values(DamageTypes).sort()

export const ArmourInfo = memo(function ArmourInfo(props: { charId: string }) {
    const { charId } = props

    return (
        <ul>
            {armourTypes.map((type) => (
                <ArmourTypeInfo key={type} type={type} charId={charId} />
            ))}
        </ul>
    )
})
const ArmourTypeInfo = memo(function ArmourTypeInfo(props: { type: DamageTypes; charId: string }) {
    const { type, charId } = props
    const { f } = useNumberFormatter()
    const { t } = useTranslations()
    const charSel = getCharacterSelector(charId)
    const value = useGameStore(useCallback((s) => charSel.armour[type].Armour(s), [charSel, type]))
    const list = charSel.armour[type].ArmourList
    const data = DamageTypesData[type]
    const name = t[data.ArmourName]
    return (
        <li className="grid grid-flow-col items-center justify-start gap-2 text-sm">
            {name} {f(value)}
            <BonusDialog title={name} selectBonusResult={list} />
        </li>
    )
})
export const AttackInfo = memo(function AttackInfo(props: { charId: string }) {
    const { charId } = props
    const { ft } = useNumberFormatter()
    const { t } = useTranslations()

    const charSel = getCharacterSelector(charId)

    const damage = useGameStore(charSel.AllAttackDamage)
    const speed = useGameStore(charSel.AttackSpeed)
    const speedList = charSel.AttackSpeedList

    return (
        <div>
            <div className="grid grid-flow-col items-center justify-start gap-2 text-sm">
                {t.NormalAttack} {ft(speed)}
                <BonusDialog title={t.NormalAttack} selectBonusResult={speedList} isTime={true} />
            </div>
            <div className="grid grid-flow-col items-center justify-start gap-2 text-sm">
                <ul>
                    {Object.entries(damage).map((kv) => (
                        <AttackTypeInfo
                            key={kv[0]}
                            charId={charId}
                            damage={kv[1]}
                            damageType={kv[0] as DamageTypes}
                        ></AttackTypeInfo>
                    ))}
                </ul>
            </div>
        </div>
    )
})
export const AttackTypeInfo = memo(function AttackTypeInfo(props: {
    charId: string
    damage: number
    damageType: DamageTypes
}) {
    const { charId, damage, damageType } = props
    const { f } = useNumberFormatter()
    const { t } = useTranslations()

    const damageList = getCharacterSelector(charId).damage[damageType].DamageList
    return (
        <li className="grid grid-flow-col items-center justify-start gap-2">
            {t[DamageTypesData[damageType].DamageName]} {f(damage)}
            <BonusDialog title={t.NormalAttack} selectBonusResult={damageList} />
        </li>
    )
})
