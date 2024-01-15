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
import { isCharSelected, isCollapsed, selectSelectedCharId } from '../../ui/state/uiSelectors'
import { MyCard } from '../../ui/myCard/MyCard'
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
import classes from './charactersUi.module.css'

export const CharactersUi = memo(function CharactersUi() {
    const [tab, setTab] = useState('info')
    return (
        <Tabs value={tab} onValueChange={(value) => setTab(value)} className="overflow-auto">
            <MyPageAll sidebar={<CharactersSidebar />}>
                <MyPageAll
                    sidebar={tab === 'perks' && <PerksSidebar />}
                    header={
                        <TabsList className="m-3">
                            <TabsTrigger value="info">
                                <StatsTab />
                            </TabsTrigger>
                            <TabsTrigger value="perks">
                                <PerksTab />
                            </TabsTrigger>
                        </TabsList>
                    }
                >
                    <TabsContent value="info">
                        <MyPage className="page__main">
                            <CharInfo />
                        </MyPage>
                    </TabsContent>
                    <TabsContent value="perks">
                        <MyPage className="page__main">
                            <PerkPage />
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

    const hasUnused = maxPoints - usedPoints > 0

    return (
        <MyCard icon={<TbInfoCircle />} title={t.Info}>
            <div className={classes.stats}>
                <span className="text-muted-foreground">
                    Points {f(usedPoints)}/{f(maxPoints)}
                </span>
                <div className={classes.line}>
                    <GiHearts />
                    <span className={classes.stat}>
                        Health{' '}
                        <span className={classes.max}>
                            {f(health)}/{f(maxH)}
                        </span>
                    </span>
                    <BonusDialog title={t.Health} selectBonusResult={maxHB} />
                    <Button variant="health" size="xs" disabled={!hasUnused} onClick={healthClick}>
                        <TbPlus />
                    </Button>
                </div>
                <div className={classes.line}>
                    <GiStrong />
                    <span className={classes.stat}>
                        Stamina{' '}
                        <span className={classes.max}>
                            {f(stamina)}/{f(maxS)}
                        </span>
                    </span>
                    <BonusDialog title={t.Stamina} selectBonusResult={maxSB} />
                    <Button variant="stamina" size="xs" disabled={!hasUnused} onClick={staminaClick}>
                        <TbPlus />
                    </Button>
                </div>
                <div className={classes.line}>
                    <GiMagicPalm />
                    <span className={classes.stat}>
                        Mana{' '}
                        <span className={classes.max}>
                            {f(mana)}/{f(maxM)}
                        </span>
                    </span>
                    <BonusDialog title={t.Mana} selectBonusResult={maxMB} />
                    <Button variant="mana" size="xs" disabled={!hasUnused} onClick={manaClick}>
                        <TbPlus />
                    </Button>
                </div>
            </div>
        </MyCard>
    )
})
