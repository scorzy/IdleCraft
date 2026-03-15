import { useEffect } from 'react'
import { ExternalToast, toast } from 'sonner'
import { GameState } from '../game/GameState'
import { useGameStore } from '../game/state'
import { IconsData } from '../icons/Icons'
import { useTranslations } from '../msg/useTranslations'

const selectNotifications = (s: GameState) => s.notifications
const removeNotifications = () =>
    useGameStore.setState((s) => ({
        ...s,
        notifications: [],
    }))

export function ToasterProvider() {
    const notifications = useGameStore(selectNotifications)
    const { t } = useTranslations()

    useEffect(() => {
        if (notifications.length < 1) return

        for (const n of notifications) {
            const toastData: ExternalToast = {}
            let title = n.title
            if (n.titleId) title = t[n.titleId]
            if (n.descriptionId) toastData.description = t[n.descriptionId]
            if (n.iconId) toastData.icon = IconsData[n.iconId]

            toast(title, toastData)
        }
        removeNotifications()
    }, [notifications, t])
}
