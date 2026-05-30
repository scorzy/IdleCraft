import { Icons } from '../icons/Icons'
import { Msg } from '../msg/Msg'

export enum GameLocations {
    StartVillage = 'StartVillage',
    Test = 'Test',
}

export interface GameLocationData {
    id: GameLocations
    name: keyof Msg
    description: keyof Msg
    icon: Icons
}
export const GameLocationDataMap: Record<GameLocations, GameLocationData> = {
    [GameLocations.StartVillage]: {
        id: GameLocations.StartVillage,
        name: 'startVillageName',
        description: 'startVillageDesc',
        icon: Icons.AnimalHide,
    },
    [GameLocations.Test]: {
        id: GameLocations.Test,
        name: 'testName',
        description: 'testDesc',
        icon: Icons.AnimalHide,
    },
}
