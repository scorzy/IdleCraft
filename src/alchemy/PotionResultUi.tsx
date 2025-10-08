import { memo } from 'react'
import { CheckCircle2Icon } from 'lucide-react'
import { useTranslations } from '../msg/useTranslations'
import { useNumberFormatter } from '../formatters/selectNumberFormatter'
import { Badge } from '../components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert'
import { PotionItem } from './PotionCraftingResult'

export const PotionResultUi = memo(function PotionItem({ result }: { result: PotionItem }) {
    const { t } = useTranslations()
    const { f } = useNumberFormatter()
    return (
        <div>
            <Alert variant="success">
                <CheckCircle2Icon />
                <AlertTitle>Success! Your changes have been saved</AlertTitle>
                <AlertDescription>This is an alert with icon, title and description.</AlertDescription>
            </Alert>

            {t.Stability}
            <Badge size="base">{f(result.stability)}%</Badge>
        </div>
    )
})
