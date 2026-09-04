import { memoize } from 'proxy-memoize'
import { memo, ReactNode, useCallback, useMemo, useState } from 'react'
import { GiTiedScroll } from 'react-icons/gi'
import { useItemName } from '@/items/selectors/useItemName'
import { getCharacterDefinition } from '../../characters/templates/characterRegistry'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../components/ui/accordion'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '../../components/ui/alert-dialog'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../components/ui/card'
import { useNumberFormatter } from '../../formatters/selectNumberFormatter'
import { GameState } from '../../game/GameState'
import { setState } from '../../game/setState'
import { useGameStore } from '../../game/state'
import { IconsData } from '../../icons/Icons'
import { Check, ChevronsUpDownIcon, Coins } from '../../icons/IconsMemo'
import { ItemIconName } from '../../items/ui/ItemIconName'
import { ItemInfo } from '../../items/ui/ItemInfo'
import { useTranslations } from '../../msg/useTranslations'
import { selectGameItem, selectItemQta } from '../../storage/StorageSelectors'
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
import { acceptClick, completeQuest, discardClick, selectQuest, setExpandedOutcome } from '../QuestFunctions'
import { QuestStatus } from '../QuestTypes'
import {
    isOutcomeCompleted,
    isQuestSelected,
    selectExpandedOutcomeId,
    selectIsQuestAuto,
    selectIsQuestMain,
    selectOutcomeDescription,
    selectOutcomeGoldReward,
    selectOutcomeIds,
    selectOutcomeItemRewards,
    selectOutcomeTitle,
    selectQuestDescription,
    selectQuestIcon,
    selectQuestId,
    selectQuestName,
    selectQuestStatus,
} from '../selectors/QuestSelectors'
import { selectAcceptedQuestsMemo, selectAvailableQuestsMemo } from '../selectors/QuestSelectorsMemo'
import classes from './QuestUi.module.css'
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover'
import { useShallow } from 'zustand/react/shallow'

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
    const ids = useGameStore(selectAcceptedQuestsMemo)

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
    const ids = useGameStore(selectAvailableQuestsMemo)

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
    const questId = useGameStore(selectQuestId)
    return (
        <MyPageAll sidebar={<QUestSidebar />}>
            <MyPage>
                <div className="mx-auto max-w-6xl">{questId && <QuestDetailUi questId={questId} />}</div>
            </MyPage>
        </MyPageAll>
    )
})

const QUestSidebar = () => {
    return (
        <SidebarContainer collapsedId={CollapsedEnum.Quest} expandedWidth="clamp(20rem, 28vw, 32rem)">
            <SidebarQuestAccepted />
            <SidebarQuestAvailable />
        </SidebarContainer>
    )
}

export const QuestDetailUi = memo(function QuestDetailUi({ questId }: { questId: string }) {
    const outcomeIds = useGameStore(useCallback((s: GameState) => selectOutcomeIds(questId)(s), [questId]))
    const state = useGameStore(useCallback((s: GameState) => selectQuestStatus(questId)(s), [questId]))
    const main = useGameStore(useCallback((s: GameState) => selectIsQuestMain(questId)(s), [questId]))

    if (!questId || questId === '') return <></>

    return (
        <>
            <QuestTitle questId={questId} />

            <div className="mt-4 grid gap-4">
                <QuestAccordion questId={questId}>
                    {outcomeIds.map((outcomeId) => (
                        <QuestOutcomeUi questId={questId} outcomeId={outcomeId} key={outcomeId} />
                    ))}
                </QuestAccordion>
                {(state === QuestStatus.AVAILABLE || !main) && (
                    <QuestButtons id={questId} available={state === QuestStatus.AVAILABLE} main={main} />
                )}
            </div>
        </>
    )
})

