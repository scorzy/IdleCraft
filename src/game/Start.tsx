import { memo, SetStateAction, useCallback, useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PLAYER_ID } from '../characters/charactersConst'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '../components/ui/alert-dialog'
import { Button } from '../components/ui/button'
import { TrashIcon } from '../icons/IconsMemo'
import { useTranslations } from '../msg/useTranslations'
import { ProgressBar } from '../ui/progress/ProgressBar'
import { useUiTempStore } from '../ui/state/uiTempStore'
import { getUniqueId } from '../utils/getUniqueId'
import { load, startAnyway, stopLoad } from './functions/gameFunctions'
import { GameState } from './GameState'
import {
    selectLoading,
    selectLoadingEnd,
    selectLoadingNow,
    selectLoadingProgress,
    selectLoadingStart,
} from './gameSelectors'
import { GetInitialGameState } from './InitialGameState'
import { SaveImportDialog } from './save/ui/SaveImportDialog'
import classes from './start.module.css'
import { useGameStore } from './state'

const startGame = (name: string) => () => {
    if (name === '') return

    useGameStore.setState((s) => {
        s = GetInitialGameState()
        s.gameId = getUniqueId()
        const player = s.characters.entries[PLAYER_ID]
        if (player) player.name = name
        return s
    })
}

interface NameId {
    name: string
    gameId: string
    state: GameState
}

export const Start = memo(function Start() {
    const [loadName, setLoadName] = useState<NameId[]>([])

    useEffect(() => {
        const open = window.indexedDB.open('IdleCraft', 1)
        open.onsuccess = () => {
            const db = open.result
            if (!db.objectStoreNames.contains('save')) return
            const transaction = db.transaction('save', 'readonly')
            const objectStore = transaction.objectStore('save')

            const nameIds: NameId[] = []
            transaction.oncomplete = () => setLoadName(nameIds)

            const req = objectStore.getAll()
            req.onsuccess = () => {
                const res = req.result
                res.forEach((value) => {
                    if (!('gameId' in value && 'characters' in value)) return
                    try {
                        const name: string = value.characters?.entries[PLAYER_ID]?.name
                        const gameId: string = value.gameId
                        if (name) nameIds.push({ gameId, name, state: value as GameState })
                    } catch (e) {
                        console.error(e)
                    }
                })
            }
        }
    }, [])

    return (
        <div className={classes.container}>
            <NewGame />
            <LoadFromIndexedDb loadName={loadName} setLoadName={setLoadName} />
            <SaveImportDialog />
            <Loading />
        </div>
    )
})

const NewGame = memo(function NewGame() {
    const { t } = useTranslations()
    const [name, setName] = useState('')
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="secondary">{t.NewGame}</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogTitle>{t.NewGame}</DialogTitle>
                <DialogDescription></DialogDescription>
                <Label htmlFor="name">{t.Name}</Label>
                <Input id="name" maxLength={10} value={name} onChange={onChange} />
                <div>
                    <Button onClick={startGame(name)} disabled={name.length < 1}>
                        {t.Start}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
})

const LoadFromIndexedDb = memo(function LoadFromIndexedDb(props: {
    loadName: NameId[]
    setLoadName: React.Dispatch<SetStateAction<NameId[]>>
}) {
    const { t } = useTranslations()

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">{t.LoadFromIndexedDB}</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[520px]">
                <DialogHeader>
                    <DialogTitle>{t.LoadFromIndexedDB}</DialogTitle>
                    <DialogDescription>{t.SavedGames}</DialogDescription>
                </DialogHeader>
                {props.loadName.length > 0 ? (
                    <div className={classes.btnContainer}>
                        {props.loadName.map((item) => (
                            <LoadUi item={item} key={item.gameId} setLoadName={props.setLoadName} />
                        ))}
                    </div>
                ) : (
                    <span className="text-muted-foreground text-sm">{t.NoSavesFound}</span>
                )}
            </DialogContent>
        </Dialog>
    )
})

const LoadUi = memo(function LoadUi(props: { item: NameId; setLoadName: React.Dispatch<SetStateAction<NameId[]>> }) {
    const { item, setLoadName } = props
    const { t } = useTranslations()
    const deleteGame = useCallback(() => {
        const open = window.indexedDB.open('IdleCraft', 1)
        open.onsuccess = () => {
            const db = open.result
            if (!db.objectStoreNames.contains('save')) return
            const transaction = db.transaction('save', 'readwrite')
            const objectStore = transaction.objectStore('save')
            const req = objectStore.delete(item.state.gameId)

            req.onsuccess = () => setLoadName((loadName: NameId[]) => loadName.filter((e) => e.gameId !== item.gameId))
        }
    }, [setLoadName, item.state.gameId, item.gameId])

    const state = item.state
    const loadClick = useCallback(() => load(state), [state])

    return (
        <>
            <Button onClick={loadClick}>{item.name}</Button>
            <span className="text-muted-foreground min-w-20 text-right text-sm">
                <TimeAgo date={item.state.now} /> {t.Ago}
            </span>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="ghost" title={t.Delete} className="text-muted-foreground">
                        {TrashIcon}
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t.deleteSaveTitle}</AlertDialogTitle>
                        <AlertDialogDescription>{t.deleteSaveDesc}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
                        <AlertDialogAction onClick={deleteGame}>{t.Delete}</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
})

const TimeAgo = memo(function TimeAgo(props: { date: number }) {
    const { date } = props
    const { fun } = useTranslations()

    const [time, setTime] = useState(Date.now())

    useEffect(() => {
        const interval = setInterval(() => setTime(Date.now()), 1000)
        return () => {
            clearInterval(interval)
        }
    }, [])

    const timeDiff = 1e3 * Math.floor((time - date) / 1e3)

    return <>{fun.formatTime(timeDiff)}</>
})

const Loading = memo(function Loading() {
    const { t } = useTranslations()
    const loading = useGameStore(selectLoading)

    return (
        <Dialog open={loading} onOpenChange={stopLoad}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t.Loading}</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <LoadingProgress />
                <DialogFooter className="sm:justify-start">
                    <Button type="button" variant="destructive" onClick={startAnyway}>
                        {t.StartNow}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
})
const LoadingProgress = memo(function LoadingProgress() {
    const { fun } = useTranslations()
    const percent = useUiTempStore(selectLoadingProgress)
    const start = useUiTempStore(selectLoadingStart)
    const end = useUiTempStore(selectLoadingEnd)
    const now = useUiTempStore(selectLoadingNow)
    const total = end - start
    const done = now - start

    return (
        <>
            <span>
                <span className="inline-block min-w-24">{fun.formatTimePrecise(done)} </span>/ {fun.formatTimePrecise(total)}
            </span>
            <ProgressBar value={percent} color="primary" />
        </>
    )
})
