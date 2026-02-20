import { memo, useCallback } from 'react'
import { TbAlertTriangle } from 'react-icons/tb'
import { useGameStore } from '../../game/state'
import { selectOreType } from '../../ui/state/uiSelectors'
import { MyCardHeaderTitle } from '../../ui/myCard/MyCard'
import { isOreEnabled, selectDefaultMine, selectMiningId, selectOre } from '../miningSelectors'
import { useNumberFormatter } from '../../formatters/selectNumberFormatter'
import { useTranslations } from '../../msg/useTranslations'
import { Button } from '../../components/ui/button'
import { RestartProgress } from '../../ui/progress/RestartProgress'
import { GameTimerProgress } from '../../ui/progress/TimerProgress'
import { OreData } from '../OreData'
import { ExperienceCard } from '../../experience/ui/ExperienceCard'
import { EquipItemUi } from '../../items/ui/EquipSelect'
import { EquipSlotsEnum } from '../../characters/equipSlotsEnum'
import { MyPage, MyPageAll } from '../../ui/pages/MyPage'
import { addMining } from '../functions/addMining'
import { removeActivity } from '../../activities/functions/removeActivity'
import { Icons, IconsData } from '../../icons/Icons'
import { selectMiningTimeAllMemo, selectMiningTimeMemo } from '../selectors/miningTime'
import { BonusDialog } from '../../bonus/ui/BonusUi'
import { selectMiningDamageAllMemo, selectMiningDamageMemo } from '../selectors/miningDamage'
import { GameState } from '../../game/GameState'
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert'
import { Card, CardContent, CardFooter } from '../../components/ui/card'
import { PLAYER_ID } from '../../characters/charactersConst'
import { ItemIcon } from '../../items/ui/ItemIcon'
import { useItemName } from '../../items/useItemName'
import { AddActivityDialog } from '../../activities/ui/AddActivityDialog'
import { MiningSidebar } from './MiningSidebar'
import { ExpEnum } from '@/experience/ExpEnum'
import { MyLabel, MyLabelContainer } from '@/ui/myCard/MyLabel'
import { addMiningVeinSearch } from '../functions/addMiningVeinSearch'
import { ActivityAdapter, ActivityTypes } from '@/activities/ActivityState'
import { removeOreVein } from '../miningFunctions'
import { setState } from '@/game/setState'
import { isMining } from '../Mining'
import { OreVeinState } from '../OreState'
import { SEARCH_ORE_VEIN_TIME } from '../functions/startMiningVeinSearch'
import { OreTypes } from '../OreTypes'

export const Mining = memo(function Mining() {
    const oreType = useGameStore(selectOreType)
    return (
        <MyPageAll
            sidebar={<MiningSidebar />}
            header={
                <div className='page__info'>
                    <ExperienceCard expType={ExpEnum.Mining} charId={PLAYER_ID} />
                    <EquipItemUi slot={EquipSlotsEnum.Pickaxe} />
                </div>
            }
        >
            <MyPage className='page__main' key={oreType}>
                <MiningOreLock />
                <OreVeinsUi />
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
        <Alert variant='destructive'>
            <TbAlertTriangle className='h-4 w-4' />
            <AlertTitle>{t.LevelToLow}</AlertTitle>
            <AlertDescription>{fun.requireMiningLevel(f(data.requiredLevel))}</AlertDescription>
        </Alert>
    )
})

function selectActiveVein(state: GameState, oreType: OreTypes): OreVeinState | undefined {
    const actId = selectMiningId(state, oreType)
    if (!actId) return

    const activity = ActivityAdapter.select(state.activities, actId)
    if (!activity || !isMining(activity) || !activity.activeVeinId) return

    return state.locations[state.location].oreVeins.find((w) => w.id === activity.activeVeinId)
}

const MiningOre = memo(function MiningOre() {
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
                        {t.OreHp} {f(hp)} <span className='text-muted-foreground'>/ {f(maxHp)}</span>
                    </MyLabel>
                    <MyLabel>
                        {t.Armour} {f(armour)}
                    </MyLabel>
                    <MyLabel>
                        {t.Damage} {f(damage)}
                        <BonusDialog title={t.MiningDamage} selectBonusResult={selectMiningDamageAllMemo} />
                    </MyLabel>
                </MyLabelContainer>
                <RestartProgress value={hpPercent} color='health' className='mb-2' />
                <MyLabel>
                    {t.Time} {fun.formatTime(time)}
                    <BonusDialog title={t.MiningTime} selectBonusResult={selectMiningTimeAllMemo} isTime={true} />
                </MyLabel>
                <GameTimerProgress actionId={act} color='primary' className='mb-2' />
            </CardContent>
            <CardFooter>
                <MiningButton />
            </CardFooter>
        </Card>
    )
})

