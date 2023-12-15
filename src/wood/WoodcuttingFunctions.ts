import { useGameStore } from '../game/state'
import { WoodTypes } from './WoodTypes'
import { WoodcuttingActivityCreator } from './WoodcuttingActivity'

export const addWoodcutting = (woodType: WoodTypes) =>
    useGameStore.setState((s) => new WoodcuttingActivityCreator(s, woodType).createActivity())
