import { memo } from 'react'
import { useGameStore } from '../../game/state'
import { selectSelectedCharId } from '../../ui/state/uiSelectors'
import { ExpEnum } from '../ExpEnum'
import { ExperienceCard } from './ExperienceCard'

const skills = Object.values(ExpEnum).toSorted()
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
