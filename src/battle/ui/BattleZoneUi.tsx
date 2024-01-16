import { memo, useCallback } from 'react'
import { GiHearts, GiMagicPalm, GiStrong } from 'react-icons/gi'
import { MyPage, MyPageAll } from '../../ui/pages/MyPage'
import { MyCard } from '../../ui/myCard/MyCard'
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
import { CollapsedEnum } from '../../ui/sidebar/CollapsedEnum'
import { isCollapsed } from '../../ui/state/uiSelectors'
import classes from './battleZone.module.css'

export const CombatPage = memo(function CombatPage() {
    return (
        <MyPageAll sidebar={<CombatSidebar />}>
            <MyPage className={classes.areaCards}>
                <BattleZoneInfoUi />
            </MyPage>
        </MyPageAll>
    )
})

const CombatSidebar = memo(function CombatSidebar() {
    const collapsed = useGameStore(isCollapsed(CollapsedEnum.Combat))
    return (
        <SidebarContainer collapsedId={CollapsedEnum.Combat}>
            {BattleAreasList.map((bt) => (
                <BattleAreasListUi bt={bt} key={bt.nameId} parentCollapsed={collapsed} />
            ))}
        </SidebarContainer>
    )
})

const BattleAreasListUi = memo(function BattleAreasList(props: { bt: BattleAreas; parentCollapsed: boolean }) {
    const { bt, parentCollapsed } = props

    return (
        <CollapsibleMenu
            key={bt.id}
            collapsedId={CollapsedEnum.BattleArea}
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
        if (battleZoneEnum) addBattle(battleZoneEnum)
    }, [battleZoneEnum])

    if (!battleZoneEnum) return <></>
    const battleZone = BattleZones[battleZoneEnum]
    return (
        <MyCard
            title="Enemies"
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

    const { f } = useNumberFormatter()
    return (
        <div className="flex items-center">
            <span className="relative flex shrink-0 overflow-hidden h-9 w-9 text-4xl">
                <span className="aspect-square h-full w-full">{IconsData[enemy.iconId]}</span>
            </span>
            <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">
                    {enemy.nameId} X {f(quantity)}
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
