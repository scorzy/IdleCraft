import { equipItem } from '../characters/characterFunctions'
import { PLAYER_ID } from '../characters/charactersConst'
import { EquipSlotsEnum } from '../characters/equipSlotsEnum'
import { useGameStore } from '../game/state'
import { WoodTypes } from './WoodTypes'
import { WoodcuttingActivityCreator } from './WoodcuttingActivity'

export const addWoodcutting = (woodType: WoodTypes) =>
    useGameStore.setState((s) => new WoodcuttingActivityCreator(s, woodType).createActivity())

export const changeAxe = (axeId: string) =>
    useGameStore.setState((s) => {
        let stdItemId: string | null = null
        let craftItemId: string | null = null

        if (axeId.startsWith('s')) stdItemId = axeId.slice(1)
        else if (axeId.startsWith('c')) craftItemId = axeId.slice(1)

        return equipItem(s, PLAYER_ID, EquipSlotsEnum.WoodAxe, stdItemId, craftItemId)
    })
