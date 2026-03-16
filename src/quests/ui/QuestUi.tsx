import { Popover, PopoverContent, PopoverTrigger, Portal } from '@radix-ui/react-popover'
import { memo, ReactNode, useCallback } from 'react'
import { GiTiedScroll } from 'react-icons/gi'
import { useShallow } from 'zustand/react/shallow'
import { useItemName } from '@/items/useItemName'
import { CharTemplatesData } from '../../characters/templates/charTemplateData'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../components/ui/accordion'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { useNumberFormatter } from '../../formatters/selectNumberFormatter'
import { GameState } from '../../game/GameState'
import { setState } from '../../game/setState'
import { useGameStore } from '../../game/state'
import { IconsData } from '../../icons/Icons'
import { Check, ChevronsUpDownIcon, Coins } from '../../icons/IconsMemo'
import { ItemIconName } from '../../items/ui/ItemIconName'
import { ItemInfo } from '../../items/ui/ItemInfo'
import { useTranslations } from '../../msg/useTranslations'
import { selectGameItem } from '../../storage/StorageSelectors'
import { MyCardHeaderTitle } from '../../ui/myCard/MyCard'
import { MyPage, MyPageAll } from '../../ui/pages/MyPage'
import { ProgressBar } from '../../ui/progress/ProgressBar'
import { CollapsedEnum } from '../../ui/sidebar/CollapsedEnum'
import { CollapsibleMenu, MyListItem } from '../../ui/sidebar/MenuItem'
import { SidebarContainer } from '../../ui/sidebar/SidebarContainer'
import { sidebarOpen } from '../../ui/state/uiFunctions'
import { TitleH1, TypographyP } from '../../ui/typography'
import { CollectRequestUi } from '../collectRequest/CollectRequestUi'
import { isCollectReq } from '../collectRequest/collectSelectors'
import { KillQuestTarget } from '../KillQuestTarget'
import { isKillingReq, KillQuestRequestSelectors, selectQuestTargets } from '../killRequest/killSelectors'
import { acceptClick, completeQuest, selectQuest, setExpandedOutcome } from '../QuestFunctions'
import { QuestStatus } from '../QuestTypes'
import {
    isOutcomeCompleted,
    isQuestSelected,
    selectAcceptedQuests,
    selectAvailableQuests,
    selectExpandedOutcomeId,
    selectOutcomeDescription,
    selectOutcomeGoldReward,
    selectOutcomeIds,
    selectOutcomeItemReward,
    selectOutcomeTitle,
    selectQuestDescription,
    selectQuestIcon,
    selectQuestId,
    selectQuestName,
    selectQuestStatus,
} from '../selectors/QuestSelectors'
import classes from './QuestUi.module.css'

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
    const ids = useGameStore(useShallow(selectAcceptedQuests))

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
    const ids = useGameStore(useShallow(selectAvailableQuests))

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

