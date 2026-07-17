import { Icons } from '../icons/Icons'
import { Msg } from '../msg/Msg'
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
    color: string
    respawnTime: number
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
        color: 'text-dead-tree-foreground',
        respawnTime: 1e3 * 60 * 3,
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
        color: 'text-oak-foreground',
        respawnTime: 1e3 * 60 * 3.5,
    },
}
