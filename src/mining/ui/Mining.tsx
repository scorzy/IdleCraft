import { memo, useCallback } from 'react'
import { TbAlertTriangle } from 'react-icons/tb'
import { useGameStore } from '../../game/state'
import { selectOreType } from '../../ui/state/uiSelectors'
import { MyCardHeaderTitle } from '../../ui/myCard/MyCard'
import { isOreEnabled, selectDefaultMine, selectMining, selectOre } from '../miningSelectors'
import { useNumberFormatter } from '../../formatters/selectNumberFormatter'
import { useTranslations } from '../../msg/useTranslations'
import { Button } from '../../components/ui/button'
import { RestartProgress } from '../../ui/progress/RestartProgress'
import { GameTimerProgress } from '../../ui/progress/TimerProgress'
import { OreData } from '../OreData'
import { ExperienceCard } from '../../experience/ui/ExperienceCard'
import { ExpEnum } from '../../experience/expEnum'
import { EquipItemUi } from '../../items/ui/EquipSelect'
import { EquipSlotsEnum } from '../../characters/equipSlotsEnum'
import { MyPage, MyPageAll } from '../../ui/pages/MyPage'
import { addMining } from '../functions/addMining'
import { removeActivity } from '../../activities/functions/removeActivity'
import { Icons, IconsData } from '../../icons/Icons'
import { selectMiningTime, selectMiningTimeAll } from '../selectors/miningTime'
import { BonusDialog } from '../../bonus/ui/BonusUi'
import { selectMiningDamage, selectMiningDamageAll } from '../selectors/miningDamage'
import { GameState } from '../../game/GameState'
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert'
import { Card, CardContent, CardFooter } from '../../components/ui/card'
import { PLAYER_ID } from '../../characters/charactersConst'
import { MiningSidebar } from './MiningSidebar'
import { MyLabel, MyLabelContainer } from '@/ui/myCard/MyLabel'

export const Mining = memo(function Mining() {
    const oreType = useGameStore(selectOreType)
    return (
        <MyPageAll
            sidebar={<MiningSidebar />}
            info={
                <div className="page__info">
                    <ExperienceCard expType={ExpEnum.Mining} charId={PLAYER_ID} />
                    <EquipItemUi slot={EquipSlotsEnum.Pickaxe} />
                </div>
            }
        >
            <MyPage className="page__main" key={oreType}>
                <MiningOreLock />
            </MyPage>
        </MyPageAll>
    )
})

const MiningOreLock = memo(function MiningOreLock() {
    const { f } = useNumberFormatter()
    const { t, fun } = useTranslations()
    const oreType = useGameStore(selectOreType)
    const isEnabled = useCallback((state: GameState) => isOreEnabled(oreType)(state), [oreType])
    const enabled = useGameStore(isEnabled)
    const data = OreData[oreType]

    if (enabled)
        return (
            <>
                <MiningOre />
                <OreUi />
            </>
        )

    return (
        <Alert variant="destructive">
            <TbAlertTriangle className="h-4 w-4" />
            <AlertTitle>{t.LevelToLow}</AlertTitle>
            <AlertDescription>{fun.requireMiningLevel(f(data.requiredLevel))}</AlertDescription>
        </Alert>
    )
})

const MiningOre = memo(function MiningOre() {
    const { f, ft } = useNumberFormatter()
    const { t } = useTranslations()
    const oreType = useGameStore(selectOreType)

    const selectOreMemo = useCallback((state: GameState) => selectOre(oreType)(state), [oreType])
    const selectMiningMemo = useCallback((state: GameState) => selectMining(oreType)(state), [oreType])
    const ore = useGameStore(selectOreMemo)
    const act = useGameStore(selectMiningMemo)
    const damage = useGameStore(selectMiningDamage)
    const time = useGameStore(selectMiningTime)

    const def = selectDefaultMine(oreType)
    const hpPercent = Math.floor((100 * ore.hp) / def.hp)

    const oreData = OreData[oreType]

    return (
        <Card>
            <MyCardHeaderTitle title={t.Mining} icon={IconsData[Icons.Pickaxe]} />
            <CardContent>
                <MyLabelContainer>
                    <MyLabel>
                        {t.OreHp} {f(ore.hp)} <span className="text-muted-foreground">/ {f(def.hp)}</span>
                    </MyLabel>
                    <MyLabel>
                        {t.Armour} {f(oreData.armour)}
                    </MyLabel>
                    <MyLabel>
                        {t.Damage} {f(damage)}
                        <BonusDialog title={t.MiningDamage} selectBonusResult={selectMiningDamageAll} />
                    </MyLabel>
                </MyLabelContainer>
                <RestartProgress value={hpPercent} color="health" className="mb-2" />
                <MyLabel>
                    {t.Time} {ft(time)}
                    <BonusDialog title={t.MiningTime} selectBonusResult={selectMiningTimeAll} isTime={true} />
                </MyLabel>
                <GameTimerProgress actionId={act} color="primary" className="mb-2" />
            </CardContent>
            <MiningButton />
        </Card>
    )
})

const MiningButton = memo(function CuttingButton() {
    const { t } = useTranslations()
    const oreType = useGameStore(selectOreType)
    const selectMiningMemo = useCallback((state: GameState) => selectMining(oreType)(state), [oreType])
    const act = useGameStore(selectMiningMemo)
    const onClickStart = useCallback(() => addMining(oreType), [oreType])
    const onClickRemove = useCallback(() => removeActivity(act), [act])

    let btn = <></>
    if (!act) btn = <Button onClick={onClickStart}>{t.Mine}</Button>
    else
        btn = (
            <Button onClick={onClickRemove} variant="destructive">
                {t.Stop}
            </Button>
        )

    return <CardFooter>{btn}</CardFooter>
})
const OreUi = memo(function MiningOre() {
    const { f } = useNumberFormatter()
    const { t } = useTranslations()
    const oreType = useGameStore(selectOreType)
    const selectOreMemo = useCallback((state: GameState) => selectOre(oreType)(state), [oreType])
    const ore = useGameStore(selectOreMemo)
    const def = selectDefaultMine(oreType)
    const hpPercent = Math.floor((100 * ore.qta) / def.qta)
    const oreData = OreData[oreType]

    return (
        <Card>
            <MyCardHeaderTitle title={t.OreVein} icon={IconsData[oreData.iconId]} />
            <CardContent>
                <MyLabel>
                    {t.OreQta} {f(ore.qta)}/{f(def.qta)}
                </MyLabel>
                <RestartProgress value={hpPercent} color="health" />
            </CardContent>
        </Card>
    )
})
