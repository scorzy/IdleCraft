import { AnimalCharacterData } from './characterData.animals'
import { CharacterDefinition, CharacterItem, CharacterItemRef } from './characterInterfaces'

const characterDataSources = [AnimalCharacterData] as const
type KeysOfUnion<T> = T extends T ? keyof T : never
export type CharacterId = KeysOfUnion<(typeof characterDataSources)[number]>

export const CharacterData: Record<CharacterId, CharacterDefinition> = {} as Record<CharacterId, CharacterDefinition>

export function reconcileCharacterData(): void {
    for (const source of characterDataSources) {
        for (const [id, definition] of Object.entries(source) as [CharacterId, CharacterDefinition][]) {
            const current = CharacterData[id]
            if (current && JSON.stringify(current) !== JSON.stringify(definition)) {
                throw new Error(`Conflicting character definition: ${id}`)
            }
            CharacterData[id] = definition
        }
    }
}

export function getCharacterItems(): CharacterItem[] {
    const items = new Map<string, CharacterItem>()
    const add = (item: CharacterItem) => {
        const current = items.get(item.id)
        if (current && JSON.stringify(current) !== JSON.stringify(item)) {
            throw new Error(`Conflicting character item definition: ${item.id}`)
        }
        items.set(item.id, item)
    }
    for (const character of Object.values(CharacterData)) {
        Object.values(character.items).forEach(add)
        Object.values(character.inventory).forEach((entry) => {
            if (entry && typeof entry.itemId !== 'string') add(entry.itemId)
        })
        character.loot.forEach((entry) => {
            if (typeof entry.itemId !== 'string') add(entry.itemId)
        })
    }
    return [...items.values()]
}

export function resolveCharacterItemRef(item: CharacterItemRef): string {
    return typeof item === 'string' ? item : item.id
}
