import { SetStateAction, memo, useCallback, useEffect, useState } from 'react'
import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog'
import { Button } from '../components/ui/button'
import { PLAYER_ID } from '../characters/charactersConst'
import { TrashIcon } from '../icons/IconsMemo'
import { useTranslations } from '../msg/useTranslations'
import { getUniqueId } from '../utils/getUniqueId'
import { useNumberFormatter } from '../formatters/selectNumberFormatter'
import { ProgressBar } from '../ui/progress/ProgressBar'
import { useGameStore } from './state'
import { GetInitialGameState } from './InitialGameState'
import { load, startAnyway, stopLoad } from './functions/gameFunctions'
import { GameState } from './GameState'
import classes from './start.module.css'
import {
    selectLoading,
    selectLoadingEnd,
    selectLoadingNow,
    selectLoadingProgress,
    selectLoadingStart,
} from './gameSelectors'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from '@/components/ui/dialog'

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
    const { t } = useTranslations()
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
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                        const name: string = value.characters?.entries[PLAYER_ID]?.name
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
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
            <Loading />
            {loadName.length > 0 && (
                <>
                    <span className="text-center">{t.SavedGames}</span>
                    <div className={classes.btnContainer}>
                        {loadName.map((item) => (
                            <LoadUi item={item} key={item.name} setLoadName={setLoadName} />
                        ))}
                    </div>
                </>
            )}
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

const LoadUi = memo(function LoadUi(props: { item: NameId; setLoadName: React.Dispatch<SetStateAction<NameId[]>> }) {
    const { item, setLoadName } = props
    const { t } = useTranslations()
    const name = item.name

    const deleteGame = useCallback(() => {
        const open = window.indexedDB.open('IdleCraft', 1)
        open.onsuccess = () => {
            const db = open.result
            if (!db.objectStoreNames.contains('save')) return
            const transaction = db.transaction('save', 'readwrite')
            const objectStore = transaction.objectStore('save')
            const req = objectStore.delete(item.state.gameId)

            req.onsuccess = () => setLoadName((loadName: NameId[]) => loadName.filter((e) => e.name !== name))
        }
    }, [name, setLoadName, item.state.gameId])

    const state = item.state
    const loadClick = useCallback(() => load(state), [state])

    return (
        <>
            <Button onClick={loadClick}>{item.name}</Button>
            <span className="text-muted-foreground min-w-20 text-right text-sm">
                <TimeAgo date={item.state.now} /> {t.Ago}
            </span>
            <Button onClick={deleteGame} variant="ghost" title={t.Delete} className="text-muted-foreground">
                {TrashIcon}
            </Button>
        </>
    )
})

const TimeAgo = memo(function TimeAgo(props: { date: number }) {
    const { date } = props
    const { ft } = useNumberFormatter()

    const [time, setTime] = useState(Date.now())

    useEffect(() => {
        const interval = setInterval(() => setTime(Date.now()), 1000)
        return () => {
            clearInterval(interval)
        }
    }, [])

    const timeDiff = 1e3 * Math.floor((time - date) / 1e3)

    return <>{ft(timeDiff)}</>
})

const Loading = memo(function Loading() {
    const { ftp } = useNumberFormatter()
    const { t } = useTranslations()
    const loading = useGameStore(selectLoading)
    const percent = useGameStore(selectLoadingProgress)
    const start = useGameStore(selectLoadingStart)
    const end = useGameStore(selectLoadingEnd)
    const now = useGameStore(selectLoadingNow)
    const total = end - start
    const done = now - start

    return (
        <Dialog open={loading} onOpenChange={stopLoad}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t.Loading}</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                {ftp(done)} / {ftp(total)}
                <ProgressBar value={percent} color="primary" />
                <DialogFooter className="sm:justify-start">
                    <Button type="button" variant="destructive" onClick={startAnyway}>
                        {t.StartNow}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
})
