import { useGameStore } from '../../game/state'
import { WoodTypes } from '../WoodTypes'
import { makeWoodcutting } from './makeWoodcutting'

export const addWoodcutting = (woodType: WoodTypes) => useGameStore.setState((s) => makeWoodcutting(woodType)(s))
