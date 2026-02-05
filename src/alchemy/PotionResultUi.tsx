import { memo } from 'react'
import { AlertCircleIcon, CheckCircle2Icon } from 'lucide-react'
import { useTranslations } from '../msg/useTranslations'
import { useNumberFormatter } from '../formatters/selectNumberFormatter'
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert'
import { BonusDialog } from '../bonus/ui/BonusUi'
import { MyLabel } from '../ui/myCard/MyLabel'
import { PotionItem } from './PotionCraftingResult'
import { PotionResult } from './alchemyTypes'

export const PotionResultUi = memo(function PotionItem({ result }: { result: PotionItem }) {
    const { t } = useTranslations()
    const { f } = useNumberFormatter()

    if (!result || result.potionResult === PotionResult.NotPotion) return null

    return (
        <div className="mb-2 flex flex-col gap-2">
            <MyLabel className="mb-1">
                {t.Stability} {f(result.stability)}%
                {result.potionResultBonusList && (
                    <BonusDialog
                        title={`${t.Stability} ${f(result.stability)}%`}
                        selectBonusResult={result.potionResultBonusList}
                    />
                )}
            </MyLabel>

            {result.potionResult === PotionResult.Stable && (
                <Alert variant="success">
                    <CheckCircle2Icon />
                    <AlertTitle>{t.Stable}</AlertTitle>
                    <AlertDescription>{t.NormalPotionDesc}</AlertDescription>
                </Alert>
            )}
            {result.potionResult === PotionResult.Unstable && (
                <Alert variant="warning">
                    <AlertCircleIcon />
                    <AlertTitle>{t.Unstable}</AlertTitle>
                    <AlertDescription>{t.UnstablePotionDesc}</AlertDescription>
                </Alert>
            )}
            {result.potionResult === PotionResult.Chaotic && (
                <Alert variant="destructive">
                    <AlertCircleIcon />
                    <AlertTitle>{t.Chaotic}</AlertTitle>
                    <AlertDescription>{t.ChaoticPotionDesc}</AlertDescription>
                </Alert>
            )}
            {result.potionResult === PotionResult.Unknown && (
                <Alert variant="warning">
                    <AlertCircleIcon />
                    <AlertTitle>{t.Unknown}</AlertTitle>
                    <AlertDescription>{t.UnknownPotionDesc}</AlertDescription>
                </Alert>
            )}
            {result.stability < 0 && (
                <Alert variant="destructive">
                    <AlertCircleIcon />
                    <AlertTitle>{t.LowStabilityNotCraftable}</AlertTitle>
                    <AlertDescription>{t.LowStabilityNotCraftableDesc}</AlertDescription>
                </Alert>
            )}

            {result.unknownEffects && (
                <Alert variant="warning">
                    <AlertCircleIcon />
                    <AlertDescription>{t.UnknownEffects}</AlertDescription>
                </Alert>
            )}
        </div>
    )
})
