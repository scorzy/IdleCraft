import { memo, useEffect, useState } from 'react'
import { TextInput } from '../../components/ui/textInput'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'
import { useNumberFormatter } from '../../formatters/selectNumberFormatter'
import { useGameStore } from '../../game/state'
import { useTranslations } from '../../msg/useTranslations'
import { ProgressBar } from '../../ui/progress/ProgressBar'
import { selectSelectedCharId } from '../../ui/state/uiSelectors'
import { ExpData } from '../ExpData'
import { ExpEnum } from '../ExpEnum'
import { getLevelProgress, selectExp, selectLevel, selectLevelExp, selectNextExp } from '../expSelectors'

const skills = Object.values(ExpEnum).toSorted()

export const skillMatchesSearch = (name: string, search: string) => {
    const normalizedSearch = search.trim().toLocaleLowerCase()
    return normalizedSearch.length === 0 || name.toLocaleLowerCase().includes(normalizedSearch)
}

export const CharSkills = memo(function CharSkills() {
    const charId = useGameStore(selectSelectedCharId)
    const { t } = useTranslations()
    const [search, setSearch] = useState('')

    useEffect(() => setSearch(''), [charId])

    const visibleSkills = skills.filter((skill) => skillMatchesSearch(t[ExpData[skill].nameId], search))

    return (
        <div className="flex flex-col gap-4">
            <TextInput
                id="SearchSkill"
                title={t.SearchItem}
                text={search}
                clearable
                debounceMs={0}
                onChange={setSearch}
            />
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>{t.Name}</TableHead>
                        <TableHead className="w-24 text-right">{t.Level}</TableHead>
                        <TableHead className="w-36 text-right">{t.XP}</TableHead>
                        <TableHead className="w-48">{t.Progress}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {visibleSkills.map((skill) => (
                        <SkillRow key={skill} expType={skill} charId={charId} />
                    ))}
                    {visibleSkills.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={4} className="text-muted-foreground py-6 text-center">
                                {t.NoResults}
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
})

const SkillRow = memo(function SkillRow(props: { expType: ExpEnum; charId: string }) {
    const { expType, charId } = props
    const { f } = useNumberFormatter()
    const { t } = useTranslations()

    const level = useGameStore(selectLevel(expType, charId))
    const xp = useGameStore(selectExp(expType, charId))
    const levelXp = useGameStore(selectLevelExp(expType, charId))
    const nextLevelXp = useGameStore(selectNextExp(expType, charId))
    const percent = getLevelProgress(xp, levelXp, nextLevelXp)

    return (
        <TableRow>
            <TableCell>{t[ExpData[expType].nameId]}</TableCell>
            <TableCell className="text-right">{f(level)}</TableCell>
            <TableCell className="text-right">
                {f(xp)} / {f(nextLevelXp)}
            </TableCell>
            <TableCell>
                <ProgressBar value={percent} color="primary" />
            </TableCell>
        </TableRow>
    )
})
