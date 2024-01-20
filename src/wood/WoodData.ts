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
}
export const WoodData: { [k in WoodTypes]: WoodDataType } = {
    [WoodTypes.DeadTree]: {
        maxHp: 100,
        maxQta: 10,
        iconId: Icons.DeadWood,
        nameId: 'DeadTree',
        logId: 'DeadTreeLog',
        plankId: 'DeadTreePlank',
        handleId: 'DeadTreeHandle',
    },
    [WoodTypes.Oak]: {
        maxHp: 200,
        maxQta: 5,
        iconId: Icons.Oak,
        nameId: 'Oak',
        logId: 'OakLog',
        plankId: 'OakPlank',
        handleId: 'OakHandle',
    },
}
