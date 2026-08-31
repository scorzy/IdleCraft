import { applyEffect } from '../effects/effectsFunctions'
import { GameState } from '../game/GameState'
import { setState } from '../game/setState'
import { DamageTypes, Item } from '../items/Item'
import { selectGameItem, selectItemQta } from '../storage/StorageSelectors'
import { removeCraftItemIfUnused, removeItem } from '../storage/storageFunctions'
import { CharacterAdapter } from '../characters/characterAdapter'
import { CharacterState } from '../characters/characterState'
import { PLAYER_ID } from '../characters/charactersConst'
import { getCharacterSelector } from '../characters/getCharacterSelector'
import { EquipSlotsEnum } from '../characters/equipSlotsEnum'
import { CharacterData } from '../characters/templates/characterRegistry'
import { getUniqueId } from '../utils/getUniqueId'
import { WEAPON_COATING_EFFECTIVENESS_BPS } from './weaponCoatingConst'
import { ActiveWeaponCoating, isWeaponCoatingEffect, WeaponCoatingData } from './weaponCoatingTypes'

export function getWeaponCoatingEffectiveness(weapon: Item | undefined): number {
    const damage = weapon?.weaponData?.damage
    if (!damage) return 10_000

    let totalDamage = 0
    let weighted = 0
    for (const [type, value] of Object.entries(damage)) {
        if (!value || value <= 0) continue
        const multiplier = WEAPON_COATING_EFFECTIVENESS_BPS[type as DamageTypes]
        if (multiplier === undefined) continue
        totalDamage += value
        weighted += value * multiplier
    }

    if (totalDamage <= 0) return 10_000
    return Math.floor(weighted / totalDamage)
}

export function scaleWeaponCoatingValue(value: number, effectivenessBps: number): number {
    return Math.max(0, Math.floor((value * effectivenessBps) / 10_000))
}

export function clearWeaponCoatingIfWeaponChanged(state: GameState, charId: string): void {
    const char = CharacterAdapter.select(state.characters, charId)
    if (!char?.weaponCoating) return

    const weapon = getCharacterSelector(charId).MainWeapon(state)
    if (!weapon || weapon.id !== char.weaponCoating.weaponItemId) delete char.weaponCoating
}

export function getActiveWeaponCoating(state: GameState, charId: string): ActiveWeaponCoating | undefined {
    const char = CharacterAdapter.select(state.characters, charId)
    if (!char?.weaponCoating) return

    const weapon = getCharacterSelector(charId).MainWeapon(state)
    if (!weapon || weapon.id !== char.weaponCoating.weaponItemId || char.weaponCoating.remainingCharges <= 0) return
    return char.weaponCoating
}

export function applyWeaponCoating(state: GameState, charId: string, itemId: string): boolean {
    clearWeaponCoatingIfWeaponChanged(state, charId)

    const char = CharacterAdapter.select(state.characters, charId)
    const item = selectGameItem(itemId)(state)
    const weapon = char ? getCharacterSelector(charId).MainWeapon(state) : undefined
    if (!char || !item?.weaponCoatingData || !weapon || selectItemQta(null, itemId)(state) < 1) return false

    const coatingData = item.weaponCoatingData
    const data: WeaponCoatingData = {
        kind: coatingData.kind,
        charges: coatingData.charges,
        effects: coatingData.effects.map((effect) => ({
            effect: effect.effect,
            value: effect.value,
            duration: effect.duration,
        })),
        nameId: coatingData.nameId,
        iconId: coatingData.iconId,
    }
    char.weaponCoating = {
        weaponItemId: weapon.id,
        coatingItemId: item.id,
        coatingInstanceId: getUniqueId(),
        remainingCharges: data.charges,
        data,
    }
    removeItem(state, itemId, 1)
    return true
}

export function autoApplyBestWeaponCoating(state: GameState, charId: string): boolean {
    if (charId === PLAYER_ID) return false

    clearWeaponCoatingIfWeaponChanged(state, charId)
    if (getActiveWeaponCoating(state, charId)) return false

    const char = CharacterAdapter.select(state.characters, charId)
    const weapon = char ? getCharacterSelector(charId).MainWeapon(state) : undefined
    if (!char || !weapon) return false

    let bestCoating: { slot: EquipSlotsEnum; item: Item } | undefined
    for (const [slot, inventoryItem] of Object.entries(char.inventory)) {
        const quantity = inventoryItem.quantity ?? 1
        const item = selectGameItem(inventoryItem.itemId)(state)
        if (!Number.isSafeInteger(quantity) || quantity < 1 || !item?.weaponCoatingData) continue
        if (!bestCoating || item.value > bestCoating.item.value) {
            bestCoating = { slot: slot as EquipSlotsEnum, item }
        }
    }

    if (!bestCoating) return false

    const { slot, item } = bestCoating
    const coatingData = item.weaponCoatingData
    if (!coatingData) return false
    const inventoryItem = char.inventory[slot]!
    const quantity = inventoryItem.quantity ?? 1
    char.weaponCoating = {
        weaponItemId: weapon.id,
        coatingItemId: item.id,
        coatingInstanceId: getUniqueId(),
        remainingCharges: coatingData.charges,
        data: structuredClone(coatingData),
    }

    if (quantity === 1) delete char.inventory[slot]
    else inventoryItem.quantity = quantity - 1
    removeCraftItemIfUnused(state, item.id)
    return true
}

export function getTemplateWeaponCoating(state: GameState, char: CharacterState): ActiveWeaponCoating | undefined {
    const coatingData = CharacterData[char.templateId]?.weaponCoating
    const weapon = getCharacterSelector(char.id, char).MainWeapon(state)
    if (!coatingData || !weapon) return

    return {
        weaponItemId: weapon.id,
        coatingInstanceId: getUniqueId(),
        remainingCharges: coatingData.charges,
        data: structuredClone(coatingData),
    }
}

export function applyTemplateWeaponCoating(state: GameState, charId: string): boolean {
    const char = CharacterAdapter.select(state.characters, charId)
    if (!char?.isEnemy) return false

    clearWeaponCoatingIfWeaponChanged(state, charId)
    if (getActiveWeaponCoating(state, charId)) return false

    const coating = getTemplateWeaponCoating(state, char)
    if (!coating) return false
    char.weaponCoating = coating
    return true
}

export function onWeaponHit(state: GameState, charId: string, targetId: string): void {
    clearWeaponCoatingIfWeaponChanged(state, charId)

    const char = CharacterAdapter.select(state.characters, charId)
    const active = char?.weaponCoating
    const weapon = char ? getCharacterSelector(charId).MainWeapon(state) : undefined
    if (!active || !weapon || active.weaponItemId !== weapon.id || active.remainingCharges <= 0) return

    const target = CharacterAdapter.select(state.characters, targetId)
    if (!target) return
    active.remainingCharges--

    const effectiveness = getWeaponCoatingEffectiveness(weapon)
    for (const effect of active.data.effects) {
        if (!isWeaponCoatingEffect(effect.effect)) continue
        const value = scaleWeaponCoatingValue(effect.value, effectiveness)
        if (value <= 0) continue
        applyEffect(state, {
            effect: effect.effect,
            nameId: active.data.nameId,
            iconId: active.data.iconId,
            duration: effect.duration,
            target: targetId,
            value: -value,
            sourceId: active.coatingInstanceId,
        })
    }

    if (active.remainingCharges <= 0) delete char.weaponCoating
}

export const applyWeaponCoatingClick = (charId: string, itemId: string) =>
    setState((state) => {
        applyWeaponCoating(state, charId, itemId)
    })
