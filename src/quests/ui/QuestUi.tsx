import { memo, useCallback } from 'react'
import { GiTiedScroll } from 'react-icons/gi'
import { Popover, PopoverTrigger, PopoverContent, Portal } from '@radix-ui/react-popover'
import { useShallow } from 'zustand/react/shallow'
import { useGameStore } from '../../game/state'
import { MyPage, MyPageAll } from '../../ui/pages/MyPage'
import { CollapsedEnum } from '../../ui/sidebar/CollapsedEnum'
import { CollapsibleMenu, MyListItem } from '../../ui/sidebar/MenuItem'
import { SidebarContainer } from '../../ui/sidebar/SidebarContainer'
import { sidebarOpen } from '../../ui/state/uiFunctions'
import {
    CollectQuestRequestSelectors,
    isCollectReq,
    isKillingReq,
    isOutcomeCompleted,
    isQuestSelected,
    KillQuestRequestSelectors,
    selectAcceptedQuests,
    selectAvailableQuests,
    selectItemReq,
    selectOutcomeDescription,
    selectOutcomeGoldReward,
    selectOutcomeIds,
    selectOutcomeItemReward,
    selectQuestDescription,
    selectQuestIcon,
    selectQuestId,
    selectQuestItemsReqIds,
    selectQuestName,
    selectQuestStatus,
    selectQuestTargets,
} from '../QuestSelectors'
import { IconsData } from '../../icons/Icons'
import { acceptClick, completeQuest, selectQuest } from '../QuestFunctions'
import { GameState } from '../../game/GameState'
import { Button } from '../../components/ui/button'
import { QuestStatus } from '../QuestTypes'
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
    const description = useGameStore(useCallback((s: GameState) => selectQuestDescription(id)(s), [id]))
    const outcomeIds = useGameStore(selectOutcomeIds)
    const state = useGameStore(useCallback((s: GameState) => selectQuestStatus(id)(s), [id]))

    if (!id || id === '') return <></>

    return (
        <>
            <TitleH1>
                {IconsData[iconId]}
                {nameId}
            </TitleH1>
            <TypographyP>{description}</TypographyP>
            <div className="mt-4 grid gap-4">
                {outcomeIds.map((outcomeId) => (
                    <QuestOutcomeUi questId={id} outcomeId={outcomeId} key={outcomeId} />
                ))}
                {state === QuestStatus.AVAILABLE && <QuestButtons id={id} />}
            </div>
        </>
    )
}

const QuestButtons = (props: { id: string }) => {
    const { id } = props
    const { t } = useTranslations()

    const onClick = useCallback(() => acceptClick(id), [id])

    return (
        <Button onClick={onClick} className="justify-self-start">
            {t.Accept}
        </Button>
    )
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

    const description = useGameStore(
        useCallback((s: GameState) => selectOutcomeDescription(questId, outcomeId)(s), [questId, outcomeId])
    )

    const isKilling = useGameStore(
        useCallback((s: GameState) => isKillingReq(s, questId, outcomeId), [questId, outcomeId])
    )
    const isCollecting = useGameStore(
        useCallback((s: GameState) => isCollectReq(s, questId, outcomeId), [questId, outcomeId])
    )

    return (
        <Card>
            <CardContent>
                <TypographyP>{description}</TypographyP>

                {isKilling && <KillRequestUi questId={questId} outcomeId={outcomeId} />}
                {isCollecting && <CollectRequestUi questId={questId} outcomeId={outcomeId} />}

                <OutcomeReward questId={questId} outcomeId={outcomeId} />
                {completed && (
                    <Button className="mt-6" onClick={completeClick}>
                        {t.Complete}
                    </Button>
                )}
            </CardContent>
        </Card>
    )
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
            <div className="mt-2 flex flex-wrap gap-2">
                <TypographyP>Rewards: </TypographyP>
                {gold > 0 && (
                    <Badge variant="secondary">
                        {t.Gold}: {f(gold)}
                    </Badge>
                )}
                {items.map((r) => (
                    <ItemRewardUi itemId={r.itemId} quantity={r.quantity} key={questId + r.itemId + r.quantity} />
                ))}
            </div>
        </>
    )
}

export function ItemRewardUi(props: { itemId: string; quantity: number }) {
    const { itemId, quantity } = props
    const { t } = useTranslations()
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

    const name = t[item.nameId]
    const icon = IconsData[item.icon]

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Badge variant="secondary">
                    {f(quantity)} {icon} {name}
                </Badge>
            </PopoverTrigger>

            <Portal>
                <PopoverContent side="top">
                    <Card className="min-w-50">
                        <MyCardHeaderTitle title={`${f(quantity)} ${name}`} icon={icon} />
                        <CardContent className="text-sm">
                            <ItemInfo item={item} />
                        </CardContent>
                    </Card>
                </PopoverContent>
            </Portal>
        </Popover>
    )
}

const KillRequestUi = (props: { questId: string; outcomeId: string }) => {
    const { questId, outcomeId } = props
    const description = useGameStore(
        useCallback(
            (s: GameState) => KillQuestRequestSelectors.getDescription(questId, outcomeId)(s),
            [questId, outcomeId]
        )
    )
    const targets = useGameStore(
        useCallback((s: GameState) => selectQuestTargets(s, questId, outcomeId), [questId, outcomeId])
    )
    if (!targets) return <></>

    return (
        <div>
            <TypographyP>{description}</TypographyP>

            {targets.map((target: KillQuestTarget) => (
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

const CollectRequestUi = (props: { questId: string; outcomeId: string }) => {
    const { questId, outcomeId } = props
    const description = useGameStore(
        useCallback(
            (s: GameState) => CollectQuestRequestSelectors.getDescription(questId, outcomeId)(s),
            [questId, outcomeId]
        )
    )
    const itemsReq = useGameStore(
        useShallow(useCallback((s: GameState) => selectQuestItemsReqIds(s, questId, outcomeId), [questId, outcomeId]))
    )

    if (!itemsReq) return

    return (
        <div>
            <TypographyP>{description}</TypographyP>
            {itemsReq.map((req) => (
                <CollectRequest questId={questId} outcomeId={outcomeId} reqId={req} key={req}></CollectRequest>
            ))}
        </div>
    )
}
const CollectRequest = (props: { questId: string; outcomeId: string; reqId: string }) => {
    const { questId, outcomeId, reqId } = props

    const req = useGameStore(
        useCallback((s: GameState) => selectItemReq(s, questId, outcomeId, reqId), [questId, outcomeId, reqId])
    )

    if (!req) return null

    return <div></div>
}
