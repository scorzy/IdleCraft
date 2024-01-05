import { memo, useCallback, useState } from 'react'
import { GiHearts, GiMagicPalm, GiStrong } from 'react-icons/gi'
import { MyPage } from '../../ui/pages/MyPage'
import { MyCard } from '../../ui/myCard/myCard'
import { CollapsibleMenu, MyListItem } from '../../ui/sidebar/MenuItem'
import { BattleAreas, BattleAreasList } from '../battleAreas'
import { useTranslations } from '../../msg/useTranslations'
import { IconsData } from '../../icons/Icons'
import { BattleZoneEnum } from '../BattleZoneEnum'
import { BattleZones } from '../BattleZones'
import { setArea } from '../functions/setArea'
import { useGameStore } from '../../game/state'
import { isBattleZoneSelected } from '../selectors/isBattleZoneSelected'
import { selectBattleZone } from '../selectors/selectBattleZone'
import { Button } from '../../components/ui/button'
import { SidebarContainer } from '../../ui/sidebar/SidebarContainer'
import { CharTemplateEnum } from '../../characters/templates/characterTemplateEnum'
import { generateCharacter } from '../../characters/templates/generateCharacter'
import { CharTemplatesData } from '../../characters/templates/charTemplateData'
import { useNumberFormatter } from '../../formatters/selectNumberFormatter'
import { addBattle } from '../functions/addBattle'
import classes from './battleZone.module.css'

export const CombatPage = memo(function CombatPage() {
    return <CombatAreas />
})
const CombatAreas = memo(function CombatAreas() {
    const [collapsed, setCollapsed] = useState(false)
    return (
        <div className={classes.container}>
            <div className={classes.allPage}>
                <SidebarContainer
                    className={classes.side}
                    collapsed={collapsed}
                    collapseClick={() => setCollapsed((c) => !c)}
                >
                    {BattleAreasList.map((bt) => (
                        <BattleAreasListUi bt={bt} key={bt.nameId} parentCollapsed={collapsed} />
                    ))}
                </SidebarContainer>
                <MyPage>
                    <div className={classes.areaCards}>
                        <BattleZoneInfoUi />
                    </div>
                </MyPage>
            </div>
        </div>
    )
})
const BattleAreasListUi = memo(function BattleAreasList(props: { bt: BattleAreas; parentCollapsed: boolean }) {
    const { bt, parentCollapsed } = props
    const [collapsed, setCollapsed] = useState(false)
    const toggleCollapsed = () => setCollapsed((v) => !v)

    return (
        <CollapsibleMenu
            key={bt.id}
            collapsed={collapsed}
            collapseClick={toggleCollapsed}
            parentCollapsed={parentCollapsed}
            name={bt.nameId}
            icon={IconsData[bt.iconId]}
        >
            {bt.zones.map((z) => (
                <BattleZoneUi key={z} battleZoneEnum={z} parentCollapsed={parentCollapsed} />
            ))}
        </CollapsibleMenu>
    )
})
const BattleZoneUi = memo(function BattleZoneUi(props: { battleZoneEnum: BattleZoneEnum; parentCollapsed: boolean }) {
    const { battleZoneEnum, parentCollapsed } = props
    const { t } = useTranslations()
    const battleZone = BattleZones[battleZoneEnum]

    const set = useCallback(() => setArea(battleZoneEnum), [battleZoneEnum])
    const active = useGameStore(isBattleZoneSelected(battleZoneEnum))

    return (
        <MyListItem
            collapsed={parentCollapsed}
            active={active}
            text={t[battleZone.nameId]}
            icon={IconsData[battleZone.iconId]}
            onClick={set}
        />
    )
})
const BattleZoneInfoUi = memo(function BattleZoneInfoUi() {
    const battleZoneEnum = useGameStore(selectBattleZone)

    const onAddClick = useCallback(() => {
        console.log(battleZoneEnum)
        if (battleZoneEnum) addBattle(battleZoneEnum)
    }, [battleZoneEnum])

    if (!battleZoneEnum) return <></>
    const battleZone = BattleZones[battleZoneEnum]
    return (
        <MyCard
            title={battleZone.nameId}
            icon={IconsData[battleZone.iconId]}
            actions={
                <>
                    <Button onClick={onAddClick}>Fight</Button>
                </>
            }
        >
            {battleZone.enemies.map((e, index) => (
                <EnemyInfoUi key={e.template + index} quantity={e.quantity} templateEnum={e.template} />
            ))}
        </MyCard>
    )
})
const EnemyInfoUi = memo(function EnemyInfoUi(props: { quantity: number; templateEnum: CharTemplateEnum }) {
    const { quantity, templateEnum } = props
    const template = CharTemplatesData[templateEnum]
    const enemy = generateCharacter(template)
    const { t } = useTranslations()
    const { f } = useNumberFormatter()
    return (
        <div className="flex items-center">
            <span className="relative flex shrink-0 overflow-hidden h-9 w-9 text-4xl">
                <span className="aspect-square h-full w-full">{IconsData[enemy.iconId]}</span>
            </span>
            <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">
                    {t[enemy.nameId]} X {f(quantity)}
                </p>
                <p className="text-sm text-muted-foreground grid grid-flow-col gap-2">
                    <span>Lv. {f(enemy.level)}</span>
                    <span className="text-health">
                        <GiHearts className="inline" />
                        {f(enemy.health)}
                    </span>
                    <span className="text-stamina">
                        <GiStrong className="inline" />
                        {f(enemy.stamina)}
                    </span>
                    <span className="text-mana">
                        <GiMagicPalm className="inline" />
                        {f(enemy.mana)}
                    </span>
                </p>
            </div>
        </div>
    )
})
