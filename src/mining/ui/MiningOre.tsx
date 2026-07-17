import { memo, useCallback } from 'react'
import { MyLabel, MyLabelContainer } from '@/ui/myCard/MyLabel'
import { removeActivity } from '../../activities/functions/removeActivity'
import { AddActivityDialog } from '../../activities/ui/AddActivityDialog'
import { BonusDialog } from '../../bonus/ui/BonusUi'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardFooter } from '../../components/ui/card'
import { useNumberFormatter } from '../../formatters/selectNumberFormatter'
import { GameState } from '../../game/GameState'
import { useGameStore } from '../../game/state'
import { Icons, IconsData } from '../../icons/Icons'
import { useTranslations } from '../../msg/useTranslations'
import { MyCardHeaderTitle } from '../../ui/myCard/MyCard'
import { RestartProgress } from '../../ui/progress/RestartProgress'
import { GameTimerProgress } from '../../ui/progress/TimerProgress'
import { selectOreType } from '../../ui/state/uiSelectors'
import { addMining } from '../functions/addMining'
import { selectDefaultMine, selectMiningId, selectOre } from '../miningSelectors'
import { OreData } from '../OreData'
import { selectMiningDamageAllMemo, selectMiningDamageMemo } from '../selectors/miningDamage'
import { selectMiningTimeAllMemo, selectMiningTimeMemo } from '../selectors/miningTime'
import { selectActiveVein } from '../selectors/selectActiveVein'

export const MiningOre = memo(function MiningOre() {
    const { f } = useNumberFormatter()
    const { t, fun } = useTranslations()
    const oreType = useGameStore(selectOreType)

    const ore = useGameStore(useCallback((state: GameState) => selectOre(state, oreType), [oreType]))
    const activeVein = useGameStore(useCallback((state: GameState) => selectActiveVein(state, oreType), [oreType]))
    const act = useGameStore(useCallback((state: GameState) => selectMiningId(state, oreType), [oreType]))
    const damage = useGameStore(selectMiningDamageMemo)
    const time = useGameStore(selectMiningTimeMemo)

    const oreData = OreData[oreType]
    const def = useGameStore(useCallback((s) => selectDefaultMine(s, oreType), [oreType]))
    const hp = activeVein?.hp ?? ore.hp
    const maxHp = activeVein?.maxHp ?? def.hp
    const armour = activeVein?.armour ?? oreData.armour
    const hpPercent = Math.floor((100 * hp) / Math.max(1, maxHp))

    return (
        <Card>
            <MyCardHeaderTitle title={t.Mining} icon={IconsData[Icons.Pickaxe]} />
            <CardContent>
                <MyLabelContainer>
                    <MyLabel>
                        {t.OreHp} {f(hp)} <span className="text-muted-foreground">/ {f(maxHp)}</span>
                    </MyLabel>
                    <MyLabel>
                        {t.Armour} {f(armour)}
                    </MyLabel>
                    <MyLabel>
                        {t.Damage} {f(damage)}
                        <BonusDialog title={t.MiningDamage} selectBonusResult={selectMiningDamageAllMemo} />
                    </MyLabel>
                </MyLabelContainer>
                <RestartProgress value={hpPercent} color="health" className="mb-2" />
                <MyLabel>
                    {t.Time} {fun.formatTime(time)}
                    <BonusDialog title={t.MiningTime} selectBonusResult={selectMiningTimeAllMemo} isTime={true} />
                </MyLabel>
                <GameTimerProgress actionId={act} color="primary" className="mb-2" />
            </CardContent>
            <CardFooter>
                <MiningButton />
            </CardFooter>
        </Card>
    )
})

const MiningButton = memo(function MiningButton() {
    const { t } = useTranslations()
    const oreType = useGameStore(selectOreType)
    const act = useGameStore(useCallback((state: GameState) => selectMiningId(state, oreType), [oreType]))
    const onClickStart = useCallback(() => addMining(oreType), [oreType])
    const onClickRemove = useCallback(() => removeActivity(act), [act])

    if (act)
        return (
            <Button onClick={onClickRemove} variant="destructive">
                {t.Stop}
            </Button>
        )

    return (
        <AddActivityDialog
            addBtn={<Button onClick={onClickStart}>{t.Mine}</Button>}
            title={
                <>
                    {IconsData.Pickaxe} {t.Mining}
                </>
            }
            openBtn={<Button>{t.Mine}</Button>}
        />
    )
})
