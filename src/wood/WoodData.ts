import { Msg } from '../msg/Msg'
import { Icons } from '../icons/Icons'
import { WoodTypes } from './WoodTypes'

interface WoodDataType {
    maxHp: number
    maxQta: number
    iconId: Icons
    nameId: keyof Msg
    logId: string
    plankId: string
    handleId: string
    requiredLevel: number
}
export const WoodData: Record<WoodTypes, WoodDataType> = {
    [WoodTypes.DeadTree]: {
        maxHp: 100,
        maxQta: 30,
        iconId: Icons.DeadWood,
        nameId: 'DeadTree',
        logId: 'DeadTreeLog',
        plankId: 'DeadTreePlank',
        handleId: 'DeadTreeHandle',
        requiredLevel: 0,
    },
    [WoodTypes.Oak]: {
        maxHp: 200,
        maxQta: 20,
        iconId: Icons.Oak,
        nameId: 'Oak',
        logId: 'OakLog',
        plankId: 'OakPlank',
        handleId: 'OakHandle',
        requiredLevel: 10,
    },
}
