import { useCallback, useEffect, useState } from 'react'
import { TbAlertTriangle } from 'react-icons/tb'
import { Button } from '../components/ui/button'
import { PLAYER_ID } from '../characters/charactersConst'
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert'
import { TrashIcon } from '../icons/IconsMemo'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card'
import { ProgressBar } from '../ui/progress/ProgressBar'
import { useGameStore } from './state'
import { GetInitialGameState } from './InitialGameState'
import classes from './start.module.css'
import { load } from './gameFunctions'
// eslint-disable-next-line import/default
import LoadWorker from './loadWorker.ts?worker'
import { GameState } from './GameState'
import { regenerate } from './regenerate'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'

setInterval(() => useGameStore.setState((s) => regenerate(s, Date.now())), 1e3)

if (!('indexedDB' in window)) {
    console.log("This browser doesn't support IndexedDB")
} else {
    const open = window.indexedDB.open('IdleCraft', 1)

    open.onupgradeneeded = () => {
        const db = open.result
        db.createObjectStore('save', { keyPath: 'gameId' })
    }
    open.onsuccess = () => {
        useGameStore.subscribe((state: GameState) => {
            if (state.gameId === '') return
            const db = open.result

            const transaction = db.transaction('save', 'readwrite')
            const objectStore = transaction.objectStore('save')

            const putRes = objectStore.put(state)
            putRes.onerror = () => {
                console.log(`Save failed`)
            }
        })
    }
}

const startGame = (gameId: string) => () => {
    if (gameId !== '')
        useGameStore.setState((s) => {
            s = GetInitialGameState()
            s.gameId = gameId
            const player = s.characters.entries[PLAYER_ID]
            if (player) player.name = gameId
            return s
        })
}

interface SavedData {
    gameId: string
    loadedState?: GameState
    progress: number
    error?: string
}

export function Start() {
    const [name, setName] = useState('')
    const [loadName, setLoadName] = useState<Record<string, SavedData>>({})
    const [workers, setWorkers] = useState<Worker[]>([])

    const loadClick = useCallback(
        (obj: SavedData) => () => {
            if (!obj.loadedState) return
            console.log(obj)
            workers.forEach((w) => {
                w.postMessage({ kill: true })
                w.terminate()
            })
            setWorkers([])
            load(obj.loadedState)
        },
        [workers]
    )

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        setName(newValue)
    }

    const onmessage = useCallback(
        (e: MessageEvent<{ gameId: string; progress?: number; loadedState?: GameState }>) => {
            const { gameId, progress, loadedState } = e.data
            setLoadName((old) => ({
                ...old,
                [gameId]: { gameId, loadedState, progress: loadedState ? 100 : progress ?? 0 },
            }))
        },
        [setLoadName]
    )

    useEffect(() => {
        if (!('indexedDB' in window)) {
            console.log("This browser doesn't support IndexedDB")
            return
        }

        const open = window.indexedDB.open('IdleCraft', 1)
        open.onsuccess = () => {
            const db = open.result
            if (!db.objectStoreNames.contains('save')) return
            const transaction = db.transaction('save', 'readonly')
            const objectStore = transaction.objectStore('save')

            const nameIds: GameState[] = []
            transaction.oncomplete = () => {
                const a: Record<string, SavedData> = {}

                const workers: Worker[] = []
                nameIds.forEach((n) => {
                    a[n.gameId] = { gameId: n.gameId, progress: 0 }
                    const worker = new LoadWorker()
                    worker.onmessage = onmessage
                    worker.postMessage({ toLoad: n })
                    workers.push(worker)
                })

                setLoadName(a)
                setWorkers(workers)
            }

            const req = objectStore.getAll()
            req.onsuccess = () => {
                const res = req.result
                res.forEach((value) => {
                    if ('gameId' in value) {
                        nameIds.push(value as GameState)
                    }
                })
            }
        }
    }, [onmessage])

    const deleteGame = (name: string) => () => {
        if (!('indexedDB' in window)) {
            console.log("This browser doesn't support IndexedDB")
            return
        }
        const open = window.indexedDB.open('IdleCraft', 1)
        open.onsuccess = () => {
            const db = open.result
            if (!db.objectStoreNames.contains('save')) return
            const transaction = db.transaction('save', 'readwrite')
            const objectStore = transaction.objectStore('save')
            const req = objectStore.delete(name)
            const { [name]: _, ...rest } = loadName
            req.onsuccess = () => setLoadName(rest)
        }
    }

    if (!('indexedDB' in window))
        return (
            <div className={classes.container}>
                <Alert variant="destructive">
                    <TbAlertTriangle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>IndexedDB not found, please check your browser permission</AlertDescription>
                </Alert>
            </div>
        )

    const games = Object.values(loadName)

    return (
        <div className={classes.mainContainer}>
            <div className={classes.container}>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="secondary">New Game</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" maxLength={10} className="col-span-3" value={name} onChange={onChange} />
                        <div>
                            <Button onClick={startGame(name)} disabled={name.length < 1}>
                                Start
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
                {games.length > 0 && (
                    <div className={classes.btnContainer}>
                        {games.map((item) => (
                            <Card key={item.gameId}>
                                <CardHeader>
                                    <CardTitle>{item.gameId}</CardTitle>
                                </CardHeader>
                                {!item.error && (
                                    <CardContent>
                                        <span className="text-muted-foreground">
                                            {item.loadedState ? 'Ready' : 'Loading'}
                                        </span>
                                        <ProgressBar value={item.progress} color={'secondary'}></ProgressBar>
                                    </CardContent>
                                )}
                                {!!item.error && (
                                    <CardContent>
                                        <Alert variant="destructive">
                                            <TbAlertTriangle className="h-4 w-4" />
                                            <AlertTitle>Error</AlertTitle>
                                            <AlertDescription>{item.error}</AlertDescription>
                                        </Alert>
                                    </CardContent>
                                )}
                                <CardFooter>
                                    <Button onClick={loadClick(item)} disabled={!item.loadedState}>
                                        Load
                                    </Button>
                                    <Button onClick={deleteGame(item.gameId)} variant="ghost" title="delete">
                                        {TrashIcon}
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
