import { memo } from 'react'
import { PLAYER_ID } from '../../characters/charactersConst'
import { Badge } from '../../components/ui/badge'
import { Card, CardContent } from '../../components/ui/card'
import { ExpEnum } from '../../experience/ExpEnum'
import { ExperienceCard } from '../../experience/ui/ExperienceCard'
import { useNumberFormatter } from '../../formatters/selectNumberFormatter'
import { useGameStore } from '../../game/state'
import { IconsData } from '../../icons/Icons'
import { QuestDetailUi } from '../../quests/ui/QuestUi'
import { MyCardHeaderTitle } from '../../ui/myCard/MyCard'
import { MyPage, MyPageAll } from '../../ui/pages/MyPage'
import {
    isGatheringZoneUnlocked,
    selectActiveGatheringQuestId,
    selectGatheringUnlockLevel,
} from '../selectors/gatheringSelectors'
import { GatheringAction } from './GatheringAction'
import { GatheringLootTable } from './GatheringLootTable'
import { GatheringSidebar } from './GatheringSidebar'
import { useTranslations } from '../../msg/useTranslations'

export const Gathering = memo(function Gathering() {
    const zone = useGameStore((s) => s.ui.gatheringZone)

    return (
        <MyPageAll
            sidebar={<GatheringSidebar />}
            header={
                <div className="page__info">
                    <ExperienceCard expType={ExpEnum.Gathering} charId={PLAYER_ID} />
                </div>
            }
        >
            <MyPage className="page__main" key={zone}>
                <GatheringUnlock />
                <GatheringLootTable />
            </MyPage>
        </MyPageAll>
    )
})

const GatheringUnlock = memo(function GatheringUnlock() {
    const unlocked = useGameStore(isGatheringZoneUnlocked)
    if (unlocked) return <GatheringAction />
    return <LockedGathering />
})

const LockedGathering = memo(function LockedGathering() {
    const { f } = useNumberFormatter()
    const questId = useGameStore(selectActiveGatheringQuestId)
    const level = useGameStore(selectGatheringUnlockLevel)
    const { t } = useTranslations()

    return (
        <>
            <Card>
                <MyCardHeaderTitle title="Gathering" icon={IconsData.Forest} />
                <CardContent>
                    <p>{t.UnlockGathering}</p>
                    <p>
                        {t.UnlockGathering1} <Badge>{f(level)}</Badge> {t.UnlockGathering2}
                    </p>
                </CardContent>
            </Card>

            {questId && (
                <div>
                    <QuestDetailUi questId={questId} />
                </div>
            )}
        </>
    )
})
