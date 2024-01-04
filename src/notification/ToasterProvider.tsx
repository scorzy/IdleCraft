import { useEffect } from 'react'
import { useGameStore } from '../game/state'
import { GameState } from '../game/GameState'
import { useTranslations } from '../msg/useTranslations'
import { ToastType, useToast } from '@/components/ui/use-toast'

const selectNotifications = (s: GameState) => s.notifications
const removeNotifications = () =>
    useGameStore.setState((s) => ({
        ...s,
        notifications: [],
    }))

export function ToasterProvider() {
    const notifications = useGameStore(selectNotifications)
    const { t } = useTranslations()
    const { toast } = useToast()

    useEffect(() => {
        if (notifications.length < 1) return

        for (const n of notifications) {
            const myToast: ToastType = {}
            if (n.title) myToast.title = n.title
            if (n.titleId) myToast.title = t[n.titleId]
            if (n.descriptionId) myToast.title = t[n.descriptionId]
            if (n.iconId) myToast.iconId = n.iconId

            toast(myToast)
        }
        removeNotifications()
    }, [notifications, toast, t])
}
