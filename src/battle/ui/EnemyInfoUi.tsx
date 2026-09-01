import { memo } from 'react'
import { GiHearts, GiMagicPalm, GiStrong } from 'react-icons/gi'
import { CharacterState } from '../../characters/characterState'
import { CharacterId, getCharacterDefinition } from '../../characters/templates/characterRegistry'
import { generateCharacter } from '../../characters/templates/generateCharacter'
import { CharCombatInfo } from '../../characters/ui/CharactersUi'
import { CardContent, CardTitle } from '../../components/ui/card'
import { useNumberFormatter } from '../../formatters/selectNumberFormatter'
import { useGameStore } from '../../game/state'
import { IconsData } from '../../icons/Icons'
import { ItemIconName } from '../../items/ui/ItemIconName'
import { useTranslations } from '../../msg/useTranslations'
import { MyCardHeaderTitle } from '../../ui/myCard/MyCard'
import { getTemplateWeaponCoating } from '../../weaponCoatings/weaponCoatingFunctions'
import { ActiveWeaponCoating, CombatAbilitiesList } from './CombatUi'

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

export const EnemyInfoUi = memo(function EnemyInfoUi({
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
        <>
            <MyCardHeaderTitle
                title={
                    quantity > 1
                        ? `${t[enemy.nameId as keyof typeof t]} (x${f(quantity)})`
                        : t[enemy.nameId as keyof typeof t]
                }
                icon={IconsData[enemy.iconId]}
            />
            <CardContent className="grid gap-2">
                <p className="grid grid-flow-col items-center justify-start gap-2 text-sm">
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
                <EnemyDropsUi enemy={enemy} />
                <ActiveWeaponCoating char={enemy} />
                <CombatAbilitiesList char={enemy} />
                <CharCombatInfo char={enemy} />
            </CardContent>
        </>
    )
})

const EnemyDropsUi = memo(function EnemyDropsUi({ enemy }: { enemy: CharacterState }) {
    const { t } = useTranslations()
    const { f } = useNumberFormatter()

    if (!enemy.loot || enemy.loot.length === 0) return null

    return (
        <div className="grid gap-1">
            <CardTitle className="mt-2">{t.Drops}</CardTitle>
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm">
                {enemy.loot.map((loot) => (
                    <div key={loot.itemId} className="flex items-center gap-1">
                        <ItemIconName itemId={loot.itemId} />
                        {loot.quantity > 1 && <span>x {f(loot.quantity)}</span>}
                    </div>
                ))}
            </div>
        </div>
    )
})
