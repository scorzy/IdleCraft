import { ReactNode } from 'react'
import { GiWoodAxe, GiLog } from 'react-icons/gi'

// eslint-disable-next-line react-refresh/only-export-components
export enum Icons {
    Axe = 'Axe',
    Log = 'Log',
}
export const IconsData: { [k in Icons]: ReactNode } = {
    Axe: <GiWoodAxe />,
    Log: <GiLog />,
}
