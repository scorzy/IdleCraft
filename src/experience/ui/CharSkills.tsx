import { memo } from 'react'
import { ExpEnum } from '../ExpEnum'
import { useGameStore } from '../../game/state'
import { selectSelectedCharId } from '../../ui/state/uiSelectors'
import { ExperienceCard } from './ExperienceCard'

const skills = Object.values(ExpEnum).sort()
export const CharSkills = memo(function CharSkills() {
    const charId = useGameStore(selectSelectedCharId)
    return (
        <>
            {skills.map((s) => (
                <ExperienceCard key={s} expType={s} charId={charId} />
            ))}
        </>
    )
})