export const QuestUi = memo(function QuestUi() {
    return (
        <MyPageAll sidebar={<QUestSidebar />}>
            <MyPage>
                <div className="mx-auto max-w-6xl">
                    <QuestDetailUi />
                </div>
            </MyPage>
        </MyPageAll>
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

const QuestDetailUi = memo(function QuestDetailUi() {
    const id = useGameStore(selectQuestId)

    const outcomeIds = useGameStore(selectOutcomeIds)
    const state = useGameStore(useCallback((s: GameState) => selectQuestStatus(id)(s), [id]))

    if (!id || id === '') return <></>

    return (
        <>
            <QuestTitle />

            <div className="mt-4 grid gap-4">
                <QuestAccordion>
                    {outcomeIds.map((outcomeId) => (
                        <QuestOutcomeUi questId={id} outcomeId={outcomeId} key={outcomeId} />
                    ))}
                </QuestAccordion>
                {state === QuestStatus.AVAILABLE && <QuestButtons id={id} />}
            </div>
        </>
    )
})

export const QuestTitle = () => {
    const id = useGameStore(selectQuestId)
    const nameId = useGameStore(useCallback((s: GameState) => selectQuestName(id)(s), [id]))
    const iconId = useGameStore(useCallback((s: GameState) => selectQuestIcon(id)(s), [id]))
    const description = useGameStore(useCallback((s: GameState) => selectQuestDescription(id)(s), [id]))
    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <TitleH1>
                        {IconsData[iconId]}
                        {nameId}
                    </TitleH1>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <TypographyP>{description}</TypographyP>
            </CardContent>
        </Card>
    )
}

export const QuestAccordion = ({ children }: { children: ReactNode[] }) => {
    const id = useGameStore(selectQuestId)
    const onExpOutcomeChange = useCallback((outcomeId: string) => setExpandedOutcome(id, outcomeId), [id])
    const expOutcomeId = useGameStore(
        useCallback((s: GameState) => (id ? selectExpandedOutcomeId(s, id) : undefined), [id])
    )
    return (
        <Accordion
            type="single"
            collapsible
            className="grid w-full gap-4"
            value={expOutcomeId}
            onValueChange={onExpOutcomeChange}
        >
            {children}
        </Accordion>
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

    const status = useGameStore(useCallback((s: GameState) => selectQuestStatus(questId)(s), [questId]))

    const completed = useGameStore(
        useCallback((s: GameState) => isOutcomeCompleted(questId, outcomeId)(s), [questId, outcomeId])
    )
    const completeClick = useCallback(() => {
        setState((s: GameState) => completeQuest(s, questId, outcomeId))
    }, [questId, outcomeId])

    const title = useGameStore(
        useCallback((s: GameState) => selectOutcomeTitle(questId, outcomeId)(s), [questId, outcomeId])
    )

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
        <AccordionItem value={outcomeId}>
            <Card>
                <CardHeader>
                    <AccordionTrigger className="p-0">
                        <CardTitle>
                            {ChevronsUpDownIcon} {title}
                        </CardTitle>
                    </AccordionTrigger>
                </CardHeader>

                <AccordionContent>
                    <CardContent className="flex flex-col gap-4">
                        <TypographyP>{description}</TypographyP>

                        {isKilling && <KillRequestUi questId={questId} outcomeId={outcomeId} />}
                        {isCollecting && <CollectRequestUi questId={questId} outcomeId={outcomeId} />}

                        <OutcomeReward questId={questId} outcomeId={outcomeId} />
                        {status === QuestStatus.ACCEPTED && (
                            <Button onClick={completeClick} disabled={!completed} className="self-start">
                                {t.Complete}
                            </Button>
                        )}
                    </CardContent>
                </AccordionContent>
            </Card>
        </AccordionItem>
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
        <div>
            <CardTitle>{t.Rewards}</CardTitle>
            <div className="mt-2 flex flex-wrap gap-2">
                {gold > 0 && (
                    <Badge variant="secondary" size="base">
                        {Coins}
                        {f(gold)}
                    </Badge>
                )}
                {items.map((r) => (
                    <ItemRewardUi itemId={r.itemId} quantity={r.quantity} key={questId + r.itemId + r.quantity} />
                ))}
            </div>
        </div>
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

    const name = useItemName(item)

    if (!item) return <></>
    const icon = IconsData[item.icon]

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Badge variant="secondary" size="base">
                    {f(quantity)} <ItemIconName itemId={itemId} />
                </Badge>
            </PopoverTrigger>

            <Portal>
                <PopoverContent side="top">
                    <Card className="min-w-50">
                        <MyCardHeaderTitle title={`${f(quantity)} ${name}`} icon={icon} />
                        <CardContent>
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
        <div className="@container">
            <TypographyP>{description}</TypographyP>
            <div className={classes.killContainer}>
                {targets.map((target: KillQuestTarget) => (
                    <KillOutcomeProgress key={questId + outcomeId + target.targetId} target={target} />
                ))}
                {targets.map((target: KillQuestTarget) => (
                    <KillOutcomeProgress key={questId + outcomeId + target.targetId} target={target} />
                ))}
            </div>
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
        <div>
            <Badge variant="secondary" className="mb-1" size="base">
                {killedCount >= targetCount && Check} {IconsData[charTemplate.iconId]} {t[charTemplate.nameId]}{' '}
                {f(killedCount)}/{f(targetCount)}
            </Badge>
            <ProgressBar value={percent} color="primary" />
        </div>
    )
}