const MiningButton = memo(function CuttingButton() {
    const { t } = useTranslations()
    const oreType = useGameStore(selectOreType)
    const act = useGameStore(useCallback((state: GameState) => selectMiningId(state, oreType), [oreType]))
    const onClickStart = useCallback(() => addMining(oreType), [oreType])
    const onClickRemove = useCallback(() => removeActivity(act), [act])

    if (act)
        return (
            <Button onClick={onClickRemove} variant='destructive'>
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
const OreUi = memo(function MiningOre() {
    const { f } = useNumberFormatter()
    const { t, fun } = useTranslations()
    const oreType = useGameStore(selectOreType)
    const oreQta = useGameStore(useCallback((state: GameState) => selectOre(state, oreType).qta, [oreType]))
    const activeVein = useGameStore(useCallback((state: GameState) => selectActiveVein(state, oreType), [oreType]))
    const def = useGameStore(useCallback((s) => selectDefaultMine(s, oreType), [oreType]))

    const oreData = OreData[activeVein?.oreType ?? oreType]
    const name = useItemName(oreData.oreId)
    const qta = activeVein?.qta ?? oreQta
    const maxQta = activeVein?.maxQta ?? def.qta
    const hpPercent = Math.floor((100 * qta) / Math.max(1, maxQta))

    return (
        <Card>
            <MyCardHeaderTitle title={fun.OreVein(name)} icon={<ItemIcon itemId={oreData.oreId} />} />
            <CardContent>
                <MyLabel>
                    {t.OreQta} {f(qta)}/{f(maxQta)}
                </MyLabel>
                <RestartProgress value={hpPercent} color='health' />
            </CardContent>
        </Card>
    )
})

const OreVeinsUi = memo(function OreVeinsUi() {
    const { t, fun } = useTranslations()
    const { f } = useNumberFormatter()
    const veins = useGameStore((s) => s.locations[s.location].oreVeins)
    const searchActId = useGameStore(
        (s) => ActivityAdapter.find(s.activities, (w) => w.type === ActivityTypes.MiningVeinSearch)?.id
    )

    const onSearch = useCallback(() => addMiningVeinSearch(), [])
    const onStopSearch = useCallback(() => removeActivity(searchActId), [searchActId])
    const onRemoveVein = useCallback((id: string) => {
        setState((s) => removeOreVein(s, s.location, id))
    }, [])

    return (
        <Card>
            <MyCardHeaderTitle title={t.OreVeins} icon={IconsData[Icons.Ore]} />
            <CardContent>
                <div className='mb-2'>
                    {searchActId ? (
                        <Button variant='destructive' onClick={onStopSearch}>
                            {t.Stop}
                        </Button>
                    ) : (
                        <AddActivityDialog
                            title={
                                <>
                                    {IconsData.Pickaxe} {t.SearchOreVein}
                                </>
                            }
                            openBtn={<Button>{t.SearchOreVein}</Button>}
                            addBtn={<Button onClick={onSearch}>{t.Add}</Button>}
                        />
                    )}
                </div>
                <MyLabel>
                    {t.Time} {fun.formatTime(SEARCH_ORE_VEIN_TIME)}
                </MyLabel>
                <GameTimerProgress actionId={searchActId} color='primary' className='mb-2' />
                <MyLabel>{veins.length}/10</MyLabel>
                {veins.map((vein) => (
                    <div key={vein.id} className='mb-2 rounded border p-2'>
                        <MyLabel>
                            {vein.oreType} - {t.OreQta}: {f(vein.qta)}
                        </MyLabel>
                        <MyLabel>
                            {t.OreHp}: {f(vein.hp)} / {f(vein.maxHp)}
                        </MyLabel>
                        <MyLabel>
                            {t.VeinArmour}: {f(vein.armour)} - {t.VeinGemChance}: {f(vein.gemChance * 100)}%
                        </MyLabel>
                        <Button variant='destructive' onClick={() => onRemoveVein(vein.id)}>
                            {t.Remove}
                        </Button>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
})
