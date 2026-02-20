import { AbstractEntityAdapter } from '../entityAdapter/entityAdapter'

export enum ActivityTypes {
    Woodcutting = 'Woodcutting',
    IncreaseGrowSpeed = 'IncreaseGrowSpeed',
    Crafting = 'Crafting',
    Mining = 'Mining',
    MiningVeinSearch = 'MiningVeinSearch',
    Battle = 'Battle',
    Tree = 'Tree',
    GrowSpeedBonus = 'GrowSpeedBonus',
    Ability = 'Ability',
    StartBattle = 'StartBattle',
    Effect = 'Effect',
}
export interface ActivityState {
    id: string
    type: ActivityTypes
    max: number
    remove?: boolean
}
class ActivityAdapterInt<T extends ActivityState> extends AbstractEntityAdapter<T> {
    getId(data: ActivityState): string {
        return data.id
    }
}
export const ActivityAdapter = new ActivityAdapterInt()
