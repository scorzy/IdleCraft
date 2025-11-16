import { memo, useCallback } from 'react'
import { GiHearts, GiMagicPalm, GiStrong } from 'react-icons/gi'
import { DialogTrigger } from '@radix-ui/react-dialog'
import { MyPage, MyPageAll } from '../../ui/pages/MyPage'
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../components/ui/dialog'
import { ItemInfo } from '../../items/ui/ItemInfo'
import { ItemRewardUi } from '../../quests/ui/QuestUi'
import { ItemIconName } from '../../items/ui/ItemIconName'
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
            <CardContent className="container">
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
    const { t } = useTranslations()
    const { f } = useNumberFormatter()
    return (
        <div className={classes.enemyInfoUi}>
            <span className="relative flex h-9 w-9 shrink-0 overflow-hidden text-4xl">
                <span className="aspect-square h-full w-full">{IconsData[enemy.iconId]}</span>
            </span>
            <div className="space-y-1">
                <p className="text-sm leading-none font-medium">
                    {t[enemy.nameId as keyof typeof t]}
                    {quantity > 1 && <span className="text-muted-foreground"> X {f(quantity)}</span>}
                </p>
                <p className="grid grid-flow-col items-center justify-start gap-2 text-sm">
                    <span>
                        {t.Lv} {f(enemy.level)}
                    </span>
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
            <div>
                <EnemyDropsUi templateEnum={templateEnum} />
            </div>
        </div>
    )
})
const EnemyDropsUi = memo(function EnemyDropsUi({ templateEnum }: { templateEnum: CharTemplateEnum }) {
    const template = CharTemplatesData[templateEnum]
    const enemy = generateCharacter(template)
    const { t } = useTranslations()
    const { f } = useNumberFormatter()
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size="xs" variant="secondary">
                    {t.Drops}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {IconsData[enemy.iconId]} {t[enemy.nameId as keyof typeof t]} {t.Drops}
                    </DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    {template.loot.map((loot) => (
                        <div key={loot.itemId} className="flex justify-start gap-2 align-middle">
                            <ItemIconName itemId={loot.itemId} />
                            {loot.quantity > 1 && <span> x {f(loot.quantity)}</span>}
                        </div>
                    ))}
                </DialogDescription>
            </DialogContent>
        </Dialog>
    )
})
