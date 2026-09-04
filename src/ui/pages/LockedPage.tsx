import { memo } from 'react'
import { TbLock } from 'react-icons/tb'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { useTranslations } from '../../msg/useTranslations'
import { MyPage } from './MyPage'

export const LockedPage = memo(function LockedPage() {
    const { t } = useTranslations()

    return (
        <MyPage className="flex justify-center pt-12">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <CardTitle className="justify-center">
                        <TbLock />
                        {t.Locked}
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">{t.CompleteMoreQuestsToUnlock}</CardContent>
            </Card>
        </MyPage>
    )
})
