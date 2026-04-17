import { setState } from '../../game/setState'
import { GameLocations } from '../../gameLocations/GameLocations'
import { WoodTypes } from '../WoodTypes'
import { makeIncreaseGrowSpeed } from './makeIncreaseGrowSpeed'

export const addIncreaseGrowSpeed = (woodType: WoodTypes, location: GameLocations) =>
    setState((s) => makeIncreaseGrowSpeed(woodType, location)(s))
