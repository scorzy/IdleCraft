import { memo, useCallback, useState } from 'react'
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
import classes from './combat.module.css'

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

    if (!battleZoneEnum) return <></>

    const battleZone = BattleZones[battleZoneEnum]
    return (
        <MyCard
            title={battleZone.nameId}
            icon={IconsData[battleZone.iconId]}
            actions={
                <>
                    <Button>Fight</Button>
                </>
            }
        ></MyCard>
    )
})
