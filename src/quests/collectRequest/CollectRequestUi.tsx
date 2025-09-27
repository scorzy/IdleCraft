import { Fragment, useCallback, useMemo } from 'react'
import { TbXboxX } from 'react-icons/tb'
import { useShallow } from 'zustand/react/shallow'
import { memoize } from 'proxy-memoize'
import { ItemsSelect } from '../../storage/ui/ItemsSelect'
import { selectFilteredItemsNumber } from '../../storage/StorageSelectors'
import { useTranslations } from '../../msg/useTranslations'
import { useGameStore } from '../../game/state'
import { GameState } from '../../game/GameState'
import { useNumberFormatter } from '../../formatters/selectNumberFormatter'
import { ItemFilterDescription } from '../../items/ui/ItemFilterUI'
import { ItemIconName } from '../../items/ui/ItemIconName'
import { TypographyP } from '../../ui/typography'
import { QuestStatus } from '../QuestTypes'
import { selectQuestStatus } from '../selectors/QuestSelectors'
import { Badge } from '../../components/ui/badge'
import { Check } from '../../icons/IconsMemo'
import {
    selectItemReq,
    selectCollectQuestItemValue,
    selectCollectQuestChosenItems,
    selectCollectQuestTotalQta,
    selectQuestItemsReqIds,
} from './collectSelectors'
import classes from './QuestUi.module.css'
import { onCollectQuestItemSelect } from './onCollectQuestItemSelect'

export const CollectRequestUi = (props: { questId: string; outcomeId: string }) => {
    const { questId, outcomeId } = props
    const itemsReq = useGameStore(
        useShallow(useCallback((s: GameState) => selectQuestItemsReqIds(s, questId, outcomeId), [questId, outcomeId]))
    )

    if (!itemsReq) return

    return (
        <div className="flex flex-col gap-5">
            <div className="@container grid">
                <div className={classes.CollectContainer}>
                    {itemsReq.map((req) => (
                        <CollectRequest questId={questId} outcomeId={outcomeId} reqId={req} key={req} />
                    ))}
                </div>
            </div>
            <CollectRequestItemsUi questId={questId} outcomeId={outcomeId} />
        </div>
    )
}

const CollectRequestItemsUi = (props: { questId: string; outcomeId: string }) => {
    const { questId, outcomeId } = props
    const { f } = useNumberFormatter()
    const { t } = useTranslations()

    const selectCollectQuestChosenItemsMemo = useMemo(
        () => memoize((s: GameState) => selectCollectQuestChosenItems(s, questId, outcomeId)),
        [questId, outcomeId]
    )

    const reqItems = useGameStore(selectCollectQuestChosenItemsMemo)

    if (reqItems.usedItems.length < 1) return

    return (
        <TypographyP className="flex items-center gap-1">
            {t.collectConsume}
            {reqItems.usedItems.map((i, index) => (
                <Fragment key={i.itemId}>
                    <Badge variant="secondary" size="base">
                        {f(i.quantity)}
                        <ItemIconName itemId={i.itemId} />
                    </Badge>
                    {index < reqItems.usedItems.length - 1 && ','}
                </Fragment>
            ))}
        </TypographyP>
    )
}

const CollectRequest = ({ questId, outcomeId, reqId }: { questId: string; outcomeId: string; reqId: string }) => {
    const { fun } = useTranslations()
    const status = useGameStore(useCallback((s) => selectQuestStatus(questId)(s), [questId]))
    const req = useGameStore(
        useCallback((s) => selectItemReq(s, questId, outcomeId, reqId), [questId, outcomeId, reqId])
    )
    const totalQta = useGameStore(
        useCallback((s) => selectCollectQuestTotalQta(s, questId, outcomeId, reqId), [questId, outcomeId, reqId])
    )

    if (!req) return null
    if (!req.itemFilter) return null

    return (
        <div>
            <TypographyP>
                {fun.collectN(req.itemCount)}
                <ItemFilterDescription itemFilter={req.itemFilter} />
            </TypographyP>
            <div className="grid grow basis-0 grid-flow-col items-center justify-start gap-1">
                {req.itemCount <= totalQta && Check}
                {req.itemCount > totalQta && <TbXboxX />}
                {fun.collectItemsTotal(totalQta)}
            </div>
            {status === QuestStatus.ACCEPTED && totalQta > 0 && (
                <CollectRequestSelection questId={questId} outcomeId={outcomeId} reqId={reqId} />
            )}
        </div>
    )
}

const CollectRequestSelection = (props: { questId: string; outcomeId: string; reqId: string }) => {
    const { questId, outcomeId, reqId } = props

    const req = useGameStore(
        useCallback((s: GameState) => selectItemReq(s, questId, outcomeId, reqId), [questId, outcomeId, reqId])
    )
    const itemNumber = useGameStore(
        useCallback(
            (s: GameState) => (req?.itemFilter ? selectFilteredItemsNumber(s, req.itemFilter) : 0),
            [req?.itemFilter]
        )
    )

    if (!req) return null
    if (!req.itemFilter) return null

    return (
        <div className={classes.CollectSelects}>
            <CollectRequestSelectionP questId={questId} outcomeId={outcomeId} reqId={reqId} priority={0} />

            {itemNumber > 1 && (
                <CollectRequestSelectionP questId={questId} outcomeId={outcomeId} reqId={reqId} priority={1} />
            )}

            {itemNumber > 2 && (
                <CollectRequestSelectionP questId={questId} outcomeId={outcomeId} reqId={reqId} priority={2} />
            )}
        </div>
    )
}

const CollectRequestSelectionP = ({
    questId,
    outcomeId,
    reqId,
    priority,
}: {
    questId: string
    outcomeId: string
    reqId: string
    priority: number
}) => {
    const { t } = useTranslations()

    const req = useGameStore(
        useCallback((s: GameState) => selectItemReq(s, questId, outcomeId, reqId), [questId, outcomeId, reqId])
    )

    const selectedValue = useGameStore(
        useCallback(
            (s: GameState) => selectCollectQuestItemValue(s, questId, outcomeId, reqId, priority),
            [questId, outcomeId, reqId, priority]
        )
    )
    const onValueChange = useCallback(
        (value: string) => onCollectQuestItemSelect(questId, outcomeId, reqId, priority, value),
        [questId, outcomeId, reqId, priority]
    )

    if (!req) return null
    if (!req.itemFilter) return null

    let label = t.highPriority
    if (priority === 1) label = t.mediumPriority
    else if (priority === 2) label = t.lowPriority

    return (
        <ItemsSelect
            itemFilter={req.itemFilter}
            selectedValue={selectedValue}
            onValueChange={onValueChange}
            label={label}
        />
    )
}
