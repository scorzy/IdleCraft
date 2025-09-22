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
    [WoodTypes.Pine]: {
        maxHp: 300,
        maxQta: 18,
        iconId: Icons.Pine,
        nameId: 'Pine',
        logId: 'PineLog',
        plankId: 'PinePlank',
        handleId: 'PineHandle',
        requiredLevel: 20,
    },
    [WoodTypes.Birch]: {
        maxHp: 400,
        maxQta: 16,
        iconId: Icons.Birch,
        nameId: 'Birch',
        logId: 'BirchLog',
        plankId: 'BirchPlank',
        handleId: 'BirchHandle',
        requiredLevel: 30,
    },
    [WoodTypes.Maple]: {
        maxHp: 500,
        maxQta: 14,
        iconId: Icons.Maple,
        nameId: 'Maple',
        logId: 'MapleLog',
        plankId: 'MaplePlank',
        handleId: 'MapleHandle',
        requiredLevel: 40,
    },
    [WoodTypes.Willow]: {
        maxHp: 600,
        maxQta: 12,
        iconId: Icons.Willow,
        nameId: 'Willow',
        logId: 'WillowLog',
        plankId: 'WillowPlank',
        handleId: 'WillowHandle',
        requiredLevel: 50,
    },
    [WoodTypes.Cedar]: {
        maxHp: 700,
        maxQta: 10,
        iconId: Icons.Cedar,
        nameId: 'Cedar',
        logId: 'CedarLog',
        plankId: 'CedarPlank',
        handleId: 'CedarHandle',
        requiredLevel: 60,
    },
    [WoodTypes.Redwood]: {
        maxHp: 800,
        maxQta: 8,
        iconId: Icons.Redwood,
        nameId: 'Redwood',
        logId: 'RedwoodLog',
        plankId: 'RedwoodPlank',
        handleId: 'RedwoodHandle',
        requiredLevel: 70,
    },
    [WoodTypes.Spruce]: {
        maxHp: 900,
        maxQta: 6,
        iconId: Icons.Spruce,
        nameId: 'Spruce',
        logId: 'SpruceLog',
        plankId: 'SprucePlank',
        handleId: 'SpruceHandle',
        requiredLevel: 80,
    },
    [WoodTypes.Mahogany]: {
        maxHp: 1000,
        maxQta: 4,
        iconId: Icons.Mahogany,
        nameId: 'Mahogany',
        logId: 'MahoganyLog',
        plankId: 'MahoganyPlank',
        handleId: 'MahoganyHandle',
        requiredLevel: 90,
    },
}
