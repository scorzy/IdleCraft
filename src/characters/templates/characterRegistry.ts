import { AnimalCharacterData } from './characterData.animals'
import { CharacterDefinition, CharacterItem, CharacterItemRef } from './characterInterfaces'

const characterDataSources = [AnimalCharacterData] as const
type KeysOfUnion<T> = T extends T ? keyof T : never
export type CharacterId = KeysOfUnion<(typeof characterDataSources)[number]>

export const CharacterData: Record<CharacterId, CharacterDefinition> = {}

export function getCharacterDefinition(id: CharacterId): CharacterDefinition {
    const definition = CharacterData[id]
    if (!definition) throw new Error(`Character definition not reconciled: ${id}`)
    return definition
}

export function reconcileCharacterData(): void {
    for (const source of characterDataSources) {
        for (const [id, definition] of Object.entries(source)) {
            const current = CharacterData[id]
            if (current && JSON.stringify(current) !== JSON.stringify(definition)) {
                throw new Error(`Conflicting character definition: ${id}`)
            }
            CharacterData[id] = definition
        }
    }
}

export const getCharacterItemId = (templateId: string, itemId: string) => `${templateId}${itemId}`

export function getCharacterItems(): CharacterItem[] {
    const items = new Map<string, CharacterItem>()
    const add = (item: CharacterItem) => {
        const current = items.get(item.id)
        if (current && JSON.stringify(current) !== JSON.stringify(item)) {
            throw new Error(`Conflicting character item definition: ${item.id}`)
        }

        items.set(item.id, item)
    }
    for (const [templateId, character] of Object.entries(CharacterData)) {
        Object.values(character.items).forEach((item) => add({ ...item, id: getCharacterItemId(templateId, item.id) }))
        Object.values(character.inventory).forEach((entry) => {
            if (entry && typeof entry.itemId !== 'string') {
                add({ ...entry.itemId, id: getCharacterItemId(templateId, entry.itemId.id) })
            }
        })
        character.loot.forEach((entry) => {
            if (typeof entry.itemId !== 'string')
                add({ ...entry.itemId, id: getCharacterItemId(templateId, entry.itemId.id) })
        })
    }
    return [...items.values()]
}

export function resolveCharacterItemRef(
    templateId: string,
    template: CharacterDefinition,
    item: CharacterItemRef
): string {
    if (typeof item !== 'string') return getCharacterItemId(templateId, item.id)
    if (Object.values(template.items).some((characterItem) => characterItem.id === item)) {
        return getCharacterItemId(templateId, item)
    }
    return item
}
