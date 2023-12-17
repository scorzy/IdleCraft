import { useEffect } from 'react'
import { useGameStore } from '../game/state'
import { GameState } from '../game/GameState'
import { useToast } from '@/components/ui/use-toast'

const selectNotifications = (s: GameState) => s.notifications
const removeNotifications = () =>
    useGameStore.setState((s) => ({
        ...s,
        notifications: [],
    }))

export function ToasterProvider() {
    const notifications = useGameStore(selectNotifications)
    const { toast } = useToast()

    useEffect(() => {
        if (notifications.length < 1) return
        for (const notification of notifications) toast({ ...notification })
        removeNotifications()
    }, [notifications, toast])
}
