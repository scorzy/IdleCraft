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
    selectOutcomeIds,
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
import { QuestStatus } from '../QuestTypes'
import { TitleH1, TypographyP } from '../../ui/typography'

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
                <QuestOutcomeUi id={outcomeId} key={outcomeId} />
            ))}
            <TypographyP>{state === QuestStatus.AVAILABLE && <QuestButtons id={id} />}</TypographyP>
        </>
    )
}
const QuestOutcomeUi = (props: { id: string }) => {
    const { id } = props
    return <>{id}</>
}
const QuestButtons = (props: { id: string }) => {
    const { id } = props

    const onClick = useCallback(() => acceptClick(id), [id])

    return <Button onClick={onClick}>Accept</Button>
}
