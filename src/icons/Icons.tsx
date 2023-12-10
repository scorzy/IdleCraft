import { ReactNode } from 'react'
import {
    GiWoodAxe,
    GiLog,
    GiPlanks,
    GiBo,
    GiOre,
    GiMetalBar,
    GiHearts,
    GiHeartPlus,
    GiStrong,
    GiMagicPalm,
} from 'react-icons/gi'

export enum Icons {
    Axe = 'Axe',
    Log = 'Log',
    Plank = 'Plank',
    Handle = 'Handle',
    Ore = 'Ore',
    Bar = 'Bar',
    Pickaxe = 'Pickaxe',
    Heart = 'Heart',
    HeartPlus = 'HeartPlus',
    Strong = 'Strong',
    MagicPalm = 'MagicPalm',
}
export const IconsData: { [k in Icons]: ReactNode } = {
    Axe: <GiWoodAxe />,
    Log: <GiLog />,
    Plank: <GiPlanks />,
    Handle: <GiBo />,
    Ore: <GiOre />,
    Bar: <GiMetalBar />,
    Pickaxe: <GiWoodAxe />,
    Heart: <GiHearts />,
    HeartPlus: <GiHeartPlus />,
    Strong: <GiStrong />,
    MagicPalm: <GiMagicPalm />,
}
