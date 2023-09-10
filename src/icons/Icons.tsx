import { ReactNode } from 'react'
import { GiWoodAxe, GiLog, GiPlanks, GiBo } from 'react-icons/gi'

// eslint-disable-next-line react-refresh/only-export-components
export enum Icons {
    Axe = 'Axe',
    Log = 'Log',
    Plank = 'Plank',
    Handle = 'Handle',
}
export const IconsData: { [k in Icons]: ReactNode } = {
    Axe: <GiWoodAxe />,
    Log: <GiLog />,
    Plank: <GiPlanks />,
    Handle: <GiBo />,
}
