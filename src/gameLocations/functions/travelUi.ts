import { setState } from '../../game/setState'
import { GameLocations } from '../GameLocations'
import { startTravel } from './travel'

export const travel = (location: GameLocations) => setState((state) => startTravel(state, location))
