import { memo, useCallback, useEffect, useReducer, useRef } from 'react'
import { TbAlertTriangle } from 'react-icons/tb'
import { ExpEnum } from '@/experience/ExpEnum'
import { PLAYER_ID } from '../../characters/charactersConst'
import { EquipSlotsEnum } from '../../characters/equipSlotsEnum'
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert'
import { ExperienceCard } from '../../experience/ui/ExperienceCard'
import { useNumberFormatter } from '../../formatters/selectNumberFormatter'
import { GameState } from '../../game/GameState'
import { useGameStore } from '../../game/state'
import { EquipItemUi } from '../../items/ui/EquipSelect'
import { useTranslations } from '../../msg/useTranslations'
import { MyPage, MyPageAll } from '../../ui/pages/MyPage'
import { selectOreType } from '../../ui/state/uiSelectors'
import { isOreEnabled } from '../miningSelectors'
import { OreData } from '../OreData'
import { MiningOre } from './MiningOre'
import { MiningSidebar } from './MiningSidebar'
import { OreUi } from './OreUi'
import { OreVeinsUi } from './OreVeins'

export const Mining = memo(function Mining() {
    const oreType = useGameStore(selectOreType)
    const miningOreLockRef = useRef<HTMLDivElement>(null)
    const oreVeinsRef = useRef<HTMLDivElement>(null)
    const [layout, updateLayout] = useReducer(
        (
            _: { isOreVeinsScrollable: boolean; oreVeinsMaxHeight?: number },
            next: { isOreVeinsScrollable: boolean; oreVeinsMaxHeight?: number }
        ) => next,
        { isOreVeinsScrollable: false, oreVeinsMaxHeight: undefined }
    )

    useEffect(() => {
        const checkOffsetTop = () => {
            const miningOreLockTop = miningOreLockRef.current?.offsetTop
            const oreVeinsTop = oreVeinsRef.current?.offsetTop
            const oreVeinsTopViewport = oreVeinsRef.current?.getBoundingClientRect().top

            if (miningOreLockTop === undefined || oreVeinsTop === undefined || oreVeinsTopViewport === undefined) {
                updateLayout({ isOreVeinsScrollable: false, oreVeinsMaxHeight: undefined })
                return
            }

            const isSameRow = miningOreLockTop === oreVeinsTop
            if (!isSameRow) {
                updateLayout({ isOreVeinsScrollable: false, oreVeinsMaxHeight: undefined })
                return
            }

            const oreVeinsHeaderHeight =
                oreVeinsRef.current?.querySelector<HTMLElement>('[data-slot="card-header"]')?.offsetHeight ?? 0
            const availableHeight = Math.floor(window.innerHeight - oreVeinsTopViewport - 72)
            const availableContentHeight = Math.max(120, availableHeight - oreVeinsHeaderHeight)
            updateLayout({ isOreVeinsScrollable: true, oreVeinsMaxHeight: availableContentHeight })
        }

        checkOffsetTop()

        const resizeObserver = new ResizeObserver(checkOffsetTop)
        if (miningOreLockRef.current) resizeObserver.observe(miningOreLockRef.current)
        if (oreVeinsRef.current) resizeObserver.observe(oreVeinsRef.current)
        window.addEventListener('resize', checkOffsetTop)

        return () => {
            resizeObserver.disconnect()
            window.removeEventListener('resize', checkOffsetTop)
        }
    }, [])

    const enabled = useGameStore(useCallback((state: GameState) => isOreEnabled(oreType)(state), [oreType]))

    return (
        <MyPageAll
            sidebar={<MiningSidebar />}
            header={
                <div className="page__info">
                    <ExperienceCard expType={ExpEnum.Mining} charId={PLAYER_ID} />
                    <EquipItemUi slot={EquipSlotsEnum.Pickaxe} />
                </div>
            }
        >
            <MyPage className="page__main" key={oreType}>
                <div ref={miningOreLockRef}>
                    {enabled && <MiningOre />}
                    {!enabled && <MiningOreLock />}
                </div>

                {enabled && (
                    <>
                        <OreUi />
                        <OreVeinsUi
                            containerRef={oreVeinsRef}
                            isScrollable={layout.isOreVeinsScrollable}
                            maxHeight={layout.oreVeinsMaxHeight}
                        />
                    </>
                )}
            </MyPage>
        </MyPageAll>
    )
})

const MiningOreLock = memo(function MiningOreLock() {
    const { f } = useNumberFormatter()
    const { t, fun } = useTranslations()
    const oreType = useGameStore(selectOreType)
    const data = OreData[oreType]

    return (
        <Alert variant="destructive">
            <TbAlertTriangle className="h-4 w-4" />
            <AlertTitle>{t.LevelToLow}</AlertTitle>
            <AlertDescription>{fun.requireMiningLevel(f(data.requiredLevel))}</AlertDescription>
        </Alert>
    )
})