export const QuestTitle = ({ questId }: { questId: string }) => {
    const nameId = useGameStore(useCallback((s: GameState) => selectQuestName(questId)(s), [questId]))
    const iconId = useGameStore(useCallback((s: GameState) => selectQuestIcon(questId)(s), [questId]))
    const description = useGameStore(useCallback((s: GameState) => selectQuestDescription(questId)(s), [questId]))
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

export const QuestAccordion = ({ questId, children }: { questId: string; children: ReactNode[] }) => {
    const onExpOutcomeChange = useCallback(
        (outcomeId: string[]) => setExpandedOutcome(questId, outcomeId[0] ?? ''),
        [questId]
    )
    const expOutcomeId = useGameStore(
        useShallow(
            useCallback((s: GameState) => (questId ? selectExpandedOutcomeId(s, questId) : undefined), [questId])
        )
    )
    return (
        <Accordion className="grid w-full gap-4" value={expOutcomeId} onValueChange={onExpOutcomeChange}>
            {children}
        </Accordion>
    )
}

const QuestButtons = (props: { id: string; available: boolean; main: boolean }) => {
    const { id, available, main } = props
    const { t } = useTranslations()
    const [discardOpen, setDiscardOpen] = useState(false)

    const onAccept = useCallback(() => acceptClick(id), [id])
    const onDiscard = useCallback(() => {
        discardClick(id)
        setDiscardOpen(false)
    }, [id])

    return (
        <div className="flex gap-2 justify-self-start">
            {available && <Button onClick={onAccept}>{t.Accept}</Button>}
            {!main && (
                <AlertDialog open={discardOpen} onOpenChange={setDiscardOpen}>
                    <AlertDialogTrigger render={<Button variant="destructive">{t.Abandon}</Button>} />
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>{t.abandonConfirmTitle}</AlertDialogTitle>
                            <AlertDialogDescription>{t.abandonConfirmDesc}</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
                            <AlertDialogAction onClick={onDiscard}>{t.Abandon}</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </div>
    )
}

const QuestOutcomeUi = (props: { questId: string; outcomeId: string }) => {
    const { questId, outcomeId } = props
    const { t } = useTranslations()

    const status = useGameStore(useCallback((s: GameState) => selectQuestStatus(questId)(s), [questId]))
    const isAuto = useGameStore(useCallback((s: GameState) => selectIsQuestAuto(questId)(s), [questId]))

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
                    <CardContent className="flex flex-col">
                        <TypographyP>{description}</TypographyP>

                        {isKilling && <KillRequestUi questId={questId} outcomeId={outcomeId} />}
                        {isCollecting && <CollectRequestUi questId={questId} outcomeId={outcomeId} />}

                        <OutcomeReward questId={questId} outcomeId={outcomeId} />
                    </CardContent>
                    {!isAuto && status === QuestStatus.ACCEPTED && (
                        <CardFooter>
                            <Button onClick={completeClick} disabled={!completed} className="self-start">
                                {t.Complete}
                            </Button>
                        </CardFooter>
                    )}
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
    const selectItems = useMemo(
        () => memoize((s: GameState) => selectOutcomeItemRewards(s, questId, outcomeId)),
        [questId, outcomeId]
    )
    const items = useGameStore(selectItems)

    if (gold <= 0 && items.length < 1) return null

    return (
        <div className="mt-4">
            <CardTitle>{t.Rewards}</CardTitle>
            <div className="mt-2 flex flex-wrap gap-2">
                {gold > 0 && (
                    <Badge
                        variant="secondary"
                        // size="base"
                    >
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
    const { t } = useTranslations()
    const qta = useGameStore(selectItemQta(null, itemId))

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
            <PopoverTrigger
                render={
                    <Button variant="secondary" size="sm">
                        {f(quantity)} <ItemIconName itemId={itemId} />
                    </Button>
                }
            />
            <PopoverContent side="top">
                <MyCardHeaderTitle title={`${f(quantity)} ${name}`} icon={icon} />
                {qta > 0 && (
                    <span className="text-muted-foreground">
                        {t.YouHave} {f(qta)}
                    </span>
                )}
                <ItemInfo item={item} />
            </PopoverContent>
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
            </div>
        </div>
    )
}
const KillOutcomeProgress = (props: { target: KillQuestTarget }) => {
    const { target } = props
    const { targetId, targetCount, killedCount } = target
    const { t } = useTranslations()
    const { f } = useNumberFormatter()
    const charTemplate = getCharacterDefinition(targetId)

    if (targetCount <= 0) return <></>
    const percent = Math.round((killedCount / targetCount) * 100)
    return (
        <div>
            <Badge variant="secondary" className="mb-1">
                {killedCount >= targetCount && Check} {IconsData[charTemplate.iconId]} {t[charTemplate.nameId]}{' '}
                {f(killedCount)}/{f(targetCount)}
            </Badge>
            <ProgressBar value={percent} color="primary" />
        </div>
    )
}
