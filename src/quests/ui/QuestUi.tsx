import { memo, useCallback } from 'react'
import { GiTiedScroll } from 'react-icons/gi'
import { Popover, PopoverTrigger, PopoverContent, Portal } from '@radix-ui/react-popover'
import { useGameStore } from '../../game/state'
import { MyPage, MyPageAll } from '../../ui/pages/MyPage'
import { CollapsedEnum } from '../../ui/sidebar/CollapsedEnum'
import { CollapsibleMenu, MyListItem } from '../../ui/sidebar/MenuItem'
import { SidebarContainer } from '../../ui/sidebar/SidebarContainer'
import { sidebarOpen } from '../../ui/state/uiFunctions'
import {
    isOutcomeCompleted,
    isQuestSelected,
    selectAcceptedQuests,
    selectAvailableQuests,
    selectOutcomeDescription,
    selectOutcomeGoldReward,
    selectOutcomeIds,
    selectOutcomeItemReward,
    selectQuestDescription,
    selectQuestIcon,
    selectQuestId,
    selectQuestName,
    selectQuestStatus,
    selectRequest,
    selectRequestIds,
    selectRequestType,
} from '../QuestSelectors'
import { IconsData } from '../../icons/Icons'
import { acceptClick, completeQuest, selectQuest } from '../QuestFunctions'
import { GameState } from '../../game/GameState'
import { Button } from '../../components/ui/button'
import { isKillingQuestRequest, QuestStatus, QuestType } from '../QuestTypes'
import { KillQuestTarget } from '../KillQuestTarget'
import { TitleH1, TypographyP } from '../../ui/typography'
import { ProgressBar } from '../../ui/progress/ProgressBar'
import { useTranslations } from '../../msg/useTranslations'
import { CharTemplatesData } from '../../characters/templates/charTemplateData'
import { MyLabel } from '../../ui/myCard/MyLabel'
import { useNumberFormatter } from '../../formatters/selectNumberFormatter'
import { selectGameItem } from '../../storage/StorageSelectors'
import { ItemInfo } from '../../items/ui/ItemInfo'
import { Card, CardContent } from '../../components/ui/card'
import { MyCardHeaderTitle } from '../../ui/myCard/MyCard'
import { Badge } from '../../components/ui/badge'

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
    const { t } = useTranslations()

    const onClick = useCallback(() => acceptClick(id), [id])

    return <Button onClick={onClick}>{t.Accept}</Button>
}

const QuestOutcomeUi = (props: { questId: string; outcomeId: string }) => {
    const { questId, outcomeId } = props
    const { t } = useTranslations()

    const completed = useGameStore(
        useCallback((s: GameState) => isOutcomeCompleted(questId, outcomeId)(s), [questId, outcomeId])
    )
    const completeClick = useCallback(() => {
        useGameStore.setState((s: GameState) => completeQuest(s, questId, outcomeId))
    }, [questId, outcomeId])

    const requestIds = useGameStore(
        useCallback((s: GameState) => selectRequestIds(questId, outcomeId)(s), [questId, outcomeId])
    )

    return (
        <Card>
            <CardContent>
                <TypographyP>
                    {requestIds.map((requestId) => (
                        <QuestRequestUi
                            questId={questId}
                            outcomeId={outcomeId}
                            requestId={requestId}
                            key={questId + outcomeId + requestId}
                        />
                    ))}

                    <OutcomeReward questId={questId} outcomeId={outcomeId} />
                    {completed && (
                        <Button className="mt-6" onClick={completeClick}>
                            {t.Complete}
                        </Button>
                    )}
                </TypographyP>
            </CardContent>
        </Card>
    )
}

const QuestRequestUi = (props: { questId: string; outcomeId: string; requestId: string }) => {
    const { questId, outcomeId, requestId } = props
    const type = useGameStore(
        useCallback(
            (s: GameState) => selectRequestType(questId, outcomeId, requestId)(s),
            [questId, outcomeId, requestId]
        )
    )
    if (!type) return <></>
    if (type === QuestType.KILL) return <KillRequestUi questId={questId} outcomeId={outcomeId} requestId={requestId} />
    else if (type === QuestType.COLLECT)
        return <CollectRequestUi questId={questId} id={outcomeId} requestId={requestId} />
    return null
}

const OutcomeReward = (props: { questId: string; outcomeId: string }) => {
    const { questId, outcomeId } = props
    const { t } = useTranslations()
    const { f } = useNumberFormatter()

    const gold = useGameStore(
        useCallback((s: GameState) => selectOutcomeGoldReward(s, questId, outcomeId), [questId, outcomeId])
    )
    const items = useGameStore(
        useCallback((s: GameState) => selectOutcomeItemReward(s, questId, outcomeId), [questId, outcomeId])
    )

    return (
        <>
            <TypographyP>
                Rewards:{' '}
                {gold > 0 && (
                    <div>
                        {t.Gold}: {f(gold)}
                    </div>
                )}{' '}
            </TypographyP>
            <div className="mt-2 flex flex-wrap gap-2">
                {items.map((r) => (
                    <ItemRewardUi itemId={r.itemId} quantity={r.quantity} key={questId + r.itemId + r.quantity} />
                ))}
            </div>
        </>
    )
}

export function ItemRewardUi(props: { itemId: string; quantity: number }) {
    const { itemId, quantity } = props

    const { f } = useNumberFormatter()

    const item = useGameStore(
        useCallback(
            (s: GameState) => {
                if (!itemId) return null
                return selectGameItem(itemId)(s)
            },
            [itemId]
        )
    )
    if (!item) return <></>
    return (
        <div>
            <Popover>
                <PopoverTrigger>
                    <Badge>
                        X {f(quantity)} {IconsData[item.icon]} {item.nameId}
                    </Badge>
                </PopoverTrigger>

                <Portal>
                    <PopoverContent side="top">
                        <Card className="min-w-50">
                            <MyCardHeaderTitle title={`X ${f(quantity)} ${item.nameId}`} icon={IconsData[item.icon]} />
                            <CardContent className="text-sm">
                                <ItemInfo item={item} />
                            </CardContent>
                        </Card>
                    </PopoverContent>
                </Portal>
            </Popover>
        </div>
    )
}

const KillRequestUi = (props: { questId: string; outcomeId: string; requestId: string }) => {
    const { questId, outcomeId, requestId } = props
    const description = useGameStore(
        useCallback((s: GameState) => selectOutcomeDescription(questId, outcomeId)(s), [questId, outcomeId])
    )
    const request = useGameStore(
        useCallback((s: GameState) => selectRequest(questId, outcomeId, requestId)(s), [questId, outcomeId])
    )
    if (!request) return <></>
    if (!isKillingQuestRequest(request)) return <></>

    return (
        <div>
            {description}
            {request.targets.map((target: KillQuestTarget) => (
                <KillOutcomeProgress key={questId + outcomeId + target.targetId} target={target} />
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

const CollectRequestUi = (props: { questId: string; id: string; requestId: string }) => {
    const { id } = props
    return <>{id}</>
}
