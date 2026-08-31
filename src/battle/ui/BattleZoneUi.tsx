import { memo, useCallback } from 'react'
import { GiHearts, GiMagicPalm, GiStrong } from 'react-icons/gi'
import { AddActivityDialog } from '../../activities/ui/AddActivityDialog'
import { CharacterId, getCharacterDefinition } from '../../characters/templates/characterRegistry'
import { generateCharacter } from '../../characters/templates/generateCharacter'
import { CharCombatInfo } from '../../characters/ui/CharactersUi'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardFooter } from '../../components/ui/card'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '../../components/ui/dialog'
import { useNumberFormatter } from '../../formatters/selectNumberFormatter'
import { useGameStore } from '../../game/state'
import { IconsData } from '../../icons/Icons'
import { ItemIconName } from '../../items/ui/ItemIconName'
import { useTranslations } from '../../msg/useTranslations'
import { MyPage, MyPageAll } from '../../ui/pages/MyPage'
import { CollapsedEnum } from '../../ui/sidebar/CollapsedEnum'
import { CollapsibleMenu, MyListItem } from '../../ui/sidebar/MenuItem'
import { SidebarContainer } from '../../ui/sidebar/SidebarContainer'
import { CharacterState } from '../../characters/characterState'
import { getTemplateWeaponCoating } from '../../weaponCoatings/weaponCoatingFunctions'
import { BattleZoneEnum } from '../BattleZoneEnum'
import { BattleZones } from '../BattleZones'
import { BattleAreas, BattleAreasList } from '../battleAreas'
import { addBattle } from '../functions/addBattle'
import { setArea } from '../functions/setArea'
import { isBattleZoneSelected } from '../selectors/isBattleZoneSelected'
import { selectBattleZone } from '../selectors/selectBattleZone'
import { ActiveWeaponCoating, CombatAbilitiesList } from './CombatUi'
import classes from './battleZone.module.css'
import { MyCardHeaderTitle } from '../../ui/myCard/MyCard'

const templateCharacters = new Map<CharacterId, CharacterState>()

const getTemplateCharacter = (templateId: CharacterId) => {
    let character = templateCharacters.get(templateId)
    if (!character) {
        character = generateCharacter(templateId, getCharacterDefinition(templateId))
        character.weaponCoating = getTemplateWeaponCoating(useGameStore.getState(), character)
        templateCharacters.set(templateId, character)
    }
    return character
}

export const CombatPage = memo(function CombatPage() {
    const battleZoneEnum = useGameStore(selectBattleZone)

    return (
        <MyPageAll sidebar={<CombatSidebar />}>
            <MyPage className={classes.areaCards} key={battleZoneEnum}>
                {battleZoneEnum && <BattleZoneInfoUi battleZoneEnum={battleZoneEnum} />}
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

const BattleAreasListUi = memo(function BattleAreasListUi({ bt }: { bt: BattleAreas }) {
    return (
        <CollapsibleMenu
            collapsedId={bt.collapsedId}
            name={bt.nameId}
            parentCollapsedId={CollapsedEnum.Combat}
            icon={IconsData[bt.iconId]}
        >
            {bt.zones.map((z) => (
                <EnemyLink battleZoneEnum={z} key={z} />
            ))}
        </CollapsibleMenu>
    )
})

const EnemyLink = memo(function EnemyLink({ battleZoneEnum }: { battleZoneEnum: BattleZoneEnum }) {
    const { t } = useTranslations()
    const set = useCallback(() => setArea(battleZoneEnum), [battleZoneEnum])
    const active = useGameStore(isBattleZoneSelected(battleZoneEnum))
    const bt = BattleZones[battleZoneEnum]

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
                <AddBattleButton battleZoneEnum={battleZoneEnum} />
            </CardFooter>
        </Card>
    )
})

export const AddBattleButton = memo(function AddBattleButton({ battleZoneEnum }: { battleZoneEnum: BattleZoneEnum }) {
    const { t } = useTranslations()
    const onAddClick = useCallback(() => {
        if (battleZoneEnum) addBattle(battleZoneEnum)
    }, [battleZoneEnum])

    if (!battleZoneEnum) return null
    const battleZone = BattleZones[battleZoneEnum]

    return (
        <AddActivityDialog
            addBtn={<Button onClick={onAddClick}>{t.Fight}</Button>}
            title={
                <>
                    {IconsData[battleZone.iconId]} {t[battleZone.nameId]}
                </>
            }
            openBtn={<Button>{t.Fight}</Button>}
        />
    )
})

const EnemyInfoUi = memo(function EnemyInfoUi({
    quantity,
    templateEnum,
}: {
    quantity: number
    templateEnum: CharacterId
}) {
    const enemy = getTemplateCharacter(templateEnum)
    const { t } = useTranslations()
    const { f } = useNumberFormatter()
    return (
        <div>
            <MyCardHeaderTitle
                title={
                    quantity > 1
                        ? `${t[enemy.nameId as keyof typeof t]} (x${f(quantity)})`
                        : t[enemy.nameId as keyof typeof t]
                }
                icon={IconsData[enemy.iconId]}
            />

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
            <EnemyDropsUi templateEnum={templateEnum} />
            <ActiveWeaponCoating char={enemy} />
            <CombatAbilitiesList char={enemy} />
            <CharCombatInfo char={enemy} />
        </div>
    )
})
const EnemyDropsUi = memo(function EnemyDropsUi({ templateEnum }: { templateEnum: CharacterId }) {
    const enemy = getTemplateCharacter(templateEnum)
    const { t } = useTranslations()
    const { f } = useNumberFormatter()
    return (
        <Dialog>
            <DialogTrigger
                render={
                    <Button size="xs" variant="secondary">
                        {t.Drops}
                    </Button>
                }
            />
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {IconsData[enemy.iconId]} {t[enemy.nameId as keyof typeof t]} {t.Drops}
                    </DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    {enemy.loot?.map((loot) => (
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
