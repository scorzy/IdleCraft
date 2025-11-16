import { memo, useCallback } from 'react'
import { GiHearts, GiMagicPalm, GiStrong } from 'react-icons/gi'
import { MyPage, MyPageAll } from '../../ui/pages/MyPage'
import { MyCardHeaderTitle } from '../../ui/myCard/MyCard'
import { MyListItem } from '../../ui/sidebar/MenuItem'
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
import { CollapsedEnum } from '../../ui/sidebar/CollapsedEnum'
import { Card, CardContent, CardFooter } from '../../components/ui/card'
import { addBattle } from '../functions/addBattle'
import classes from './battleZone.module.css'

export const CombatPage = memo(function CombatPage() {
    const btId = useGameStore(selectBattleZone)
    const bt = BattleAreasList.find((ba) => ba.id === btId)

    return (
        <MyPageAll sidebar={<CombatSidebar />}>
            <MyPage className={classes.areaCards}>
                {bt && bt.zones.map((z) => <BattleZoneInfoUi key={z} battleZoneEnum={z} />)}
            </MyPage>
        </MyPageAll>
    )
})

const CombatSidebar = memo(function CombatSidebar() {
    return (
        <SidebarContainer collapsedId={CollapsedEnum.Combat}>
            {BattleAreasList.map((bt) => (
                <BattleAreasListUi bt={bt} key={bt.nameId} />
            ))}
        </SidebarContainer>
    )
})

const BattleAreasListUi = memo(function BattleAreasList({ bt }: { bt: BattleAreas }) {
    const { t } = useTranslations()
    const set = useCallback(() => setArea(bt.id), [bt.id])
    const active = useGameStore(isBattleZoneSelected(bt.id))

    return (
        <MyListItem
            collapsedId={CollapsedEnum.Combat}
            active={active}
            text={t[bt.nameId]}
            icon={IconsData[bt.iconId]}
            onClick={set}
        />
    )
})

const BattleZoneInfoUi = memo(function BattleZoneInfoUi({ battleZoneEnum }: { battleZoneEnum: BattleZoneEnum }) {
    const { t } = useTranslations()

    const onAddClick = useCallback(() => {
        if (battleZoneEnum) addBattle(battleZoneEnum)
    }, [battleZoneEnum])

    if (!battleZoneEnum) return null
    const battleZone = BattleZones[battleZoneEnum]
    return (
        <Card>
            <MyCardHeaderTitle title={t.Enemies} />
            <CardContent>
                {battleZone.enemies.map((e) => (
                    <EnemyInfoUi key={e.id} quantity={e.quantity} templateEnum={e.template} />
                ))}
            </CardContent>
            <CardFooter>
                <Button onClick={onAddClick}>{t.Fight}</Button>
            </CardFooter>
        </Card>
    )
})
const EnemyInfoUi = memo(function EnemyInfoUi({
    quantity,
    templateEnum,
}: {
    quantity: number
    templateEnum: CharTemplateEnum
}) {
    const template = CharTemplatesData[templateEnum]
    const enemy = generateCharacter(template)

    const { f } = useNumberFormatter()
    return (
        <div className="flex items-center">
            <span className="relative flex h-9 w-9 shrink-0 overflow-hidden text-4xl">
                <span className="aspect-square h-full w-full">{IconsData[enemy.iconId]}</span>
            </span>
            <div className="ml-4 space-y-1">
                <p className="text-sm leading-none font-medium">
                    {enemy.nameId} X {f(quantity)}
                </p>
                <p className="grid grid-flow-col gap-2 text-sm">
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
