import { ReactNode } from 'react'
import { GiWoodAxe, GiLog, GiPlanks, GiBo, GiOre, GiMetalBar } from 'react-icons/gi'

// eslint-disable-next-line react-refresh/only-export-components
export enum Icons {
    Axe = 'Axe',
    Log = 'Log',
    Plank = 'Plank',
    Handle = 'Handle',
    Ore = 'Ore',
    Bar = 'Bar',
}
export const IconsData: { [k in Icons]: ReactNode } = {
    Axe: <GiWoodAxe />,
    Log: <GiLog />,
    Plank: <GiPlanks />,
    Handle: <GiBo />,
    Ore: <GiOre />,
    Bar: <GiMetalBar />,
}
