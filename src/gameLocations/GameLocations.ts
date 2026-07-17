import { Icons } from '../icons/Icons'
import { Msg } from '../msg/Msg'

export enum GameLocations {
    StartVillage = 'StartVillage',
    WoodVillage = 'WoodVillage',
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
        icon: Icons.HutsVillage,
    },
    [GameLocations.WoodVillage]: {
        id: GameLocations.WoodVillage,
        name: 'woodVillageName',
        description: 'woodVillageDesc',
        icon: Icons.Forest,
    },
    [GameLocations.Test]: {
        id: GameLocations.Test,
        name: 'testName',
        description: 'testDesc',
        icon: Icons.HutsVillage,
    },
}
