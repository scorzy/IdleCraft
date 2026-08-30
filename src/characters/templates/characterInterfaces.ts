import { RecipeItem } from '../../crafting/RecipeInterfaces'
import { ExpState } from '../../experience/ExpState'
import { Icons } from '../../icons/Icons'
import { Item } from '../../items/Item'
import { Msg } from '../../msg/Msg'
import { Loot } from '../../storage/storageTypes'
import { CharInventory } from '../inventory'

export type CharacterItem = Item & { butchering?: RecipeItem[] }
export type CharacterItemRef = string | CharacterItem
export type CharacterInventory = Partial<Record<keyof CharInventory, { itemId: CharacterItemRef; quantity?: number }>>
export type CharacterLoot = Omit<Loot, 'itemId'> & { itemId: CharacterItemRef }

export interface CharacterDefinition {
    nameId: keyof Msg
    iconId: Icons
    items: Record<string, CharacterItem>
    inventory: CharacterInventory
    skillsExp: ExpState
    skillsLevel: ExpState
    level: number
    healthPoints: number
    staminaPoints: number
    manaPoints: number
    loot: CharacterLoot[]
}
