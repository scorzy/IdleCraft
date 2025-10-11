import { memo } from 'react'
import { Icons, IconsData } from './Icons'

export const GameIcon = memo(function GameIcon({ icon, className }: { icon: Icons; className?: string }) {
    return <span className={className}>{IconsData[icon]}</span>
})
