import { memo, useCallback } from 'react'
import { GiTiedScroll } from 'react-icons/gi'
import { useGameStore } from '../../game/state'
import { MyPage, MyPageAll } from '../../ui/pages/MyPage'
import { CollapsedEnum } from '../../ui/sidebar/CollapsedEnum'
import { CollapsibleMenu, MyListItem } from '../../ui/sidebar/MenuItem'
import { SidebarContainer } from '../../ui/sidebar/SidebarContainer'
import { sidebarOpen } from '../../ui/state/uiFunctions'
import {
    isQuestSelected,
    selectAcceptedQuests,
    selectAvailableQuests,
    selectOutcome,
    selectOutcomeDescription,
    selectOutcomeIds,
    selectOutcomeType,
    selectQuestDescription,
    selectQuestIcon,
    selectQuestId,
    selectQuestName,
    selectQuestStatus,
} from '../QuestSelectors'
import { IconsData } from '../../icons/Icons'
import { acceptClick, selectQuest } from '../QuestFunctions'
import { GameState } from '../../game/GameState'
import { Button } from '../../components/ui/button'
import { isKillingOutcome, KillQuestTarget, QuestStatus, QuestType } from '../QuestTypes'
import { TitleH1, TypographyP } from '../../ui/typography'
import { ProgressBar } from '../../ui/progress/ProgressBar'
import { useTranslations } from '../../msg/useTranslations'
import { CharTemplatesData } from '../../characters/templates/charTemplateData'
import { MyLabel } from '../../ui/myCard/MyLabel'
import { useNumberFormatter } from '../../formatters/selectNumberFormatter'

const QuestLink = (props: { id: string }) => {
    const { id } = props
    const nameId = useGameStore(useCallback((s: GameState) => selectQuestName(id)(s), [id]))
    const iconId = useGameStore(useCallback((s: GameState) => selectQuestIcon(id)(s), [id]))
    const onClick = useCallback(() => selectQuest(id), [id])
    const selected = useGameStore(useCallback((s: GameState) => isQuestSelected(id)(s), [id]))

    return (
        <MyListItem
            collapsedId={CollapsedEnum.Quest}
            active={selected}
            text={nameId}
            icon={IconsData[iconId]}
            onClick={onClick}
        />
    )
}

const SidebarQuestAccepted = memo(function SidebarGathering() {
    const open = useGameStore(sidebarOpen)
    const ids = useGameStore(selectAcceptedQuests)

    return (
        <CollapsibleMenu
            key={open ? '1' : '0'}
            collapsedId={CollapsedEnum.QuestAccepted}
            name="AcceptedQuests"
            parentCollapsedId={CollapsedEnum.Quest}
            icon={<GiTiedScroll />}
        >
            {ids.map((id) => (
                <QuestLink id={id} key={id} />
            ))}
        </CollapsibleMenu>
    )
})

const SidebarQuestAvailable = memo(function SidebarGathering() {
    const open = useGameStore(sidebarOpen)
    const ids = useGameStore(selectAvailableQuests)

    return (
        <CollapsibleMenu
            key={open ? '1' : '0'}
            collapsedId={CollapsedEnum.QuestAvailable}
            name="AvailableQuests"
            parentCollapsedId={CollapsedEnum.Quest}
            icon={<GiTiedScroll />}
        >
            {ids.map((id) => (
                <QuestLink id={id} key={id} />
            ))}
        </CollapsibleMenu>
    )
})

const QUestSidebar = () => {
    return (
        <SidebarContainer collapsedId={CollapsedEnum.Quest}>
            <SidebarQuestAccepted />
            <SidebarQuestAvailable />
        </SidebarContainer>
    )
}

export const QuestUi = () => {
    return (
        <MyPageAll sidebar={<QUestSidebar />}>
            <MyPage>
                <div className="mx-auto max-w-2xl">
                    <QuestDetailUi />
                </div>
            </MyPage>
        </MyPageAll>
    )
}
const QuestDetailUi = () => {
    const id = useGameStore(selectQuestId)
    const nameId = useGameStore(useCallback((s: GameState) => selectQuestName(id)(s), [id]))
    const iconId = useGameStore(useCallback((s: GameState) => selectQuestIcon(id)(s), [id]))
    const descriptionId = useGameStore(useCallback((s: GameState) => selectQuestDescription(id)(s), [id]))
    const outcomeIds = useGameStore(selectOutcomeIds)
    const state = useGameStore(useCallback((s: GameState) => selectQuestStatus(id)(s), [id]))

    if (!id || id === '') return <></>

    return (
        <>
            <TitleH1>
                {IconsData[iconId]}
                {nameId}
            </TitleH1>
            <TypographyP>{descriptionId}</TypographyP>
            {outcomeIds.map((outcomeId) => (
                <QuestOutcomeUi questId={id} outcomeId={outcomeId} key={outcomeId} />
            ))}
            <TypographyP>{state === QuestStatus.AVAILABLE && <QuestButtons id={id} />}</TypographyP>
        </>
    )
}

const QuestButtons = (props: { id: string }) => {
    const { id } = props

    const onClick = useCallback(() => acceptClick(id), [id])

    return <Button onClick={onClick}>Accept</Button>
}
const QuestOutcomeUi = (props: { questId: string; outcomeId: string }) => {
    const { questId, outcomeId } = props
    const type = useGameStore(
        useCallback((s: GameState) => selectOutcomeType(questId, outcomeId)(s), [questId, outcomeId])
    )
    if (!type) return <></>

    if (type === QuestType.KILL) return <KillOutcomeUi questId={questId} outcomeId={outcomeId} />
    else if (type === QuestType.COLLECT) return <CollectOutcomeUi questId={questId} id={outcomeId} />
}
const KillOutcomeUi = (props: { questId: string; outcomeId: string }) => {
    const { questId, outcomeId } = props
    const description = useGameStore(
        useCallback((s: GameState) => selectOutcomeDescription(questId, outcomeId)(s), [questId, outcomeId])
    )
    const outcome = useGameStore(
        useCallback((s: GameState) => selectOutcome(questId, outcomeId)(s), [questId, outcomeId])
    )
    if (!outcome) return <></>
    if (!isKillingOutcome(outcome)) return <></>

    return (
        <div>
            {description}
            {outcome.targets.map((target: KillQuestTarget) => (
                <KillOutcomeProgress key={target.targetId} target={target} />
            ))}
        </div>
    )
}
const KillOutcomeProgress = (props: { target: KillQuestTarget }) => {
    const { target } = props
    const { targetId, targetCount, killedCount } = target
    const { t } = useTranslations()
    const { f } = useNumberFormatter()
    const charTemplate = CharTemplatesData[targetId]

    if (targetCount <= 0) return <></>
    const percent = Math.round((killedCount / targetCount) * 100)
    return (
        <>
            <MyLabel>
                {IconsData[charTemplate.iconId]} {t[charTemplate.nameId]} {f(killedCount)}/{f(targetCount)}
            </MyLabel>
            <ProgressBar value={percent} color="primary" />
        </>
    )
}

const CollectOutcomeUi = (props: { questId: string; id: string }) => {
    const { id } = props
    return <>{id}</>
}
