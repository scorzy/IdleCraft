import { memo } from 'react'
import { TbAlertTriangle } from 'react-icons/tb'
import { ExpEnum } from '@/experience/ExpEnum'
import { PLAYER_ID } from '../../characters/charactersConst'
import { EquipSlotsEnum } from '../../characters/equipSlotsEnum'
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert'
import { ExperienceCard } from '../../experience/ui/ExperienceCard'
import { useNumberFormatter } from '../../formatters/selectNumberFormatter'
import { useGameStore } from '../../game/state'
import { EquipItemUi } from '../../items/ui/EquipSelect'
import { useTranslations } from '../../msg/useTranslations'
import { MyPage, MyPageAll } from '../../ui/pages/MyPage'
import { selectWoodType } from '../../ui/state/uiSelectors'
import { isSelectedWoodEnabled } from '../selectors/WoodcuttingSelectors'
import { WoodData } from '../WoodData'
import { Cutting } from './Cutting'
import { Forest } from './Forest'
import { GrowSpeedBoost } from './GrowSpeedBoost'
import { WoodcuttingSidebar } from './WoodcuttingSidebar'

export const Woodcutting = memo(function Woodcutting() {
    const woodType = useGameStore(selectWoodType)
    return (
        <MyPageAll
            key={woodType}
            sidebar={<WoodcuttingSidebar />}
            header={
                <div className="page__info">
                    <ExperienceCard expType={ExpEnum.Woodcutting} charId={PLAYER_ID} />
                    <EquipItemUi slot={EquipSlotsEnum.WoodAxe} />
                </div>
            }
        >
            <MyPage className="page__main">
                <WoodPage />
            </MyPage>
        </MyPageAll>
    )
})

const WoodPage = memo(function WoodPage() {
    const { f } = useNumberFormatter()
    const { t, fun } = useTranslations()
    const woodType = useGameStore(selectWoodType)
    const enabled = useGameStore(isSelectedWoodEnabled)

    const data = WoodData[woodType]

    if (!enabled)
        return (
            <Alert variant="destructive">
                <TbAlertTriangle className="h-4 w-4" />
                <AlertTitle>{t.LevelToLow}</AlertTitle>
                <AlertDescription>{fun.requireWoodcuttingLevel(f(data.requiredLevel))}</AlertDescription>
            </Alert>
        )

    return (
        <>
            <Cutting />
            <GrowSpeedBoost />
            <Forest />
        </>
    )
})
